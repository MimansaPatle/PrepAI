export default function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-rise">

      {/* Header */}
      <div className="space-y-3">
        <div className="h-9 w-64 skeleton rounded-lg"></div>
        <div className="h-4 w-80 skeleton rounded"></div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/[.07] bg-panel p-[18px] space-y-3">
            <div className="h-3 w-20 skeleton rounded"></div>
            <div className="h-6 w-14 skeleton rounded"></div>
          </div>
        ))}
      </div>

      {/* Session rows */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-panel border border-white/[.07] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[11px] skeleton"></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-40 skeleton rounded"></div>
                  <div className="h-4 w-14 skeleton rounded-full"></div>
                </div>
                <div className="h-3 w-48 skeleton rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right space-y-2">
                <div className="h-2.5 w-16 skeleton rounded ml-auto"></div>
                <div className="h-5 w-12 skeleton rounded ml-auto"></div>
              </div>
              <div className="w-24 h-9 rounded-[10px] skeleton"></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
