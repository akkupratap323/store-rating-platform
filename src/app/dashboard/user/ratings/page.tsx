import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedUserRatings } from '@/components/user/EnhancedUserRatings';

export default function UserRatingsPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <EnhancedUserRatings />
    </DashboardLayout>
  );
}