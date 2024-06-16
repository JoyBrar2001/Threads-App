import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { SkeletonHeader } from "@/components/skeleton/SkeletonHeading";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonHeader />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}