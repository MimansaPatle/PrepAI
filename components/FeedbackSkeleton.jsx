export default function FeedbackSkeleton() {
  return (
    <div className="min-h-screen md:h-screen flex flex-col overflow-visible md:overflow-hidden" style={{ background: "#131317" }}>
      <div className="dot-matrix-fine fixed inset-0 pointer-events-none" />

      <header className="flex-none sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-[#494454] backdrop-blur-md" style={{ background: "rgba(14,14,18,.9)" }}>
        <div className="h-4 w-24 skeleton rounded"></div>
        <div className="hidden md:block h-3 w-56 skeleton rounded"></div>
        <div className="h-4 w-24 skeleton rounded"></div>
      </header>

      <div className="relative flex flex-1 flex-col md:flex-row overflow-visible md:overflow-hidden w-full">
        <aside className="w-full md:w-[420px] flex-none border-r border-[#494454] flex flex-col items-center justify-center p-8 lg:p-12" style={{ background: "#0e0e12" }}>
          <div className="h-3 w-40 skeleton rounded mb-16"></div>

          <div className="w-64 h-64 rounded-full skeleton mb-16"></div>

          <div className="flex flex-col items-center gap-3 mb-16 w-full">
            <div className="h-6 w-48 skeleton rounded"></div>
            <div className="h-3 w-56 skeleton rounded"></div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-7 w-full max-w-[300px] border-t border-[#494454]/30 pt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="h-2.5 w-20 skeleton rounded"></div>
                <div className="h-8 w-10 skeleton rounded"></div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-12 lg:p-16 xl:p-24">
          <div className="max-w-4xl mx-auto space-y-20">
            <section>
              <div className="h-3 w-28 skeleton rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-16 w-full skeleton border border-[#494454]/50"></div>
                <div className="h-16 w-full skeleton border border-[#494454]/50"></div>
              </div>
            </section>

            <section>
              <div className="h-3 w-24 skeleton rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-16 w-full skeleton border border-[#494454]/50"></div>
                <div className="h-16 w-full skeleton border border-[#494454]/50"></div>
                <div className="h-16 w-full skeleton border border-[#494454]/50"></div>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#494454]/30">
              <div className="h-[52px] w-48 skeleton rounded-full"></div>
              <div className="h-[52px] w-40 skeleton rounded-full"></div>
            </section>

            <section>
              <div className="h-3 w-44 skeleton rounded mb-10"></div>
              <div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-6 py-5 border-b border-[#494454]/20">
                    <div className="h-5 w-5 skeleton rounded flex-none"></div>
                    <div className="h-3.5 flex-1 skeleton rounded"></div>
                    <div className="h-1.5 w-32 skeleton rounded flex-none"></div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
