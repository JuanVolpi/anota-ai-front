import { Card, CardBody, CardFooter } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Skeleton } from '@heroui/skeleton';

export function NoteCardSkeleton() {
    return (
        <Card
            className="border h-52 border-divider bg-default-50 dark:bg-default-100/5 shadow-none overflow-hidden flex flex-col"
            shadow="none"
        >
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-default-200" />

            <CardBody className="flex flex-col gap-3 p-4 flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                        <Skeleton className="h-4 rounded-md flex-1 max-w-[70%]" />
                    </div>
                    <Skeleton className="w-4 h-4 rounded shrink-0" />
                </div>

                <div className="flex flex-col gap-2 mt-1">
                    <Skeleton className="h-3 rounded-md w-full" />
                    <Skeleton className="h-3 rounded-md w-5/6" />
                    <Skeleton className="h-3 rounded-md w-3/4" />
                </div>
            </CardBody>

            <Divider className="opacity-50" />

            <CardFooter className="px-3 py-2 flex flex-col gap-1.5 shrink-0">
                <div className="flex items-center justify-between w-full">
                    <div className="flex gap-1">
                        <Skeleton className="h-6 w-14 rounded-lg" />
                        <Skeleton className="h-6 w-14 rounded-lg" />
                    </div>
                    <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Divider />
                <div className="flex items-center gap-1 p-1">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
            </CardFooter>
        </Card>
    );
}