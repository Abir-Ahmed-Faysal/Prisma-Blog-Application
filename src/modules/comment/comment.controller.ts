// comment.controller.ts
import { Request, Response } from "express"
import { commentServices } from "./comment.service"
import { CreateCommentPayload } from "../../types/comment.dto"
import { CommentStatus } from "../../../generated/prisma/enums"


interface CommentRequestBody {
    content: string
    postId: string
    parentId?: string
}

export interface IPayloadUpdate {
    content?: string
    status?: CommentStatus
}

const postComment = async (req: Request, res: Response) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User must be logged in"
            })
        }

        const { content, postId, parentId }: CommentRequestBody = req.body

        if (!content || !postId) {
            return res.status(400).json({
                success: false,
                message: "content and postId are required"
            })
        }


        const payload: CreateCommentPayload = {
            content,
            postId,
            authorId: user.id,
            parentId: parentId ?? null
        }

        const data = await commentServices.postComment(payload)

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Comment creation failed"
        })
    }
}

const getCommentById = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params

        if (!commentId || typeof commentId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Comment id is required and must be a string",
            })
        }

        const result = await commentServices.getCommentById(commentId)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

const getCommentByAuthor = async (req: Request, res: Response) => {
    try {
        const { authorId } = req.params
        if (!authorId || typeof authorId !== "string") {
            throw new Error("must contain author id")
        }
        return commentServices.getCommentByAuthor(authorId)

    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error", err: error })
    }
}


const updateComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const user = req.user
        const { content, status } = req.body

        const payload: IPayloadUpdate = {
            content, status
        }
        if (!commentId || typeof commentId !== "string") {
            return res.status(400).json({ success: false, message: "the comment must be include" })
        }

        if (!user) {
            return res.status(400).json({ success: true, message: "login first" })
        }


        return commentServices.updateComment(commentId, payload, user?.id)

    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}


const moderateComment = async (req: Request, res: Response) => {
    try {

        const { commentId } = req.params
        const authorId = (req.user!).id
        const payload = req.body
        if (!commentId || (commentId && typeof commentId !== "string")) {
            return res.status(400).json({ success: false })
        }

        if (typeof authorId !== 'string') {
            return res.status(400).json({
                status: false,
                message: "author id not find"
            })
        }


        const result = await commentServices.moderateComment(commentId, authorId, payload)
        return res.status(200).json({ success: true, message: "data status successfully updated", date: result })
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'comment update failed due to server error'
        return res.status(500).json({ success: true, message: errorMessage })
    }
}






const deleteComment = async (req: Request, res: Response) => {
    try {
        const { commentId } = req.params
        const user = req.user
        if (!commentId || typeof commentId !== "string") {
            return res.status(400).json({ success: false, message: "the comment must be include" })
        }
        return commentServices.deleteComment(commentId, user?.id as string)

    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error" })
    }
}


export const commentController = {
    postComment, getCommentById, getCommentByAuthor, updateComment, deleteComment, moderateComment
}
