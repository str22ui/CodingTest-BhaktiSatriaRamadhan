'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LogOut,
  Users,
  Calendar,
  User,
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

 useEffect(() => {
  const loadAdmin = () => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      router.push('/login');
      return;
    }

    const adminData = JSON.parse(admin);
    setAdminName(`${adminData.namaDepan} ${adminData.namaBelakang}`);
  };

  // panggil fungsi
  loadAdmin();
}, [router]);


  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Users },
    { href: '/dashboard/pegawai', label: 'Pegawai', icon: Users },
    { href: '/dashboard/cuti', label: 'Cuti', icon: Calendar },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static w-64 bg-gray-900 text-white transition-transform duration-300 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen z-50 flex flex-col`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">Cuti App</h1>
        </div>

        <nav className="mt-8 flex-1 overflow-y-auto">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-6 py-3 hover:bg-gray-800 transition"
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-600"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="text-gray-700 font-medium text-sm md:text-base">
              Selamat datang, <span className="font-bold">{adminName}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}