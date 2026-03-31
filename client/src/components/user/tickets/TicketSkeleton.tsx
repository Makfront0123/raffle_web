import { Skeleton } from "@/components/ui/skeleton";

function TicketsSkeleton() {
    return (
        <div className="grid md:grid-cols-10 grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 50 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
        </div>
    );
}

export default TicketsSkeleton;