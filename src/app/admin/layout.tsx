import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogOut, Home, Building2, MessageSquare, Star, Building, User } from "lucide-react";
import { logout } from "./actions/logout";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  // If not authenticated, show layout with sidebar but without user info
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Enhanced Sidebar Navigation */}
          <aside className="w-64 bg-[#0f172a] border-r border-[#c8a34d]/20 shadow-lg">
            <div className="p-6">
              {/* Brand Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-[#c8a34d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,163,77,0.3)]">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
              </div>
              
              {/* Guest Info */}
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-[#c8a34d]/20">
                <div className="flex items-center justify-center mb-2">
                  <User className="w-4 h-4 text-[#c8a34d] mr-2" />
                  <span className="text-white font-semibold text-sm">Guest</span>
                </div>
                <p className="text-xs text-gray-400 text-center">Please log in to access admin features</p>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2">
                <Link 
                  href="/admin/login" 
                  className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
                >
                  <Home className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                  <span className="font-medium">Login</span>
                </Link>
                
                <Link 
                  href="/admin/register" 
                  className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
                >
                  <Building2 className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                  <span className="font-medium">Register</span>
                </Link>
                
                <Link 
                  href="/admin/forgot-password" 
                  className="flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-[#c8a34d]/20 hover:text-white transition-all duration-300 border-l-2 border-transparent hover:border-[#c8a34d]"
                >
                  <MessageSquare className="w-5 h-5 text-[#c8a34d] mr-3 flex-shrink-0" />
                  <span className="font-medium">Forgot Password</span>
                </Link>
              </nav>

              {/* Guest Actions */}
              <div className="mt-8 pt-6 border-t border-[#c8a34d]/20">
                <div className="text-xs text-gray-400 text-center">
                  Admin access required for full features
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Authenticated users get layout with enhanced sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Enhanced Sidebar Navigation */}
        <aside className="w-64 bg-[#0f172a] border-r border-[#c8a34d]/20 shadow-lg">
          <div className="p-6">
            {/* Brand Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-[#c8a34d] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(200,163,77,0.3)]">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            </div>
            
            {/* User Info */}
            <div className="mb-8 p-4 bg-white/5 rounded-lg border border-[#c8a34d]/20">
              <div className="flex items-center justify-center mb-2">
                <User className="w-4 h-4 text-[#c8a34d] mr-2" />
                <span className="text-white font-semibold text-sm">Admin</span>
              </div>
              <p className="text-xs text-gray-400 text-center truncate">{session.user?.email}</p>
            </div>
            
            {/* Navigation */}
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

            {/* Logout Section */}
            <div className="mt-8 pt-6 border-t border-[#c8a34d]/20">
              <form 
                action={logout}
                className="w-full"
              >
                <button
                  type="submit"
                  className="w-full flex items-center px-3 py-3 text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 border-l-2 border-transparent hover:border-red-400"
                >
                  <LogOut className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
