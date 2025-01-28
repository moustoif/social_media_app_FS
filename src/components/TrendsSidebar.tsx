/* eslint-disable @typescript-eslint/no-unused-vars */

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[7rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();

  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to Follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
        <UserTooltip user={user}>
          <Link
            href={"/users/${user.username}"}
            className="flex items-center gap-3"
          >
            <UserAvatar profilePicture={user.profilePicture} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
        </UserTooltip>
          <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({followerId}) => followerId === user.id,
            ),
          }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    // Agrégation des hashtags pour obtenir les tendances
    const trendingHashtags = await prisma.hashtag.groupBy({
      by: ["hashtag"],
      _count: {
        hashtag: true,
      },
      orderBy: {
        _count: {
          hashtag: "desc",
        },
      },
      take: 4, // Limite les résultats à 5 hashtags
    });

    return trendingHashtags.map((tag) => ({
      hashtag: tag.hashtag,
      count: tag._count.hashtag,
    }));
  },
  ["trending_topics"],
  {
    revalidate: 5,
    //tags: ["trending_tags"],
  },
);

async function TrendingTopics() {
  const trending_topics = await getTrendingTopics();
  console.log("Hashtags tendances récupérés :", trending_topics); 

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trending_topics.map(({ hashtag, count }) => {
        const title = hashtag.slice(1); // Retirer le symbole #

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
