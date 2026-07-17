import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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
      _sum: { ownerPayout: true },
    });

    const reviewsResult = await db.review.aggregate({
      where: { subjectId: userId },
      _avg: { rating: true },
    });

    // Get recent bookings
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
          },
        },
        event: {
          select: {
            name: true,
            venue: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      take: 5,
    });

    return Response.json({
      stats: {
        totalListings,
        totalBookings: bookingsAsRenter + bookingsAsOwner,
        totalEarnings: earningsResult._sum.ownerPayout
          ? Number(earningsResult._sum.ownerPayout)
          : 0,
        avgRating: reviewsResult._avg.rating
          ? Number(reviewsResult._avg.rating).toFixed(1)
          : null,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
