export default function DashboardSkeleton() {
    return (
        <div className="animate-rise flex flex-col gap-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="h-3 w-28 skeleton rounded"></div>
                    <div className="h-14 w-80 skeleton rounded"></div>
                    <div className="h-4 w-80 skeleton rounded"></div>
                </div>
                <div className="h-[52px] w-[190px] skeleton flex-none"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-[4px] border border-[#494454] p-6" style={{ background: "rgba(31,31,36,.6)" }}>
                        <div className="h-3 w-20 skeleton rounded mb-4"></div>
                        <div className="h-8 w-16 skeleton rounded mb-3"></div>
                        <div className="h-3 w-24 skeleton rounded"></div>
                    </div>
                ))}
            </div>

            {/* Recommended banner */}
            <div className="rounded-[8px] border border-[#494454] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: "rgba(31,31,36,.6)" }}>
                <div className="space-y-3 flex-1">
                    <div className="h-3 w-40 skeleton rounded"></div>
                    <div className="h-7 w-64 skeleton rounded"></div>
                    <div className="h-3 w-72 skeleton rounded"></div>
                </div>
                <div className="h-[52px] w-[150px] skeleton flex-none"></div>
            </div>

            {/* Bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="h-4 w-32 skeleton rounded"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-[4px] border border-[#494454] h-16 skeleton" />
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="h-4 w-36 skeleton rounded"></div>
                    <div className="rounded-[4px] border border-[#494454] p-6 space-y-6" style={{ background: "rgba(31,31,36,.6)" }}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-full skeleton rounded"></div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
