import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function formatMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Get stats
    const totalListings = await db.listing.count({
      where: { ownerId: userId },
    });

    const bookingsAsRenter = await db.booking.count({
      where: { renterId: userId },
    });

    const bookingsAsOwner = await db.booking.count({
      where: { listing: { ownerId: userId } },
    });

    const earningsResult = await db.booking.aggregate({
      where: {
        listing: { ownerId: userId },
        status: "COMPLETED",
      },
      _sum: { ownerPayout: true, platformFee: true, damageDeposit: true },
    });

    const totalPlatformFees = earningsResult._sum.platformFee
      ? Number(earningsResult._sum.platformFee)
      : 0;
    const totalDepositsHeld = earningsResult._sum.damageDeposit
      ? Number(earningsResult._sum.damageDeposit)
      : 0;

    const reviewsResult = await db.review.aggregate({
      where: { subjectId: userId },
      _avg: { rating: true },
    });

    // Get recent bookings (all, for transaction history)
    const recentBookings = await db.booking.findMany({
      where: {
        OR: [
          { renterId: userId },
          { listing: { ownerId: userId } },
        ],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            photos: true,
            ownerId: true,
          },
        },
        event: {
          select: {
            name: true,
            venue: true,
          },
        },
        renter: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "desc" },
      take: 50,
    });

    // Get user's Stripe status
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripeOnboarded: true },
    });

    // Pending earnings (confirmed bookings that haven't ended yet)
    const pendingResult = await db.booking.aggregate({
      where: {
        listing: { ownerId: userId },
        status: "CONFIRMED",
        endTime: { gte: new Date() },
      },
      _sum: { ownerPayout: true },
    });

    // Upcoming bookings as host
    const upcomingAsHost = await db.booking.findMany({
      where: {
        listing: { ownerId: userId },
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { gte: new Date() },
      },
      include: {
        listing: { select: { title: true } },
        renter: { select: { name: true } },
      },
      orderBy: { startTime: "asc" },
      take: 5,
    });

    // Monthly earnings (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyBookings = await db.booking.findMany({
      where: {
        listing: { ownerId: userId },
        status: "COMPLETED",
        endTime: { gte: sixMonthsAgo },
      },
      select: { ownerPayout: true, endTime: true },
    });

    const monthlyEarnings: Record<string, number> = {};
    monthlyBookings.forEach((b) => {
      const key = formatMonth(b.endTime);
      monthlyEarnings[key] = (monthlyEarnings[key] || 0) + Number(b.ownerPayout);
    });

    return Response.json({
      stats: {
        totalListings,
        totalBookings: bookingsAsRenter + bookingsAsOwner,
        totalEarnings: earningsResult._sum.ownerPayout
          ? Number(earningsResult._sum.ownerPayout)
          : 0,
        totalPlatformFees,
        totalDepositsHeld,
        pendingEarnings: pendingResult._sum.ownerPayout
          ? Number(pendingResult._sum.ownerPayout)
          : 0,
        avgRating: reviewsResult._avg.rating
          ? Number(reviewsResult._avg.rating).toFixed(1)
          : null,
      },
      recentBookings,
      upcomingAsHost,
      monthlyEarnings,
      stripeOnboarded: user?.stripeOnboarded || false,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
