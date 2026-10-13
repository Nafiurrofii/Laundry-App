import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TransaksiView } from '@/components/transaksi/TransaksiView';

export default function TransaksiPage() {
  return (
    <DashboardLayout currentPageTitle="Transaksi">
      <TransaksiView />
    </DashboardLayout>
  );
}
