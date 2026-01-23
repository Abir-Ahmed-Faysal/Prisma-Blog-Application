
import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { CreateCommentPayload } from "../../types/comment.dto"
import { IPayloadUpdate } from "./comment.controller"





const postComment = async (payload: CreateCommentPayload) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }, select: { id: true }
    })

    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: { id: payload.parentId }, select: { id: true }
        })
    }
    return prisma.comment.create({
        data: payload
    })

}



const getCommentById = async (id: string) => {
    return await prisma.comment.findUnique({
        where: {
            id
        },
        include: {
            authorPost: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}


const getCommentByAuthor = async (authorId: string) => {
    return prisma.comment.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
        include: {
            authorPost: {
                select: {
                    id: true,
                    title: true
                },
            },
        },
    })
}


const updateComment = async (commentId: string, payload: IPayloadUpdate, authorId: string,) => {
    const result = await prisma.comment.findFirst({
        where: { id: commentId, authorId }
    })
    if (!result) {
        throw new Error(" not find")
    }
    return prisma.comment.update({
        where: { id: commentId },
        data: payload
    })
}

const moderateComment = async (id: string, authorId: string, payload: { status: CommentStatus }) => {
    const findComment = await prisma.comment.findUniqueOrThrow({
        where: {
            id,

        }, select: {
            id: true,
            status: true
        }
    })
    if (!findComment) {
        throw new Error("comment Doesn't find")
    }
    if (payload.status === findComment.status) {
        throw new Error(`${payload.status} already up to date`)
    }

    return prisma.comment.update({
        where: {
            id: findComment.id
        },
        data: payload
    })






}


const deleteComment = async (commentId: string, id: string) => {
    const matchComment = await prisma.comment.findFirst({
        where: { id: commentId, authorId: id },
        select: { id: true }
    })
    if (!matchComment) {
        throw new Error("your provide input is invalid")
    }

    return await prisma.comment.delete({
        where: { id: commentId }
    })
}







export const commentServices = {
    postComment, getCommentById, getCommentByAuthor, deleteComment, updateComment, moderateComment
}