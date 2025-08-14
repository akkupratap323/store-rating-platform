'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Store Rating</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-3">
                  <p className="text-base font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm font-medium text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="mt-3 px-3">
                  <Button variant="outline" onClick={handleLogout} className="w-full">
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