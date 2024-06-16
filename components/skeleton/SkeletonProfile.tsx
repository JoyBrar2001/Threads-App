import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProfile() {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-6 w-[400px]" />
    </>
  )
}
