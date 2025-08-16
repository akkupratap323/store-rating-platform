import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedUserManagement } from '@/components/admin/EnhancedUserManagement';

export default function AdminUsersPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <EnhancedUserManagement />
    </DashboardLayout>
  );
}