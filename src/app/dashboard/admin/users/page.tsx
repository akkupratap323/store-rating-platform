import { DashboardLayout } from '@/components/common/DashboardLayout';
import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <UserManagement />
    </DashboardLayout>
  );
}