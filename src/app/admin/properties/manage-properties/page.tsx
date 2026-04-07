// src/app/admin/properties/manage-properties/page.tsx
"use client";

import { useEffect, useState, useRef, FC, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  Eye as EyeIcon,
  Building2,
  TrendingUp,
  Wallet,
  Landmark,
  LucideIcon,
} from "lucide-react";
import PropertyImage from "@/components/properties/PropertyImage";

interface Property {
  pkey: number;
  title: string;
  slug: string;
  location: string;
  price: number;
  propertyType: string;
  status: string;
  featured: boolean;
  createdAt: string;
  primaryImage?: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
}

interface Company {
  id: string;
  name: string;
  _count?: { properties: number };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(price);
};

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

const StatsCard: FC<StatsCardProps> = ({ title, value, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <Icon className="h-5 w-5 text-slate-400" />
    </div>
    <div className="mt-2">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

interface SortableThProps {
    children: ReactNode;
    column: keyof Property;
    sortDescriptor: {
        column: keyof Property;
        direction: string;
    };
    setSortDescriptor: (descriptor: { column: keyof Property; direction: string }) => void;
}

const SortableTh: FC<SortableThProps> = ({ children, column, sortDescriptor, setSortDescriptor }) => {
  const isSorted = sortDescriptor.column === column;
  const direction = isSorted ? (sortDescriptor.direction === "asc" ? "▲" : "▼") : "";

  return (
    <th
      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 hover:bg-slate-100"
      onClick={() =>
        setSortDescriptor({
          column,
          direction:
            sortDescriptor.column === column
              ? sortDescriptor.direction === "asc"
                ? "desc"
                : "asc"
              : "asc",
        })
      }
    >
      {children} {direction}
    </th>
  );
};

export default function ManagePropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<{column: keyof Property, direction: string}>({
    column: "createdAt",
    direction: "desc",
  });
  const [activePKey, setActivePKey] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const useClickOutside = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };

  useClickOutside(dropdownRef, () => setActivePKey(null));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propertiesRes, companiesRes] = await Promise.all([
        fetch("/api/properties?limit=100"),
        fetch("/api/companies"),
      ]);

      const propertiesData = await propertiesRes.json();
      const companiesData = await companiesRes.json();

      if (propertiesData.properties) {
        setProperties(propertiesData.properties);
      }

      if (companiesData.companies) {
        setCompanies(companiesData.companies);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkey: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`/api/properties/${pkey}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (res.ok) {
        setProperties(properties.filter((p) => p.pkey !== pkey));
        alert("Property deleted successfully");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Failed to delete property");
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? property.propertyType === filterType : true;
    const matchesStatus = filterStatus ? property.status === filterStatus : true;
    const matchesCompany = filterCompany ? property.company?.id === filterCompany : true;

    return matchesSearch && matchesType && matchesStatus && matchesCompany;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aValue = a[sortDescriptor.column];
    const bValue = b[sortDescriptor.column];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) return sortDescriptor.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDescriptor.direction === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  const totalProperties = properties.length;
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const activeListings = properties.filter((p) => p.status === "active").length;
  const companiesCount = companies.length;

  return (
    <main className="flex flex-1 flex-col gap-4 bg-slate-50 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Property Dashboard</h1>
          <p className="mt-1 text-slate-500">
            An overview of your property portfolio.
          </p>
        </div>
        <Link
          href="/admin/properties/add-property"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-white hover:bg-brand-gold/90"
        >
          <Plus size={18} />
          Add New Property
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={totalProperties}
          icon={Building2}
        />
        <StatsCard
          title="Total Portfolio Value"
          value={formatPrice(totalValue)}
          icon={Wallet}
        />
        <StatsCard
          title="Active Listings"
          value={activeListings}
          icon={TrendingUp}
        />
        <StatsCard
          title="Companies"
          value={companiesCount}
          icon={Landmark}
        />
      </div>
      {/* Filters */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <select
                title="Filter by property type"
                className="rounded-md border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>

              <select
                title="Filter by status"
                className="rounded-md border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>

              <select
                title="Filter by company"
                className="rounded-md border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              
              {(searchTerm || filterType || filterStatus || filterCompany) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("");
                    setFilterStatus("");
                    setFilterCompany("");
                  }}
                  className="text-sm font-semibold text-brand-gold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <SortableTh column="title" sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor}>Property</SortableTh>
                <SortableTh column="company" sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor}>Company</SortableTh>
                <SortableTh column="price" sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor}>Price</SortableTh>
                <SortableTh column="status" sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor}>Status</SortableTh>
                <SortableTh column="createdAt" sortDescriptor={sortDescriptor} setSortDescriptor={setSortDescriptor}>Created</SortableTh>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedProperties.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex h-64 items-center justify-center">
                      <div className="text-center text-slate-500">
                        <div className="mb-2 text-4xl">🏠</div>
                        <p className="text-lg font-medium">No properties found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedProperties.map((property) => (
                  <tr key={property.pkey} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <PropertyImage
                            src={property.primaryImage || "/property/luxury-house-image.jpg"}
                            alt={property.title}
                            fallbackLabel={property.title}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{property.title}</div>
                          <div className="text-sm text-slate-500">{property.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{property.company?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{formatPrice(property.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          property.status === "active"
                            ? "bg-green-100 text-green-800"
                            : property.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left" ref={dropdownRef}>
                        <button 
                          onClick={() => setActivePKey(activePKey === property.pkey ? null : property.pkey)}
                          className="rounded-full p-2 hover:bg-slate-200"
                          aria-label="More actions"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activePKey === property.pkey && (
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                            <div className="py-1">
                              <Link
                                href={`/admin/properties/edit/${property.pkey}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Property
                              </Link>
                              <Link
                                href={`/admin/properties/inquiries?property=${property.pkey}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <EyeIcon className="h-4 w-4" />
                                View Inquiries
                              </Link>
                              <button
                                onClick={() => {
                                  handleDelete(property.pkey);
                                  setActivePKey(null);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Property
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
