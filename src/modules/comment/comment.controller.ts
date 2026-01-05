import { Request, Response } from "express"
import { commentServices } from "./comment.service"
import { success } from "better-auth/*"
interface IPayload {
    content: string
    postId: string
    parentId?: string
}


const postComment = async (req: Request, res: Response) => {
    try {

        const user = req.user

        const { content,
            postId,
            parentId }: IPayload = req.body

        if (!user) {
            throw new Error("the user is must be login")
        }


        if (!content || !
            postId || !
            parentId) {
            throw new Error("the post payload must be contain content authorId , postId, parentId ")
        }
        const payload = {
            authorId: user.id,
            postId, parentId,content
        }

        const data = await commentServices.postComment(payload)



res.status(201).json({success:true,message:"comment create successfully",data})




    } catch (error) {

    }





}









export const commentController = {
    postComment
}