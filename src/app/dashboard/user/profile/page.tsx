import { DashboardLayout } from '@/components/common/DashboardLayout';
import { UserProfile } from '@/components/user/UserProfile';

export default function UserProfilePage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <UserProfile />
    </DashboardLayout>
  );
}