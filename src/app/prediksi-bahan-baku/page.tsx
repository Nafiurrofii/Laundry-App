import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PrediksiView } from '@/components/prediksi-bahan-baku/PrediksiView';

export default function PrediksiPage() {
  return (
    <DashboardLayout currentPageTitle="Prediksi Bahan Baku">
      <PrediksiView />
    </DashboardLayout>
  );
}
