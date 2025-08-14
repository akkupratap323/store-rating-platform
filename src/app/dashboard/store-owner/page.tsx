import { DashboardLayout } from '@/components/common/DashboardLayout';
import { StoreOwnerDashboard } from '@/components/store-owner/StoreOwnerDashboard';

export default function StoreOwnerDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['store_owner']}>
      <StoreOwnerDashboard />
    </DashboardLayout>
  );
}