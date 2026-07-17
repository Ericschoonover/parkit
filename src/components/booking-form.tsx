"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Shield } from "lucide-react";
import { format, addHours } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

  const hoursNum = parseInt(hours);
  const parkingCost = pricePerHour * hoursNum;
  const platformFee = Math.round(parkingCost * 0.15 * 100) / 100;
  const totalAmount = parkingCost + platformFee;

  const handleBooking = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const [h, minutes] = startTime.split(":").map(Number);
      const startDateTime = new Date(date);
      startDateTime.setHours(h, minutes, 0, 0);
      const endDateTime = addHours(startDateTime, hoursNum);

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

      toast.success("Booking confirmed!");
      router.push(`/bookings/${data.booking.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
              disabled={(d) => d < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-sm font-medium">Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Duration</Label>
          <Select value={hours} onValueChange={(v) => v && setHours(v)}>
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

      <AlertDialog>
        <AlertDialogTrigger render={<Button className="w-full bg-green-600 hover:bg-green-700 h-11" disabled={loading || !date} />}>
          {loading ? "Booking..." : "Book Now"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>You&apos;re about to book this parking spot for:</p>
                {date && (
                  <p className="font-medium text-foreground">
                    {format(date, "EEEE, MMMM d, yyyy")} at {startTime}
                  </p>
                )}
                <p className="text-sm">
                  Duration: {hoursNum} hour{hoursNum > 1 ? "s" : ""} &middot; Total: <span className="font-semibold text-green-600">${totalAmount.toFixed(2)}</span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBooking}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm & Pay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3 w-3" />
        Secure payment via Stripe
      </div>
    </div>
  );
}
