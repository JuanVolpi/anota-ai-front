import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { NoteCardSkeleton } from "@/components/notes/NoteCardSkeleton"; // Use o que criamos antes

export function TopicDetailSkeleton() {
    return (
        <div className="flex flex-col w-full min-h-0 flex-1">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-divider shrink-0">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

                <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-6 w-48 rounded-lg" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-64 rounded-lg" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                </div>

                <div className="flex gap-2 shrink-0">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
            </div>


            <div className="shrink-0 border-b border-divider px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                        <Skeleton className="h-3 w-48 rounded-lg" />
                    </div>
                    <Skeleton className="w-4 h-4 rounded-full" />
                </div>
            </div>

            {/* Filters Skeleton */}
            <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-3 border-b border-divider/50 justify-center">
                <Skeleton className="h-10 flex-1 rounded-xl max-w-3/5" />
                <Skeleton className="h-10 w-full sm:w-32 rounded-xl" />
            </div>

            {/* Notes Grid Skeleton */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Renderiza 8 cards de exemplo */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <NoteCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}