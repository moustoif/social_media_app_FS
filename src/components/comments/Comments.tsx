import kyInstance from "@/lib/ky";
import { CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import { Button } from "../ui/button";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {
    const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.previousCursor ||null , //(firstPage) => firstPage.previousCursor,
      
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
      
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const uniqueComments = Array.from(
    new Map(comments.map((comment) => [comment.id, comment])).values()
  );

  const orderedComments = uniqueComments.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
            <Button
                variant="link"
                className="mx-auto block"
                disabled={isFetching}
                onClick={() => fetchNextPage()}
            >
                Load previous comments
            </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {orderedComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}