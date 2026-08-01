export default function HistorySkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 space-y-8">

      {/* Header */}
      <div className="space-y-3">
        <div className="h-10 w-72 skeleton rounded-lg"></div>
        <div className="h-4 w-96 skeleton rounded"></div>
      </div>

      {/* Interview Cards */}
      <div className="space-y-4">

        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >

            {/* Left */}
            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl skeleton"></div>

              <div className="space-y-3">

                <div className="flex items-center gap-2">

                  <div className="h-6 w-48 skeleton rounded"></div>

                  <div className="h-5 w-16 skeleton rounded-full"></div>

                </div>

                <div className="h-4 w-56 skeleton rounded"></div>

              </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-6">

              <div className="text-right space-y-2">

                <div className="h-3 w-20 skeleton rounded ml-auto"></div>

                <div className="h-7 w-14 skeleton rounded ml-auto"></div>

              </div>

              <div className="w-32 h-10 rounded-xl skeleton"></div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}