import Link from "next/link";
import { ShieldCheck, LayoutDashboard, FilePlus, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white p-8 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <ShieldCheck className="text-[#c8a34d]" size={24} />
          <span className="font-display font-black uppercase tracking-tighter text-xl">AFTAZA_HQ</span>
        </div>

        <nav className="space-y-2 flex-1">
          <Link href="/admin/publish" className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors text-[#c8a34d]">
            <FilePlus size={16} /> Publish Protocol
          </Link>
          <Link href="/intelligence/insights" className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors opacity-50">
            <LayoutDashboard size={16} /> View Hub
          </Link>
        </nav>

        <Button className="flex items-center gap-3 p-3 text-[10px] font-bold uppercase tracking-widest text-red-500 mt-auto">
          <LogOut size={16} /> Exit System
        </Button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}