import Link from "next/link";
import { Home, Building2, MessageSquare, Star, Building, User, LogOut } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-[#0f172a] border-r border-[#c8a34d]/20 shadow-lg">
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-[#c8a34d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,163,77,0.3)]">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </div>
            
            <div className="mb-8 p-4 bg-white/5 rounded-lg border border-[#c8a34d]/20">
              <div className="flex items-center justify-center mb-2">
                <User className="w-4 h-4 text-[#c8a34d] mr-2" />
                <span className="text-white font-semibold text-sm">Admin</span>
              </div>
              <p className="text-xs text-gray-400 text-center">Loading...</p>
            </div>
            
            <nav className="space-y-2">
              <Link 
                href="/admin" 
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
              >
                <Home className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <Link 
                href="/admin/properties/manage-properties" 
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
              >
                <Building2 className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                <span className="font-medium">Properties</span>
              </Link>
              
              <Link 
                href="/admin/properties/inquiries" 
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
              >
                <MessageSquare className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                <span className="font-medium">Inquiries</span>
              </Link>
              
              <Link 
                href="/admin/properties/testimonials" 
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
              >
                <Star className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                <span className="font-medium">Testimonials</span>
              </Link>
              
              <Link 
                href="/admin/properties/companies" 
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
              >
                <Building className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                <span className="font-medium">Companies</span>
              </Link>
            </nav>

            <div className="mt-8 pt-6 border-t border-[#c8a34d]/20">
              <Link
                href="/api/admin/logout"
                className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 border-l-2 border-transparent hover:border-red-400"
              >
                <LogOut className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}