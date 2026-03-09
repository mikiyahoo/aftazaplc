interface PropertyLoadingScreenProps {
  detail?: boolean;
}

export default function PropertyLoadingScreen({
  detail = false,
}: PropertyLoadingScreenProps) {
  return (
    <main data-header-text="light" className="property-shell min-h-screen">
      <div className="container-x animate-pulse pb-16 pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto h-4 w-40 rounded-full bg-slate-200" />
          <div className="mx-auto mt-6 h-12 w-full max-w-2xl rounded-full bg-slate-200" />
          <div className="mx-auto mt-4 h-6 w-full max-w-xl rounded-full bg-slate-200" />
        </div>

        <div className="property-floating-card mt-10 h-24 rounded-[16px] bg-white/70" />

        <div
          className={`mt-8 grid gap-6 ${
            detail ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]" : "lg:grid-cols-[280px_minmax(0,1fr)]"
          }`}
        >
          {!detail ? <div className="property-floating-card h-[520px] rounded-[16px] bg-white/70" /> : null}
          <div className="space-y-6">
            <div className="property-floating-card h-40 rounded-[16px] bg-white/70" />
            <div className="property-floating-card h-64 rounded-[16px] bg-white/70" />
            <div className="property-floating-card h-64 rounded-[16px] bg-white/70" />
          </div>
          {detail ? <div className="property-floating-card h-[620px] rounded-[16px] bg-white/70" /> : null}
        </div>
      </div>
    </main>
  );
}
