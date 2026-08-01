export default function DashboardSkeleton() {
    return (
        <div className="w-full min-h-screen bg-black text-zinc-100 font-sans p-6 md:p-12 flex flex-col items-center">

            <div className="w-full max-w-4xl space-y-10">

                {/* Header */}
                <div className="space-y-3 border-b border-zinc-900 pb-6">
                    <div className="h-10 w-72 skeleton rounded-lg"></div>
                    <div className="h-4 w-96 skeleton rounded"></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                        >
                            <div className="flex justify-between items-start">

                                {/* Title */}
                                <div className="h-4 w-24 skeleton rounded"></div>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl skeleton"></div>

                            </div>

                            <div className="mt-6 space-y-2">

                                {/* Main Value */}
                                <div className="h-8 w-16 skeleton rounded"></div>

                                {/* Subtitle */}
                                <div className="h-3 w-24 skeleton rounded"></div>

                            </div>
                        </div>
                    ))}

                </div>

                {/* Bottom */}
                <div className="grid lg:grid-cols-2 gap-8">

                    <div className="space-y-4">

                        <div className="h-4 w-32 skeleton rounded"></div>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-zinc-800 h-20 skeleton"
                            />
                        ))}

                    </div>

                    <div className="space-y-4">

                        <div className="h-4 w-40 skeleton rounded"></div>

                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl border border-zinc-800 skeleton h-20"
                            />
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}