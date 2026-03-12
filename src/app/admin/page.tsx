import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Building2,
  MessageSquare,
  Star,
  Building,
  ArrowRight,
} from "lucide-react";

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
    },
    {
      name: "Total Inquiries",
      stat: inquiryCount,
      icon: MessageSquare,
      href: "/admin/properties/inquiries",
    },
    {
      name: "Total Testimonials",
      stat: testimonialCount,
      icon: Star,
      href: "/admin/properties/testimonials",
    },
    {
      name: "Total Companies",
      stat: companyCount,
      icon: Building,
      href: "/admin/properties/companies",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {item.stat}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href={item.href}
                  className="font-medium text-cyan-700 hover:text-cyan-900"
                >
                  View all
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

