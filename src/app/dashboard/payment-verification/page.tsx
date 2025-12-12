import { getPendingPaymentVerifications } from "@/modules/payment/actions";
import { PaymentVerificationList } from "@/modules/payment/components/PaymentVerificationList";

export default async function PaymentVerificationPage() {
  const payments = await getPendingPaymentVerifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Verifikasi Pembayaran
          </h1>
          <p className="text-gray-600 mt-1">
            Review dan verifikasi bukti pembayaran dari customer
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
          {payments.length} Pending
        </div>
      </div>

      <PaymentVerificationList payments={payments} />
    </div>
  );
}
