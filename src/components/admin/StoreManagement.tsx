'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function StoreManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
        <p className="text-gray-600">Manage platform stores and their details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stores</CardTitle>
          <CardDescription>All registered stores on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Store management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}