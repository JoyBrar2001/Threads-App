"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { fetchUser } from "./user.actions";

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image'
      }
    });

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();

  try {
    const thread = await Thread
      .findById(id)
      .populate({
        path: 'author',
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: "_id id name parentId image",
            },
          },
        ]
      })
      .exec()

    return thread;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchNumberOfLikes(postId: string) { 
  connectToDB();
  const thread = await Thread.findById(postId);
  return thread.likes.length;
}

export async function isThreadLikedByUser({ postId, userId }: { postId: string, userId: string | undefined }) {
  connectToDB();

  try {
    if (!userId) return false;

    const user = await User.findOne({ id: userId });
    if (!user) return false;

    return user.likedPosts?.includes(postId);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function likeThread({ postId, userId, path }: { postId: string, userId: string | undefined, path: string }) {
  connectToDB();

  try {
    const user = await fetchUser(userId);

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { likedPosts: postId },
    });

    await Thread.findByIdAndUpdate(postId, {
      $addToSet: { likes: user._id },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function unlikeThread({ postId, userId, path }: { postId: string, userId: string | undefined, path: string }) {
  connectToDB();

  try {
    const user = await fetchUser(userId);

    await User.findByIdAndUpdate(user._id, {
      $pull: { likedPosts: postId },
    });

    await Thread.findByIdAndUpdate(postId, {
      $pull: { likes: user._id },
    })

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function createThread({ text, author, communityId, path }: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error}`)
  }
}

export async function addCommentToThread({ threadId, commentText, userId, path }: { threadId: string, commentText: string, userId: string, path: string }) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if(!originalThread){
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }
}
