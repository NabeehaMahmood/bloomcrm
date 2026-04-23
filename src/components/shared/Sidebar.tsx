'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/leads', label: 'Leads', icon: '📋' },
    ...(user.role === 'admin'
      ? [
          { href: '/dashboard/agents', label: 'Agents', icon: '👥' },
          { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
        ]
      : []),
  ];

  return (
    <aside
      className={`bg-gradient-bloom text-white transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      } min-h-screen shadow-lg flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-green-400">
        <div className="flex items-center justify-between">
          <div className={isExpanded ? '' : 'hidden'}>
            <h1 className="text-2xl font-bold">🌸 BloomCRM</h1>
            <p className="text-sm text-green-100">Property CRM</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-green-600 rounded"
          >
            {isExpanded ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            {isExpanded && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-green-400 p-4">
        {isExpanded && (
          <div className="mb-4">
            <p className="text-sm text-green-100">Logged in as</p>
            <p className="font-bold text-white">{user.name}</p>
            <p className="text-xs text-green-100 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full btn-secondary text-bloom-600 hover:text-bloom-700 py-2"
        >
          {isExpanded ? '🚪 Logout' : '🚪'}
        </button>
      </div>
    </aside>
  );
}
