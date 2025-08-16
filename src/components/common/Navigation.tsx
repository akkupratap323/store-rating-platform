'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Z_CLASSES } from '@/lib/z-index';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { 
  User, 
  Store, 
  Star, 
  LogOut, 
  Users, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    enhancedToast.success('Successfully logged out. See you next time!');
    router.push('/auth/login');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { href: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { href: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
          { href: '/dashboard/admin/stores', icon: Store, label: 'Manage Stores' },
          { href: '/dashboard/admin/ratings', icon: Star, label: 'All Ratings' },
        ];
      case 'user':
        return [
          ...baseItems,
          { href: '/dashboard/user/stores', icon: Store, label: 'Browse Stores' },
          { href: '/dashboard/user/ratings', icon: Star, label: 'My Ratings' },
          { href: '/dashboard/user/profile', icon: User, label: 'Profile' },
        ];
      case 'store_owner':
        return [
          ...baseItems,
          { href: '/dashboard/store-owner/stores', icon: Store, label: 'My Stores' },
          { href: '/dashboard/store-owner/analytics', icon: BarChart3, label: 'Analytics' },
          { href: '/dashboard/store-owner/profile', icon: User, label: 'Profile' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`bg-black/90 backdrop-blur-sm border-b border-white/10 sticky top-0 ${Z_CLASSES.navigation}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <Star className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Store Rating
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-sm text-right">
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-gray-400 capitalize text-xs">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-white/10 pt-4 pb-3 mt-4">
                <div className="px-4 mb-4">
                  <p className="text-base font-medium text-white">{user?.name}</p>
                  <p className="text-sm font-medium text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="px-4">
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}