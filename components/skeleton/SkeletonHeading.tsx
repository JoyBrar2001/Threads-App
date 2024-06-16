import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonHeader() {
  return (
    <div>
      <Skeleton className="h-[60px] w-[200px] rounded-xl" />
    </div>
  )
}
