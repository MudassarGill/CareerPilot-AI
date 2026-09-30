export function CardSkeleton() {
    return (
        <div className="w-full bg-card rounded-2xl border border-border-soft overflow-hidden animate-pulse">
            <div className="w-full aspect-[16/9] bg-zinc-200" />
            <div className="p-5 pt-8">
                <div className="h-6 w-3/4 bg-zinc-200 rounded mb-3" />
                <div className="h-4 w-full bg-zinc-100 rounded mb-2" />
                <div className="h-4 w-5/6 bg-zinc-100 rounded mb-6" />

                <div className="h-8 w-1/3 bg-zinc-200 rounded mb-2" />
                <div className="h-2 w-full bg-zinc-200 rounded-full" />
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="w-full h-[280px] bg-zinc-200 rounded-3xl animate-pulse mb-12 flex flex-col justify-center px-12">
            <div className="h-12 w-1/2 bg-zinc-300 rounded-lg mb-4" />
            <div className="h-6 w-1/3 bg-zinc-300 rounded mb-2" />
            <div className="h-6 w-1/4 bg-zinc-300 rounded" />
        </div>
    );
}
