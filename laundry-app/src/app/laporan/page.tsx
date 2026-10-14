import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LaporanView } from '@/components/laporan/LaporanView';

export default function LaporanPage() {
  return (
    <DashboardLayout currentPageTitle="Laporan">
      <LaporanView />
    </DashboardLayout>
  );
}
