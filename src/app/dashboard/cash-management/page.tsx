import { getPendingCashHandovers } from "@/modules/payment/actions";
import { CashHandoverList } from "@/modules/payment/components/CashHandoverList";

export default async function CashManagementPage() {
  // TODO: Get courier ID from session/auth
  const courierId = "temp-courier-id";
  const cashPayments = await getPendingCashHandovers(courierId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Management</h1>
          <p className="text-gray-600 mt-1">
            Kelola cash yang sudah diterima dari customer
          </p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
          {cashPayments.length} Pending
        </div>
      </div>

      <CashHandoverList cashPayments={cashPayments} courierId={courierId} />
    </div>
  );
}
