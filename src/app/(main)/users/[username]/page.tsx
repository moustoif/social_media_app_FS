import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserPosts from "./UserPosts";
import Linkify from "@/components/Linkify";
import EditProfileButton from "./EditProfileButton";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserid: string) => {
  const normalizedUsername = username.toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      username: normalizedUsername,
    },
    select: getUserDataSelect(loggedInUserid),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params; // Déstructuration à l'intérieur de la fonction
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  try {
    const user = await getUser(username, loggedInUser.id);
    return {
      title: `${user.displayName} (@${user.username})`,
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: PageProps) {
  const { username } = await params; // Déstructuration à l'intérieur de la fonction
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserid={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
                {user.displayName}&apos;s posts
            </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserid: string;
}

async function UserProfile({ user, loggedInUserid }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserid,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.profilePicture}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-4">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserid ? (
            <EditProfileButton user={user} />
        ) : (
            <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
            <hr />
            <Linkify>
              <div className="overflow-hidden whitespace-pre-line break-words">
                  {user.bio}
              </div>
            </Linkify>
        </>
      )}
    </div>
  );
}
