"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface BookingPhotosProps {
  bookingId: string;
  beforePhotos: string[];
  afterPhotos: string[];
  isRenter: boolean;
  isOwner: boolean;
}

export function BookingPhotos({
  bookingId,
  beforePhotos: initialBefore,
  afterPhotos: initialAfter,
  isRenter,
  isOwner,
}: BookingPhotosProps) {
  const [beforePhotos, setBeforePhotos] = useState(initialBefore);
  const [afterPhotos, setAfterPhotos] = useState(initialAfter);
  const [uploading, setUploading] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (
    files: FileList,
    type: "before" | "after"
  ) => {
    if (!files.length) return;
    setUploading(true);

    try {
      const newPhotos: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newPhotos.push(base64);
      }

      if (newPhotos.length === 0) {
        setUploading(false);
        return;
      }

      const field = type === "before" ? "beforePhotos" : "afterPhotos";
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newPhotos }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      if (type === "before") {
        setBeforePhotos((prev) => [...prev, ...newPhotos]);
      } else {
        setAfterPhotos((prev) => [...prev, ...newPhotos]);
      }

      toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? "s" : ""} uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const PhotoGallery = ({ photos, label }: { photos: string[]; label: string }) => (
    <div>
      {photos.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
          <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No {label} photos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <img
                src={photo}
                alt={`${label} photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Before Photos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="h-4 w-4" /> Before Photos
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Document the space condition before parking
              </p>
            </div>
            {isRenter && (
              <Badge variant="outline" className="text-xs">Renter only</Badge>
            )}
          </div>

          <PhotoGallery photos={beforePhotos} label="before" />

          {isRenter && (
            <>
              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleUpload(e.target.files, "before");
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                disabled={uploading}
                onClick={() => beforeInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Add Before Photos"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* After Photos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="h-4 w-4" /> After Photos
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Document the space condition after parking
              </p>
            </div>
            <Badge variant="outline" className="text-xs">Both can upload</Badge>
          </div>

          <PhotoGallery photos={afterPhotos} label="after" />

          <input
            ref={afterInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleUpload(e.target.files, "after");
              e.target.value = "";
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3"
            disabled={uploading}
            onClick={() => afterInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Add After Photos"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
