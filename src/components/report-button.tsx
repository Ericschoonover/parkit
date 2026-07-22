"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Flag, AlertTriangle, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

const REPORT_REASONS = [
  { value: "FRAUDULENT_LISTING", label: "Fraudulent or fake listing" },
  { value: "DANGEROUS_LOCATION", label: "Dangerous or unsafe location" },
  { value: "MISLEADING_DESCRIPTION", label: "Misleading description or photos" },
  { value: "ILLEGAL_ACTIVITY", label: "Illegal activity" },
  { value: "SPAM_OR_SCAM", label: "Spam or scam" },
  { value: "WRONG_ADDRESS", label: "Wrong address or location" },
  { value: "NO_ACCESS", label: "No access to parking spot" },
  { value: "OTHER", label: "Other" },
];

interface ReportButtonProps {
  listingId: string;
  listingTitle: string;
}

export function ReportButton({ listingId, listingTitle }: ReportButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, description: description || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Report submitted. Our team will review it.");
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span>Report submitted. We&apos;ll review it shortly.</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Report this listing
          </p>
          <button onClick={() => setShowForm(false)} className="text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-red-600">
          Reporting <span className="font-medium">&ldquo;{listingTitle}&rdquo;</span>
        </p>
        <div>
          <Label className="text-sm">Reason</Label>
          <div className="space-y-1.5 mt-1.5">
            {REPORT_REASONS.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="accent-red-600"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="report-desc" className="text-sm">
            Additional details <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="report-desc"
            placeholder="Any additional context about this issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1.5"
            rows={3}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleSubmit}
            disabled={submitting || !reason}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-600 transition-colors"
    >
      <Flag className="h-3 w-3" />
      Report listing
    </button>
  );
}
