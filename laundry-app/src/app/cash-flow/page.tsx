import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CashFlowView } from '@/components/cash-flow/CashFlowView';

export default function CashFlowPage() {
  return (
    <DashboardLayout currentPageTitle="Cash Flow">
      <CashFlowView />
    </DashboardLayout>
  );
}
