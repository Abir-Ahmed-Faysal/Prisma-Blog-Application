import { prisma } from "../../lib/prisma"


interface IPayload {
    content: string
    postId: string
    authorId:string
    parentId?: string
}

const postComment = async (payload: IPayload) => {


    return prisma.comment.create({
        data:payload
})

}


export const commentServices = {
    postComment
}