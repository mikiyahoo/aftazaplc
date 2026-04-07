import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import {
  Building2,
  MessageSquare,
  Star,
  Building,
  ArrowRight,
  Shield,
  AlertCircle,
} from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [
      propertyCount,
      inquiryCount,
      testimonialCount,
      companyCount,
      recentInquiries,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.propertyInquiry.count(),
      prisma.testimonial.count(),
      prisma.company.count(),
      prisma.propertyInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { property: true },
      }),
    ]);
    return {
      propertyCount,
      inquiryCount,
      testimonialCount,
      companyCount,
      recentInquiries,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      propertyCount: 0,
      inquiryCount: 0,
      testimonialCount: 0,
      companyCount: 0,
      recentInquiries: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const {
    propertyCount,
    inquiryCount,
    testimonialCount,
    companyCount,
    recentInquiries,
  } = await getStats();

  const stats = [
    {
      name: "Total Properties",
      stat: propertyCount,
      icon: Building2,
      href: "/admin/properties/manage-properties",
      color: "from-[#c8a34d] to-[#dfc278]",
    },
    {
      name: "Total Inquiries",
      stat: inquiryCount,
      icon: MessageSquare,
      href: "/admin/properties/inquiries",
      color: "from-[#8b5cf6] to-[#a78bfa]",
    },
    {
      name: "Total Testimonials",
      stat: testimonialCount,
      icon: Star,
      href: "/admin/properties/testimonials",
      color: "from-[#f59e0b] to-[#fbbf24]",
    },
    {
      name: "Total Companies",
      stat: companyCount,
      icon: Building,
      href: "/admin/properties/companies",
      color: "from-[#ef4444] to-[#f87171]",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your properties today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow-lg rounded-xl border border-[#c8a34d]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-[#c8a34d] to-[#dfc278] p-3 rounded-lg shadow-lg">
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      {item.name}
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 mt-1">
                      {item.stat}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#c8a34d]/5 to-transparent px-6 py-4 border-t border-[#c8a34d]/10">
              <div className="text-sm">
                <Link
                  href={item.href}
                  className="font-semibold text-[#c8a34d] hover:text-[#dfc278] transition-colors flex items-center gap-2"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentInquiries.map((inquiry) => (
              <li key={inquiry.id}>
                <Link
                  href={`/admin/properties/inquiries`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {inquiry.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {inquiry.property?.title || "General Inquiry"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {inquiry.email}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

