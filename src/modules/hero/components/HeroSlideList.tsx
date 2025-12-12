"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import {
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  deleteHeroSlide,
  toggleHeroSlideStatus,
  reorderHeroSlides,
} from "@/modules/hero/actions";
import { HeroSlideModal } from "./HeroSlideModal";
import Image from "next/image";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isActive: boolean;
}

interface HeroSlideListProps {
  initialSlides: HeroSlide[];
}

export function HeroSlideList({ initialSlides }: HeroSlideListProps) {
  const [slides, setSlides] = useState(initialSlides);
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setSelectedSlide(null);
    setIsCreating(true);
    setIsModalOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setSelectedSlide(slide);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus hero slide ini?")) return;

    const result = await deleteHeroSlide(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Hero slide berhasil dihapus");
      setSlides((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleHeroSlideStatus(id, !currentStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Hero slide ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`
      );
      setSlides((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s))
      );
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newSlides = [...slides];
    [newSlides[index - 1], newSlides[index]] = [
      newSlides[index],
      newSlides[index - 1],
    ];

    const reordered = newSlides.map((slide, idx) => ({
      id: slide.id,
      order: idx,
    }));

    const result = await reorderHeroSlides(reordered);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSlides(newSlides);
      toast.success("Urutan berhasil diubah");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[index + 1]] = [
      newSlides[index + 1],
      newSlides[index],
    ];

    const reordered = newSlides.map((slide, idx) => ({
      id: slide.id,
      order: idx,
    }));

    const result = await reorderHeroSlides(reordered);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSlides(newSlides);
      toast.success("Urutan berhasil diubah");
    }
  };

  const handleModalClose = (updatedSlide?: HeroSlide) => {
    setIsModalOpen(false);
    setSelectedSlide(null);

    if (updatedSlide) {
      if (isCreating) {
        setSlides((prev) => [...prev, updatedSlide]);
      } else {
        setSlides((prev) =>
          prev.map((s) => (s.id === updatedSlide.id ? updatedSlide : s))
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Slides Management</h2>
          <p className="text-gray-600 mt-1">
            Kelola slider gambar di halaman utama
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Slide
        </Button>
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Belum ada hero slides
          </h3>
          <p className="text-gray-500 mb-6">
            Tambahkan slide pertama untuk menampilkan hero banner
          </p>
          <Button onClick={handleCreate} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Slide Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4 p-4">
                {/* Preview Image */}
                <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge color="warning">Tidak Aktif</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {slide.title}
                      </h3>
                      {slide.subtitle && (
                        <p className="text-sm text-gray-600 truncate">
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge color={slide.isActive ? "success" : "warning"}>
                        {slide.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                      <Badge color="primary">Urutan: {index + 1}</Badge>
                    </div>
                  </div>

                  {slide.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {slide.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(slide)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleStatus(slide.id, slide.isActive)
                      }
                    >
                      {slide.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Nonaktifkan
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Aktifkan
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4 mr-1" />
                      Naik
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === slides.length - 1}
                    >
                      <MoveDown className="w-4 h-4 mr-1" />
                      Turun
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <HeroSlideModal
          slide={selectedSlide}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
