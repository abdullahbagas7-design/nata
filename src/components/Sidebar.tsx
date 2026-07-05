'use client';

import { NavItem, UserRole } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Profile } from '@/types';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', roles: ['owner', 'frontdesk', 'desainer'] },
  { label: 'Pricelist', href: '/pricelist', roles: ['owner'] },
  { label: 'Kalkulator & Invoice', href: '/invoice', roles: ['owner', 'frontdesk'] },
  { label: 'Kalender', href: '/calendar', roles: ['owner', 'frontdesk'] },
  { label: 'Projects & Brief', href: '/projects', roles: ['owner', 'frontdesk', 'desainer'] },
];

export default function Sidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    getProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Nata</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem Manajemen Undangan</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">
            {profile?.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {userRole}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
