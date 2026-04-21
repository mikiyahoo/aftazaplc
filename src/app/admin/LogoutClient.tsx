'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutClient() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
    }
    router.push('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 border-l-2 border-transparent hover:border-red-400"
    >
      <LogOut className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
      <span className="font-medium">Logout</span>
    </button>
  );
}