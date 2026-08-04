export default function DashboardSkeleton() {
    return (
        <div className="space-y-10 animate-rise">

            {/* Header */}
            <div className="space-y-3 pb-2">
                <div className="h-10 w-72 skeleton rounded-lg"></div>
                <div className="h-4 w-96 skeleton rounded"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">

                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-white/[.07] bg-panel p-5"
                    >
                        <div className="flex justify-between items-start">
                            <div className="h-4 w-24 skeleton rounded"></div>
                            <div className="w-6 h-6 rounded-lg skeleton"></div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <div className="h-8 w-16 skeleton rounded"></div>
                            <div className="h-3 w-24 skeleton rounded"></div>
                        </div>
                    </div>
                ))}

            </div>

            {/* Bottom */}
            <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-[22px]">

                <div className="space-y-3">
                    <div className="h-4 w-32 skeleton rounded"></div>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="rounded-[15px] border border-white/[.07] h-16 skeleton"
                        />
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="h-4 w-40 skeleton rounded"></div>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-[15px] border border-white/[.07] skeleton h-16"
                        />
                    ))}
                </div>

            </div>

        </div>
    );
}
