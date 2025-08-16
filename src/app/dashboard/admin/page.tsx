import { DashboardLayout } from '@/components/common/DashboardLayout';
import { EnhancedAdminDashboard } from '@/components/admin/EnhancedAdminDashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <EnhancedAdminDashboard />
    </DashboardLayout>
  );
}