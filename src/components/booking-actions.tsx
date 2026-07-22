"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  startTime: string;
  isOwner: boolean;
  isRenter: boolean;
  hasReview: boolean;
  isPast: boolean;
  damageDeposit: number;
  depositStatus: string;
}

export function BookingActions({
  bookingId,
  status,
  startTime,
  isOwner,
  isRenter,
  hasReview,
  isPast,
  damageDeposit,
  depositStatus,
}: BookingActionsProps) {
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [depositAction, setDepositAction] = useState<"claim-deposit" | "release-deposit" | null>(null);
  const [processingDeposit, setProcessingDeposit] = useState(false);

  const canCancel = (status === "PENDING" || status === "CONFIRMED") && !isPast;
  const canReview = status === "COMPLETED" && !hasReview && isPast;
  const canManageDeposit = isOwner && isPast && depositStatus === "HELD" && (status === "COMPLETED" || status === "CONFIRMED");
  const hoursUntilStart =
    (new Date(startTime).getTime() - Date.now()) / (1000 * 60 * 60);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Booking cancelled. ${data.cancellation.reason}`);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleDepositAction = async (action: "claim-deposit" | "release-deposit") => {
    setProcessingDeposit(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message || (action === "claim-deposit"
        ? `Deposit of $${damageDeposit.toFixed(2)} claimed — transferred to your account`
        : `Deposit of $${damageDeposit.toFixed(2)} refunded to guest`));
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process deposit");
    } finally {
      setProcessingDeposit(false);
      setDepositAction(null);
    }
  };

  const handleSubmitReview = async () => {
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating: reviewRating,
          comment: reviewComment || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Review submitted!");
      setShowReview(false);
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      {/* Cancel Section */}
      {canCancel && !showCancelConfirm && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-sm">Cancel Booking</p>
                  <p className="text-xs text-muted-foreground">
                    {isOwner
                      ? "Guest will receive a full refund"
                      : hoursUntilStart >= 24
                      ? "Full refund — cancels 24+ hours before start"
                      : hoursUntilStart > 0
                      ? "50% refund — cancels less than 24 hours before start"
                      : "No refund — booking has passed"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showCancelConfirm && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Confirm Cancellation</p>
                <p className="text-sm text-red-700 mt-1">
                  {isOwner
                    ? "The guest will receive a full refund. Your payout for this booking will be reversed."
                    : hoursUntilStart >= 24
                    ? "You will receive a full refund to your original payment method."
                    : hoursUntilStart > 0
                    ? "You will receive a 50% refund. The host will receive 50% of the booking amount."
                    : "This booking has already passed. No refund will be issued."}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Section */}
      {canReview && !showReview && (
        <Card className="border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium text-sm">Leave a Review</p>
                  <p className="text-xs text-muted-foreground">
                    {isOwner
                      ? "How was the renter?"
                      : "How was your experience with this spot?"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => setShowReview(true)}
              >
                Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showReview && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="font-semibold mb-4">
              {isOwner ? "Rate the Renter" : "Rate Your Experience"}
            </p>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground hover:text-amber-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-comment">
                  Comment <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  id="review-comment"
                  placeholder={
                    isOwner
                      ? "The renter was respectful and parked carefully..."
                      : "The spot was exactly as described, easy to find..."
                  }
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReview(false)}
                >
                  Skip
                </Button>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasReview && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-medium text-sm text-green-800">
                You&apos;ve already reviewed this booking
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Management (host only, after booking ends) */}
      {canManageDeposit && !depositAction && (
        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Damage Deposit: ${damageDeposit.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    The guest&apos;s deposit is held. Report damage or release it.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => setDepositAction("release-deposit")}
                >
                  Release
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDepositAction("claim-deposit")}
                >
                  Claim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {depositAction && (
        <Card className={depositAction === "claim-deposit" ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${depositAction === "claim-deposit" ? "text-red-600" : "text-green-600"}`} />
              <div>
                <p className={`font-semibold ${depositAction === "claim-deposit" ? "text-red-800" : "text-green-800"}`}>
                  {depositAction === "claim-deposit" ? "Claim Deposit" : "Release Deposit"}
                </p>
                <p className={`text-sm mt-1 ${depositAction === "claim-deposit" ? "text-red-700" : "text-green-700"}`}>
                  {depositAction === "claim-deposit"
                    ? `The $${damageDeposit.toFixed(2)} deposit will be transferred to your Stripe account. The guest has been notified.`
                    : `The $${damageDeposit.toFixed(2)} deposit will be refunded to the guest's original payment method.`}
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDepositAction(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className={depositAction === "claim-deposit" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                onClick={() => handleDepositAction(depositAction)}
                disabled={processingDeposit}
              >
                {processingDeposit
                  ? "Processing..."
                  : depositAction === "claim-deposit"
                  ? "Yes, Claim Deposit"
                  : "Yes, Release Deposit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {depositStatus !== "HELD" && damageDeposit > 0 && (
        <Card className={depositStatus === "CLAIMED" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {depositStatus === "CLAIMED" ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <p className={`font-medium text-sm ${depositStatus === "CLAIMED" ? "text-red-800" : "text-green-800"}`}>
                Deposit of ${damageDeposit.toFixed(2)} {depositStatus === "CLAIMED" ? "claimed by host" : "refunded to guest"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
