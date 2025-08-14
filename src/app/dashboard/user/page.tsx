import { DashboardLayout } from '@/components/common/DashboardLayout';
import { UserDashboard } from '@/components/user/UserDashboard';

export default function UserDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <UserDashboard />
    </DashboardLayout>
  );
}