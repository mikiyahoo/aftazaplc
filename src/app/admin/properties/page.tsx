'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Star, 
  Building, 
  MessageSquare,
  Plus,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react';

interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  totalCompanies: number;
  newInquiries: number;
}

interface RecentProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  createdAt: string;
}

export default function PropertiesDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    featuredProperties: 0,
    totalCompanies: 0,
    newInquiries: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch properties
        const propertiesRes = await fetch('/api/properties?limit=5');
        const propertiesData = await propertiesRes.json();
        
        // Fetch featured properties
        const featuredRes = await fetch('/api/properties?featured=true&limit=100');
        const featuredData = await featuredRes.json();
        
        // Fetch companies
        const companiesRes = await fetch('/api/companies');
        const companiesData = await companiesRes.json();
        
        // Fetch inquiries
        const inquiriesRes = await fetch('/api/inquiries?limit=100');
        const inquiriesData = await inquiriesRes.json();
        
        setStats({
          totalProperties: propertiesData.total || 0,
          featuredProperties: featuredData.total || 0,
          totalCompanies: companiesData.length || 0,
          newInquiries: inquiriesData.total || 0,
        });
        
        setRecentProperties(propertiesData.properties || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8a34d]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Property Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your real estate listings and leads</p>
        </div>
        <Link
          href="/admin/properties/add-property"
          className="flex items-center gap-2 bg-[#c8a34d] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#b8933f] transition-colors"
        >
          <Plus size={20} />
          Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Properties</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalProperties}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Featured Listings</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.featuredProperties}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Companies</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCompanies}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">New Inquiries</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.newInquiries}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/properties/manage-properties"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-[#c8a34d] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building2 className="text-[#c8a34d]" size={20} />
            <span className="font-medium text-slate-900">Manage Properties</span>
          </div>
          <ArrowRight className="text-slate-400" size={20} />
        </Link>
        
        <Link
          href="/admin/properties/companies"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-[#c8a34d] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building className="text-[#c8a34d]" size={20} />
            <span className="font-medium text-slate-900">Manage Companies</span>
          </div>
          <ArrowRight className="text-slate-400" size={20} />
        </Link>
        
        <Link
          href="/admin/properties/inquiries"
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-[#c8a34d] transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="text-[#c8a34d]" size={20} />
            <span className="font-medium text-slate-900">View Inquiries</span>
          </div>
          <ArrowRight className="text-slate-400" size={20} />
        </Link>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recently Added Properties</h2>
        </div>
        
        {recentProperties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">No properties yet. Add your first property to get started.</p>
            <Link
              href="/admin/properties/add-property"
              className="inline-flex items-center gap-2 mt-4 text-[#c8a34d] font-medium hover:underline"
            >
              <Plus size={16} />
              Add Property
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Title</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Price</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Location</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Date</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentProperties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{property.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-900">{formatPrice(property.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600">{property.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      property.status === 'For Sale' 
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'For Rent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-500 text-sm">{formatDate(property.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/properties/edit/${property.id}`}
                        className="p-2 text-slate-400 hover:text-[#c8a34d] transition-colors"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this property?')) {
                            await fetch(`/api/properties/${property.id}`, { method: 'DELETE' });
                            window.location.reload();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {recentProperties.length > 0 && (
          <div className="p-4 border-t border-slate-200">
            <Link
              href="/admin/properties/manage-properties"
              className="flex items-center justify-center gap-2 text-[#c8a34d] font-medium hover:underline"
            >
              View All Properties
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
