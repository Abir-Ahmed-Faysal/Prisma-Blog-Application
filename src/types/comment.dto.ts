// comment.dto.ts
export interface CreateCommentPayload {
    content: string
    postId: string
    authorId: string
    parentId: string | null
}
