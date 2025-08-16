import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedStoreManagement } from '@/components/admin/EnhancedStoreManagement';

export default function AdminStoresPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <EnhancedStoreManagement />
    </DashboardLayout>
  );
}