import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedStoreOwnerDashboard } from '@/components/store-owner/EnhancedStoreOwnerDashboard';

export default function StoreOwnerDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['store_owner']}>
      <EnhancedStoreOwnerDashboard />
    </DashboardLayout>
  );
}