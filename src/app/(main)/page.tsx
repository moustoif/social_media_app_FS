import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  /* const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: {createdAt : "desc"},
  }); */
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
              <ForYouFeed />
          </TabsContent>
          <TabsContent value="for-you">
              <FollowingFeed />
          </TabsContent>
        </Tabs>
       {/*  {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))} */}
      </div>
      <TrendsSidebar/>
    </main>
  );
}
