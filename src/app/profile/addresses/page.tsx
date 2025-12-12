"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserAddresses } from "@/modules/address/actions";
import { AddressCard } from "@/modules/address/components/AddressCard";
import { EditAddressModal } from "@/modules/address/components/EditAddressModal";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";

type Address = {
  id: string;
  label: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  district: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  notes: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export default function AddressesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    // Get user session and addresses
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then(async (session) => {
        if (!session?.user?.id) {
          router.push("/auth/login?callbackUrl=/profile/addresses");
        } else {
          setUserId(session.user.id);
          const data = await getUserAddresses(session.user.id);
          setAddresses(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  const refreshAddresses = async () => {
    if (userId) {
      const data = await getUserAddresses(userId);
      setAddresses(data);
    }
  };

  if (isLoading || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Alamat Tersimpan</h1>
              <p className="text-gray-600 mt-1">
                Kelola alamat pengiriman Anda
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/profile/addresses/create">
                <Button>Tambah Alamat</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Kembali</Button>
              </Link>
            </div>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📍</div>
              <h2 className="text-xl font-semibold mb-2">Belum Ada Alamat</h2>
              <p className="text-gray-600 mb-6">
                Tambahkan alamat pengiriman untuk memudahkan checkout
              </p>
              <Link href="/profile/addresses/create">
                <Button>Tambah Alamat</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  userId={userId}
                  address={address}
                  onEdit={() => setEditingAddress(address)}
                />
              ))}
            </div>
          )}
        </div>
      </Container>

      {editingAddress && (
        <EditAddressModal
          userId={userId}
          address={editingAddress}
          isOpen={!!editingAddress}
          onClose={() => {
            setEditingAddress(null);
            refreshAddresses();
          }}
        />
      )}
    </div>
  );
}
