import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataCucianView } from '@/components/data-cucian/DataCucianView';

export default function DataCucianPage() {
  return (
    <DashboardLayout currentPageTitle="Data Cucian">
      <DataCucianView />
    </DashboardLayout>
  );
}
