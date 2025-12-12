"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./ReviewForm";
import { canUserReview } from "../actions";
import { toast } from "sonner";

type WriteReviewModalProps = {
  userId: string;
  menuId: string;
  menuName: string;
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
};

export function WriteReviewModal({
  userId,
  menuId,
  menuName,
  orderId,
  isOpen,
  onClose,
}: WriteReviewModalProps) {
  const [canReview, setCanReview] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const checkEligibility = async () => {
        setIsChecking(true);
        const result = await canUserReview(userId, menuId, orderId);
        setCanReview(result.canReview);

        if (!result.canReview) {
          toast.error(result.reason || "Tidak dapat memberikan review");
          setTimeout(() => onClose(), 2000);
        }

        setIsChecking(false);
      };

      checkEligibility();
    }
  }, [isOpen, userId, menuId, orderId, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Review Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-1">{menuName}</p>
        </div>

        <div className="p-6">
          {isChecking ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Memeriksa kelayakan...</p>
            </div>
          ) : canReview ? (
            <ReviewForm
              userId={userId}
              menuId={menuId}
              orderId={orderId}
              onSuccess={onClose}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">❌</div>
              <p className="text-gray-600">
                Tidak dapat memberikan review untuk menu ini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
