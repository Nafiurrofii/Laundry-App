import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  return (
    <DashboardLayout currentPageTitle="Dashboard">
      <DashboardView />
    </DashboardLayout>
  );
}
