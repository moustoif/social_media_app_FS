import { useToast } from "@/hooks/use-toast";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { submitPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {
    const {toast} = useToast()

    const queryClient = useQueryClient();

    const {user} = useSession();

    const mutation = useMutation({
        mutationFn: async (input: string) => {
            return await submitPost(input);
        },
        onSuccess: async (newPost) => {
            const queryFilter = {
                queryKey: ["post-feed"],
                predicate(query) {
                    return (
                        query.queryKey.includes("for-you") ||
                        (query.queryKey.includes(user.id))
                    );
                },
            } satisfies QueryFilters;

            //revalidateTag("trending_tags");  // Invalide le cache après création du post

            await queryClient.cancelQueries(queryFilter);
            queryClient.invalidateQueries({ queryKey: ["trending_tags"] });
            queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
                queryFilter, 
                (oldData) => {
                    const firstPage = oldData?.pages[0];

                    if (firstPage) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    posts: [newPost, ...firstPage.posts],
                                    nextCursor: firstPage.nextCursor,
                                },
                                ...oldData.pages.slice(1),
                            ],
                        };
                    }
                },
            );

            queryClient.invalidateQueries({
                queryKey: queryFilter.queryKey,
                predicate(query) {
                    return queryFilter.predicate(query) && !query.state.data;
                },
            });

            toast({
                description: "Post created and shown instantly",
            });
        },
        onError(error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again.",
            });
        },
    });

    /* const mutation = useMutation({
        onSuccess: () => {},
        onError(error) {
            console.log(error);
            toast({
                variant: "destructive",
                description: "Failed to post. Please try again.",
            });
        },
    });
 */
    return mutation;
}