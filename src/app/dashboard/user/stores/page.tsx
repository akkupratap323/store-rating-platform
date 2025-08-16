import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedStoreBrowsing } from '@/components/user/EnhancedStoreBrowsing';

export default function UserStoresPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <EnhancedStoreBrowsing />
    </DashboardLayout>
  );
}