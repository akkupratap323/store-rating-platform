import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedUserDashboard } from '@/components/user/EnhancedUserDashboard';

export default function UserDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <EnhancedUserDashboard />
    </DashboardLayout>
  );
}