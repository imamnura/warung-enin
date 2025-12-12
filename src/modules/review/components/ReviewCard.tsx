"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteReview } from "../actions";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  isVerified: boolean;
  adminReply: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
};

type ReviewCardProps = {
  review: Review;
  currentUserId?: string;
  onEdit?: () => void;
};

export function ReviewCard({ review, currentUserId, onEdit }: ReviewCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    if (!currentUserId) return;

    setIsDeleting(true);
    try {
      const result = await deleteReview(review.id, currentUserId);
      if (result.success) {
        toast.success("Review berhasil dihapus");
        router.refresh();
      } else {
        toast.error(result.error || "Gagal menghapus review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isOwner = currentUserId === review.user.id;

  return (
    <>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {review.user.avatar ? (
                <Image
                  src={review.user.avatar}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-primary">
                  {review.user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{review.user.name}</p>
                {review.isVerified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Hapus
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-xl">
                {star <= review.rating ? "⭐" : "☆"}
              </span>
            ))}
          </div>
          {review.comment && (
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          )}
        </div>

        {review.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {review.images.map((image, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded overflow-hidden bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`Review image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {review.adminReply && (
          <div className="mt-3 pt-3 border-t bg-blue-50 -mx-4 px-4 py-3 rounded-b-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              💬 Balasan dari Warung Enin
            </p>
            <p className="text-sm text-blue-800">{review.adminReply}</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Review"
        message="Apakah Anda yakin ingin menghapus review ini?"
        confirmText="Hapus"
        isLoading={isDeleting}
      />
    </>
  );
}
