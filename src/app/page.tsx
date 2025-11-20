'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-800 mb-4">
          Aplikasi Manajemen Cuti
        </div>
        <div className="text-gray-600">Loading...</div>
      </div>
    </div>
  );
}