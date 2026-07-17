"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface ReviewsSectionProps {
  listingId: string;
  reviews: Review[];
}

export function ReviewsSection({ listingId, reviews }: ReviewsSectionProps) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Review submitted!");
      setShowForm(false);
      setComment("");
      setRating(5);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reviews ({reviews.length})</h2>
        {session && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="pt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      {review.author.image ? (
                        <img
                          src={review.author.image}
                          alt={review.author.name || ""}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {review.author.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{review.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-muted-foreground">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
