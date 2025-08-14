import { DashboardLayout } from '@/components/common/DashboardLayout';
import { StoreManagement } from '@/components/admin/StoreManagement';

export default function AdminStoresPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <StoreManagement />
    </DashboardLayout>
  );
}