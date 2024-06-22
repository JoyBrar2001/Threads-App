import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { timeElapsed } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">
        Activity
      </h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((act) => (
              <Link key={act._id} href={`/thread/${act.parentId || act._id}`}>
                <article className="activity-card">
                  <Image
                    src={act.author.image}
                    alt="Profile"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {act.author.name}
                    </span>
                    {" "}
                    {act.likes.includes(userInfo._id) ? "liked your thread" : "replied to your thread"}
                  </p>
                  <p className="!text-small-regular text-light-1 ml-auto">
                    {timeElapsed(act.createdAt)}
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-1">No activity found</p>
        )}
      </section>
    </section>
  )
}