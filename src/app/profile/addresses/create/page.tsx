"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { AddressForm } from "@/modules/address/components/AddressForm";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { useEffect, useState } from "react";

export default function CreateAddressPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (!session?.user?.id) {
          router.push("/auth/login?callbackUrl=/profile/addresses/create");
        } else {
          setUserId(session.user.id);
          setIsLoading(false);
        }
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tambah Alamat</h1>
              <p className="text-gray-600 mt-1">
                Tambahkan alamat pengiriman baru
              </p>
            </div>
            <Link href="/profile/addresses">
              <Button variant="outline">Batal</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <AddressForm
              userId={userId}
              onSuccess={() => router.push("/profile/addresses")}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
