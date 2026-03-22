"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Loader2,
  Building2,
  Phone,
  Mail,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  _count: {
    properties: number;
  };
}

interface CompanyFormData {
  name: string;
  phone: string;
  email: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    phone: "",
    email: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch companies
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/companies", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  // Filter companies based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editingId) {
        response = await fetch(`/api/companies/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone || null,
            email: formData.email || null,
          }),
        });
      } else {
        response = await fetch("/api/companies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone || null,
            email: formData.email || null,
          }),
        });
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save company");
      }

      setFormData({ name: "", phone: "", email: "" });
      setEditingId(null);
      setIsFormOpen(false);

      await fetchCompanies();

      alert(editingId ? "Company updated successfully" : "Company created successfully");
    } catch (error) {
      console.error("Error saving company:", error);
      alert((error as Error).message || "Failed to save company");
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/companies/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = "/admin/login";
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete company");
      }

      setDeleteId(null);
      setIsDeleting(false);

      await fetchCompanies();

      alert("Company deleted successfully");
    } catch (error) {
      console.error("Error deleting company:", error);
      setIsDeleting(false);
      alert((error as Error).message || "Failed to delete company");
    }
  };

  // Handle form open for new company
  const handleAddCompany = () => {
    setFormData({ name: "", phone: "", email: "" });
    setEditingId(null);
    setIsFormOpen(true);
  };

  // Handle form open for editing company
  const handleEditCompany = (company: Company) => {
    setFormData({
      name: company.name,
      phone: company.phone || "",
      email: company.email || "",
    });
    setEditingId(company.id);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
          <p className="mt-1 text-slate-500">
            Manage real estate companies that list properties.
          </p>
        </div>
        <button
          onClick={handleAddCompany}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-4 py-2 text-sm font-semibold text-white hover:bg-brand-gold/90"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Company Name</th>
                <th className="px-6 py-3 font-semibold">Phone</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Properties</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm
                      ? "No companies found matching your search."
                      : "No companies found. Add your first company."}
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                          <Building2 size={20} className="text-slate-500" />
                        </div>
                        <div className="font-medium text-slate-900">{company.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} />
                        {company.phone || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail size={14} />
                        {company.email || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                        {company._count.properties} properties
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-gold"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(company.id)}
                          className="rounded-md p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Company Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {editingId ? "Edit Company" : "Add Company"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-white hover:bg-brand-gold/90"
                >
                  {editingId ? "Update Company" : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Confirm Deletion
            </h2>
            <p className="mb-4 text-slate-600">
              This will permanently remove the company from the system. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
