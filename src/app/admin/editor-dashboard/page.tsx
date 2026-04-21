import { redirect } from "next/navigation";
import { ArrowLeft, Shield, Eye, Edit3, FileText, Users, Settings } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";

export default async function EditorDashboard() {
  // Check authentication on the server side
  const user = await requireAdminSession();
  
  if (!user) {
    // Redirect to login page if not authenticated
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editor Dashboard</h1>
                <p className="text-sm text-gray-600">Limited access - Content Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Editor Role
              </span>
              <a
                href="/admin"
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Switch to Admin View</span>
              </a>
              <form action="/api/admin/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 truncate">Properties</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">Manage</div>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <div className="mt-4">
              <a
                href="/admin/properties"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Properties →
              </a>
            </div>
          </div>

          <div className="bg-white overflow-hidden rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 truncate">Inquiries</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">Manage</div>
              </div>
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <div className="mt-4">
              <a
                href="/admin/inquiries"
               className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                View Inquiries →
              </a>
            </div>
          </div>

          <div className="bg-white overflow-hidden rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-500 truncate">Testimonials</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">Manage</div>
              </div>
              <Edit3 className="w-10 h-10 text-purple-600" />
            </div>
            <div className="mt-4">
              <a
                href="/admin/testimonials"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View Testimonials →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editor Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">✅ Allowed:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View and manage properties</li>
                <li>• Respond to property inquiries</li>
                <li>• Manage testimonials</li>
                <li>• View company information</li>
                <li>• View blog posts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">❌ Restricted:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• User management</li>
                <li>• System settings</li>
                <li>• Admin permissions</li>
                <li>• Database administration</li>
                <li>• Security configurations</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Eye className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Contact an administrator if you need access to restricted features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
