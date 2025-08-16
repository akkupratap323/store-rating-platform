'use client';

import { DashboardLayout } from '@/components/common/DashboardLayout';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Meteors } from '@/components/ui/meteors';
import { motion } from 'framer-motion';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import {
  User,
  Mail,
  MapPin,
  Shield,
  Lock,
  Key,
  Save,
  // Edit,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Settings,
  Crown,
  Calendar,
  Activity
} from 'lucide-react';

interface ValidationError {
  path: (string | number)[];
  message: string;
  code: string;
}

export default function EnhancedStoreOwnerProfilePage() {
  const { user, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setValidationErrors([]);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    const loadingToastId = enhancedToast.loading('Updating your password...');
    setLoading(true);

    try {
      const result = await updatePassword(currentPassword, newPassword);
      
      enhancedToast.dismiss(loadingToastId);
      
      if (result.success) {
        enhancedToast.success('Password updated successfully! 🎉');
        setMessage('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        enhancedToast.error(result.message || 'Failed to update password');
        setError(result.message || 'Failed to update password');
      }
    } catch (error) {
      enhancedToast.dismiss(loadingToastId);
      enhancedToast.error('Network error occurred');
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.path.includes(fieldName))?.message;
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'store_owner':
        return {
          icon: <Crown className="h-5 w-5 text-yellow-400" />,
          label: 'Store Owner',
          description: 'Manage your stores and view analytics',
          color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/20'
        };
      case 'admin':
        return {
          icon: <Shield className="h-5 w-5 text-red-400" />,
          label: 'Administrator',
          description: 'Full platform access and management',
          color: 'from-red-500/20 to-red-600/20 border-red-500/20'
        };
      default:
        return {
          icon: <User className="h-5 w-5 text-blue-400" />,
          label: 'Regular User',
          description: 'Browse and rate stores',
          color: 'from-blue-500/20 to-blue-600/20 border-blue-500/20'
        };
    }
  };

  const roleInfo = getRoleInfo(user?.role || 'user');

  return (
    <DashboardLayout allowedRoles={['store_owner']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <Meteors number={12} />
          
          {/* Enhanced Header */}
          <div className="text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Profile Settings
              </h1>
              <p className="text-xl text-gray-300">Manage your account settings and security preferences</p>
            </motion.div>
          </div>

          {/* User Avatar Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Profile Information */}
            <AnimatedCard delay={0.3} className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">Your account details and role information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-400">Full Name</Label>
                    <p className="text-lg font-semibold text-white">{user?.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-400">Email Address</Label>
                    <p className="text-lg font-semibold text-white">{user?.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${roleInfo.color} rounded-lg border`}>
                  <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                    {roleInfo.icon}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-400">Account Role</Label>
                    <p className="text-lg font-semibold text-white">{roleInfo.label}</p>
                    <p className="text-sm text-gray-300 mt-1">{roleInfo.description}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-400">Address</Label>
                    <p className="text-lg font-semibold text-white">{user?.address}</p>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-sm font-semibold text-white">2024</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <Activity className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-sm font-semibold text-green-400">Active</p>
                  </div>
                </div>
              </CardContent>
            </AnimatedCard>

            {/* Enhanced Password Update */}
            <AnimatedCard delay={0.4} className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-gray-400">Update your password and enhance account security</CardDescription>
              </CardHeader>
              <CardContent>
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Please fix the following errors:
                    </h4>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-red-300 text-sm">
                          <strong>{error.path.join('.')}:</strong> {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/20 rounded-lg flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-green-400">{message}</span>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                    <span className="text-red-400">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white font-medium">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="Enter your current password"
                        className={`pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 ${getFieldError('currentPassword') ? 'border-red-500/50' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {getFieldError('currentPassword') && (
                      <p className="text-red-400 text-sm">{getFieldError('currentPassword')}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white font-medium">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Enter a strong new password"
                        className={`pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 ${getFieldError('newPassword') ? 'border-red-500/50' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                    {getFieldError('newPassword') && (
                      <p className="text-red-400 text-sm">{getFieldError('newPassword')}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Confirm your new password"
                        className={`pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20 ${getFieldError('confirmPassword') ? 'border-red-500/50' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {getFieldError('confirmPassword') && (
                      <p className="text-red-400 text-sm">{getFieldError('confirmPassword')}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <BackgroundGradient className="rounded-[12px] p-1">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-black border-none text-white py-6 text-lg font-semibold"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Save className="h-5 w-5 mr-2" />
                      )}
                      {loading ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </BackgroundGradient>
                </form>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Security Tips */}
          <AnimatedCard delay={0.5} className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Security Recommendations
              </CardTitle>
              <CardDescription className="text-gray-400">Tips to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                    <Lock className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Strong Password</h3>
                  <p className="text-sm text-gray-300">Use a mix of letters, numbers, and special characters</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Regular Updates</h3>
                  <p className="text-sm text-gray-300">Change your password every 3-6 months</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Stay Vigilant</h3>
                  <p className="text-sm text-gray-300">Monitor your account for unusual activity</p>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    </DashboardLayout>
  );
}