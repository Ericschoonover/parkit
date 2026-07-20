"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Shield, Ban, CreditCard, Loader2 } from "lucide-react";
import { format, addHours, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface ExistingBooking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface BookingFormProps {
  listingId: string;
  pricePerHour: number;
}

export function BookingForm({ listingId, pricePerHour }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("18:00");
  const [hours, setHours] = useState("3");
  const [loading, setLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/listing/${listingId}`);
      const data = await res.json();
      if (res.ok) {
        setExistingBookings(data.bookings || []);
      }
    } catch {
      // Silent fail
    }
  }, [listingId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const hoursNum = parseInt(hours);
  const parkingCost = pricePerHour * hoursNum;
  const platformFee = Math.round(parkingCost * 0.15 * 100) / 100;
  const totalAmount = parkingCost + platformFee;

  const bookedDates = existingBookings.map((b) => ({
    start: new Date(b.startTime),
    end: new Date(b.endTime),
  }));

  const isDateBooked = (d: Date) =>
    bookedDates.some((b) => isSameDay(d, b.start) || isSameDay(d, b.end) || (d > b.start && d < b.end));

  const getBookedSlotsForDate = (d: Date) =>
    bookedDates.filter((b) => isSameDay(d, b.start) || isSameDay(d, b.end) || (d > b.start && d < b.end));

  const checkConflict = (startDateTime: Date, endDateTime: Date) =>
    existingBookings.some(
      (b) =>
        new Date(b.startTime) < endDateTime && new Date(b.endTime) > startDateTime
    );

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const [h, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(h, minutes, 0, 0);
    const endDateTime = addHours(startDateTime, hoursNum);

    if (checkConflict(startDateTime, endDateTime)) {
      setConflictError("This time slot conflicts with an existing booking. Please choose a different time.");
      return;
    }

    setConflictError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      // Show Stripe payment form
      setBookingId(data.booking.id);
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // If payment is in progress, show Stripe form
  if (clientSecret && bookingId) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-800 flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Complete Payment
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Enter your card details below to confirm your booking.
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setClientSecret(null);
            setBookingId(null);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  const upcomingBookings = existingBookings
    .filter((b) => new Date(b.endTime) >= new Date())
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {upcomingBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
            <Ban className="h-3 w-3" /> Upcoming Bookings
          </p>
          <div className="space-y-1.5">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="text-xs text-amber-700">
                {format(new Date(b.startTime), "MMM d, h:mm a")} – {format(new Date(b.endTime), "h:mm a")}
                <span className="ml-1.5 text-amber-500 font-medium">Booked</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label className="text-sm font-medium">Date</Label>
        <Popover>
          <PopoverTrigger
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium w-full text-left mt-1.5",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date() || isDateBooked(d)}
              modifiers={{ booked: (d) => isDateBooked(d) }}
              modifiersStyles={{
                booked: { backgroundColor: "#fef2f2", color: "#dc2626", textDecoration: "line-through" },
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {date && getBookedSlotsForDate(date).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-800 mb-1">Booked times on this date:</p>
          {getBookedSlotsForDate(date).map((slot, i) => (
            <p key={i} className="text-xs text-red-600">
              {format(slot.start, "h:mm a")} – {format(slot.end, "h:mm a")}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-medium">Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setConflictError(null);
            }}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Duration</Label>
          <Select value={hours} onValueChange={(v) => { if (v) { setHours(v); setConflictError(null); } }}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {h} hour{h > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {conflictError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-red-800">{conflictError}</p>
        </div>
      )}

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Parking ({hoursNum}hr x ${pricePerHour})</span>
          <span>${parkingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Service fee (15%)</span>
          <span>${platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2 text-base">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 h-11"
        disabled={loading || !date}
        onClick={handleBooking}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Book & Pay
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        Secure payment via Stripe
      </div>
    </div>
  );
}
