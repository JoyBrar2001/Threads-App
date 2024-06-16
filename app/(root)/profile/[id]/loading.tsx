import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { SkeletonHeader } from "@/components/skeleton/SkeletonHeading";
import { SkeletonProfile } from "@/components/skeleton/SkeletonProfile";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <SkeletonProfile />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}