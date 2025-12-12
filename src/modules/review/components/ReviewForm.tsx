"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { reviewFormSchema, type ReviewFormData } from "../schema";
import { createReview, updateReview } from "../actions";
import { Button } from "@/shared/ui/Button";
import { ImageUploader } from "@/shared/ui/ImageUploader";

type ReviewFormProps = {
  userId: string;
  menuId: string;
  orderId?: string;
  review?: {
    id: string;
    rating: number;
    comment: string | null;
    images: string[];
  };
  onSuccess?: () => void;
};

export function ReviewForm({
  userId,
  menuId,
  orderId,
  review,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(review?.rating || 0);
  const [images, setImages] = useState<string[]>(review?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: review?.rating || 0,
      comment: review?.comment || "",
      images: review?.images || [],
    },
  });

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (selectedRating === 0) {
      toast.error("Silakan pilih rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        rating: selectedRating,
        images,
      };

      const result = review
        ? await updateReview(review.id, userId, submitData)
        : await createReview(userId, menuId, submitData, orderId);

      if (result.success) {
        toast.success(
          review ? "Review berhasil diperbarui" : "Review berhasil ditambahkan"
        );
        router.refresh();
        onSuccess?.();
      } else {
        toast.error(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(rating)}
              className="text-3xl transition-transform hover:scale-110"
            >
              {rating <= selectedRating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ulasan
        </label>
        <textarea
          {...register("comment")}
          rows={4}
          placeholder="Ceritakan pengalaman Anda dengan menu ini..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto (Opsional)
        </label>
        <ImageUploader
          images={images}
          onChange={(newImages) => {
            setImages(newImages);
            setValue("images", newImages);
          }}
          maxImages={5}
          folder="reviews"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? "Menyimpan..."
            : review
            ? "Perbarui Review"
            : "Kirim Review"}
        </Button>
      </div>
    </form>
  );
}
