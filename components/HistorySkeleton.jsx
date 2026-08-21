export default function HistorySkeleton() {
  return (
    <div className="animate-rise flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#494454] pb-5 gap-4">
        <div className="space-y-3">
          <div className="h-8 w-96 skeleton rounded"></div>
          <div className="h-4 w-72 skeleton rounded"></div>
        </div>
        <div className="h-9 w-44 skeleton"></div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-[#494454] p-6 space-y-4" style={{ background: "#1f1f24" }}>
            <div className="h-3 w-24 skeleton rounded"></div>
            <div className="h-10 w-16 skeleton rounded"></div>
            <div className="h-3 w-28 skeleton rounded"></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#494454] min-h-[420px] flex flex-col" style={{ background: "#1f1f24" }}>
        <div className="p-4 border-b border-[#494454] flex justify-between items-center" style={{ background: "#1b1b20" }}>
          <div className="h-4 w-32 skeleton rounded"></div>
          <div className="h-8 w-52 skeleton"></div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full skeleton rounded"></div>
          ))}
        </div>
      </div>

    </div>
  );
}
