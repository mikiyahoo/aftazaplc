import Link from "next/link";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FilePlus, 
  Building2,
  Users,
  MessageSquare,
  Star,
  Plus,
  List,
  Building
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-950 text-white p-6 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="text-[#c8a34d]" size={24} />
          <span className="font-display font-black uppercase tracking-tighter text-xl">AFTAZA_HQ</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          
          <div className="pt-4 pb-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 px-3">Properties</span>
          </div>
          
          <Link
            href="/admin/properties"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <Building2 size={16} /> Property Dashboard
          </Link>
          
          <Link
            href="/admin/properties/add-property"
            className="flex items-center gap-3 pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <Plus size={14} /> Add Property
          </Link>
          
          <Link
            href="/admin/properties/manage-properties"
            className="flex items-center gap-3 pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <List size={14} /> Manage Properties
          </Link>
          
          <Link
            href="/admin/properties/companies"
            className="flex items-center gap-3 pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <Building size={14} /> Companies
          </Link>
          
          <Link
            href="/admin/properties/testimonials"
            className="flex items-center gap-3 pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <Star size={14} /> Testimonials
          </Link>
          
          <Link
            href="/admin/properties/inquiries"
            className="flex items-center gap-3 pl-8 pr-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <MessageSquare size={14} /> Inquiries
          </Link>

          <div className="pt-4 pb-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 px-3">Content</span>
          </div>
          
          <Link
            href="/admin/new"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded"
          >
            <FilePlus size={16} /> New Insight
          </Link>
          
          <Link
            href="/insights"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded opacity-70"
          >
            <Users size={16} /> Public Insights
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
