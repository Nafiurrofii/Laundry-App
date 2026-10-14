import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function HomePage() {
  return (
    <DashboardLayout currentPageTitle="Dashboard">
      <DashboardView />
    </DashboardLayout>
  );
}
