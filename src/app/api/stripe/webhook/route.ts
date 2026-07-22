import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;
        const paymentType = paymentIntent.metadata.type;

        if (bookingId) {
          if (paymentType === "deposit") {
            // Deposit payment succeeded — deposit is now held on platform
            console.log(`Deposit for booking ${bookingId} received and held on platform`);
          } else {
            // Parking payment succeeded — confirm booking
            await db.booking.update({
              where: { id: bookingId },
              data: { status: "CONFIRMED" },
            });
            console.log(`Booking ${bookingId} confirmed via parking payment`);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.bookingId;
        const paymentType = paymentIntent.metadata.type;

        if (bookingId && paymentType !== "deposit") {
          // Only cancel on parking payment failure, not deposit failure
          await db.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
          });
          console.log(`Booking ${bookingId} cancelled due to parking payment failure`);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        const userId = account.metadata?.userId;

        if (userId && account.charges_enabled) {
          await db.user.update({
            where: { id: userId },
            data: { stripeOnboarded: true },
          });
          console.log(`User ${userId} Stripe onboarding completed`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const bookingId = charge.metadata?.bookingId;
        const paymentType = charge.metadata?.type;

        if (bookingId && paymentType !== "deposit") {
          // Only update booking status on parking refund, not deposit refund
          await db.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED" },
          });
          console.log(`Booking ${bookingId} refunded`);
        } else if (bookingId && paymentType === "deposit") {
          // Deposit refunded to guest — mark as released
          await db.booking.update({
            where: { id: bookingId },
            data: { depositStatus: "REFUNDED" },
          });
          console.log(`Deposit for booking ${bookingId} refunded to guest`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
