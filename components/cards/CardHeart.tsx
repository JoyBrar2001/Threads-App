"use client";

import { useState } from "react";
import { likeThread, unlikeThread } from "@/lib/actions/thread.actions";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  liked: boolean;
  postId: string;
  userId: string | undefined;
  likes: number;
}

export default function CardHeart({ liked, postId, userId, likes }: Props) {
  const path = usePathname();
  
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeThread({ postId, userId, path });
        setLikeCount(likeCount - 1);
      } else {
        await likeThread({ postId, userId, path });
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <div className="flex justify-center items-center gap-1">
      <Heart
        height={24}
        width={24}
        stroke="#585876"
        strokeWidth={"1px"}
        fill={isLiked ? "#585876" : "#121417"}
        className="cursor-pointer"
        onClick={handleLike}
      />
      {likeCount > 0 && (
        <p className="text-xs text-[#585876]">
          {likeCount}
        </p>
      )}
    </div>
  );
}
