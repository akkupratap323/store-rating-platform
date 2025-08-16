'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, MapPin, Shield, Calendar } from 'lucide-react';

export function UserProfile() {
  const { user, updatePassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>Your account details and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Account Type</span>
              </Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Member Since</span>
              </Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">
                  {user.created_at ? formatDate(user.created_at) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium">{user.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password for security</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                placeholder="Enter new password"
                minLength={8}
                maxLength={16}
              />
              <p className="text-xs text-gray-500">
                8-16 characters, must include uppercase letter and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                placeholder="Confirm new password"
                minLength={8}
                maxLength={16}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Activity</CardTitle>
          <CardDescription>Your activity summary on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <p className="text-sm text-gray-600">Stores Rated</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">-</div>
              <p className="text-sm text-gray-600">Average Rating Given</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">User</div>
              <p className="text-sm text-gray-600">Account Type</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}