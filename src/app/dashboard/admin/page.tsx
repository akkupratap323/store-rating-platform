import { DashboardLayout } from '@/components/common/DashboardLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <AdminDashboard />
    </DashboardLayout>
  );
}