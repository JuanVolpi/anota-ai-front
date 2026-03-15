import { Card, Skeleton } from "@heroui/react";

export function TopicCardSkeleton() {
    return (
        <Card className="relative rounded-xl border border-divider bg-default-50 dark:bg-default-100/5 overflow-hidden p-4" shadow="sm">
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-default-200" />

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

                        <Skeleton className="h-4 w-3/5 rounded-lg" />
                    </div>
                    <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>

                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <Skeleton className="h-3 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-14 rounded-md" />
                </div>
            </div>
        </Card>
    );
}