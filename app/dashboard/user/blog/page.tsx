import { getAllPosts, getAllTags } from "@/app/actions/posts"
import { PostsPageClient } from "./posts-page-client"

export default async function PostsPage() {
  const [allPosts, allTags] = await Promise.all([getAllPosts(), getAllTags()])
  return <PostsPageClient posts={allPosts} tags={allTags} />
}
