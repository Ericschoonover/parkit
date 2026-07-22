"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface FlagReviewProps {
  reviewId: string;
  isFlagged: boolean;
}

const FLAG_REASONS = [
  "Spam or fake review",
  "Harassment or hate speech",
  "Irrelevant content",
  "Personal information disclosure",
  "Other",
];

export function FlagReview({ reviewId, isFlagged }: FlagReviewProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFlag = async () => {
    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason.trim()) {
      toast.error("Please select or enter a reason");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", reason: finalReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Review flagged for moderation");
      setOpen(false);
      setReason("");
      setCustomReason("");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to flag review");
    } finally {
      setSubmitting(false);
    }
  };

  if (isFlagged) {
    return (
      <span className="text-xs text-muted-foreground italic">Flagged for review</span>
    );
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground hover:text-orange-600">
            <Flag className="h-3 w-3" />
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Flag This Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a reason for flagging this review. Flagged reviews are reviewed by ParkIt staff.
          </p>
          <div className="space-y-2">
            {FLAG_REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="flag-reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-orange-600"
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
          {reason === "Other" && (
            <Textarea
              placeholder="Please describe the issue..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={3}
            />
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleFlag}
              disabled={submitting || !reason}
            >
              {submitting ? "Submitting..." : "Submit Flag"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
