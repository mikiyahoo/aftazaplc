import Link from "next/link";
import { ShieldCheck, LayoutDashboard, FilePlus } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-950 text-white p-8 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-[#c8a34d]" size={24} />
          <span className="font-display font-black uppercase tracking-tighter text-xl">AFTAZA_HQ</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            href="/admin/new"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors text-[#c8a34d]"
          >
            <FilePlus size={16} /> New Insight
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/insights"
            className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors opacity-70"
          >
            <LayoutDashboard size={16} /> Public Insights
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
