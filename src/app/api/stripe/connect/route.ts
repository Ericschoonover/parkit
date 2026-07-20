import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeAccountId: true, stripeOnboarded: true, email: true, name: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let accountId = user.stripeAccountId;

    if (!accountId) {
      // Create a new Stripe Connect account
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: session.user.id,
        },
      });

      accountId = account.id;

      await db.user.update({
        where: { id: session.user.id },
        data: { stripeAccountId: accountId },
      });
    }

    // Create an onboarding link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://park-it.net";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${appUrl}/dashboard`,
      return_url: `${appUrl}/dashboard?stripe=success`,
      type: "account_onboarding",
    });

    return Response.json({ url: accountLink.url });
  } catch (error) {
    console.error("Stripe Connect error:", error);
    return Response.json({ error: "Failed to create Stripe onboarding" }, { status: 500 });
  }
}
