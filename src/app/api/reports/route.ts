import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const REPORT_REASONS = [
  "FRAUDULENT_LISTING",
  "DANGEROUS_LOCATION",
  "MISLEADING_DESCRIPTION",
  "ILLEGAL_ACTIVITY",
  "SPAM_OR_SCAM",
  "WRONG_ADDRESS",
  "NO_ACCESS",
  "OTHER",
];

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { listingId, reason, description } = body;

    if (!listingId || !reason) {
      return Response.json({ error: "Missing listingId or reason" }, { status: 400 });
    }

    if (!REPORT_REASONS.includes(reason)) {
      return Response.json({ error: "Invalid reason" }, { status: 400 });
    }

    // Check listing exists
    const listing = await db.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Prevent reporting own listing
    if (listing.ownerId === session.user.id) {
      return Response.json({ error: "Cannot report your own listing" }, { status: 400 });
    }

    // Check for duplicate report from same user on same listing
    const existing = await db.report.findFirst({
      where: {
        listingId,
        reporterId: session.user.id,
        status: { in: ["PENDING", "REVIEWED"] },
      },
    });

    if (existing) {
      return Response.json({ error: "You have already reported this listing" }, { status: 409 });
    }

    const report = await db.report.create({
      data: {
        listingId,
        reporterId: session.user.id,
        reason,
        description: description || null,
        status: "PENDING",
      },
    });

    return Response.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Create report error:", error);
    return Response.json({ error: "Failed to submit report" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Admin view: return all reports for listings owned by this user
    const reports = await db.report.findMany({
      where: {
        listing: { ownerId: session.user.id },
      },
      include: {
        listing: {
          select: { id: true, title: true, address: true, city: true },
        },
        reporter: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ reports });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
