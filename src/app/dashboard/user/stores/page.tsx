import { DashboardLayout } from '@/components/common/DashboardLayout';
import { StoreBrowsing } from '@/components/user/StoreBrowsing';

export default function UserStoresPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <StoreBrowsing />
    </DashboardLayout>
  );
}