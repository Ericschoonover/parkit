import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        role: true,
        createdAt: true,
        stripeOnboarded: true,
      },
    });

    const listings = await db.listing.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        pricePerHour: true,
        pricePerDay: true,
        active: true,
        parkingType: true,
        _count: { select: { bookings: true } },
      },
    });

    const bookings = await db.booking.findMany({
      where: {
        OR: [
          { renterId: session.user.id },
          { listing: { ownerId: session.user.id } },
        ],
      },
      include: {
        listing: { select: { id: true, title: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const reviewsReceived = await db.review.findMany({
      where: { subjectId: session.user.id },
      include: {
        author: { select: { name: true, image: true } },
        booking: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const reviewsGiven = await db.review.findMany({
      where: { authorId: session.user.id },
      include: {
        subject: { select: { name: true, image: true } },
        booking: { select: { id: true, listing: { select: { title: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avgReview = reviewsReceived.length > 0
      ? reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / reviewsReceived.length
      : null;

    return Response.json({
      user,
      listings,
      bookings,
      reviewsReceived,
      reviewsGiven,
      stats: {
        totalListings: listings.length,
        totalBookings: bookings.length,
        avgRating: avgReview ? Number(avgReview.toFixed(1)) : null,
        totalReviews: reviewsReceived.length,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, role } = body;

    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(role && { role }),
      },
    });

    return Response.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
