import { Request, Response } from "express"
import { postServices } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums"
import { paginationSortHelper } from "../../utilities/paginationSortHelper"

import { Role } from "../../types/type"
import { success } from "better-auth/*"
import { deleteUser } from "better-auth/api"




const createPost = async (req: Request, res: Response) => {
    const body = req.body
    const user = req.user

    try {
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const data = await postServices.createPost(body, user.id)
        return res.status(201).json({ success: true, message: "server retrieve the data", data })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: "post creation failed", details: error })
    }
}
const getAllPosts = async (req: Request, res: Response) => {


    const { search, tags, status, authorId, isFeatured } = req.query
    const searchString = typeof search === "string" ? search : undefined

    const arrayOfTags = tags ? (tags as string).split(",") : []

    const isFeaturedBoolean = isFeatured === "true" ? true
        : isFeatured === "false" ? false : undefined


    const statusValue = status ? (status as PostStatus) : undefined

    const authorIdValue = typeof authorId === "string" ? authorId : undefined

    const { take,
        skip,
        orderBy, page } = paginationSortHelper(req.query)

    try {
        const data = await postServices.getAllPosts({
            search: searchString, arrayOfTags, statusValue, isFeaturedBoolean, authorIdValue, take, page,
            skip,
            orderBy
        })
        return res.status(200).json({ success: true, message: "data retrieve successfully", data })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error: "data retrieve failed", details: error })
    }
}

const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params


        if (!postId) {
            throw new Error("userId missing")
        }

        const result = await postServices.getPostById(postId)

        return res.status(200).json({
            success: true,
            message: "Data retrieved successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Data retrieval failed due to server error"
        })
    }
}


const getMyPost = async (req: Request, res: Response) => {

    try {
        const user = req.user
        if (!user) {
            throw new Error("you are not authorized")
        }

        const data = await postServices.getMyPosts(user?.id as string)

        return res.status(200).json({ success: true, message: "the message data retrieve successfully", data })
    } catch (e) {
        const errorM = (e instanceof Error) ? e : "internal server error"
        console.log(e);
        res.status(500).json({ success: false, error: errorM })
    }
}


const postUpdate = async (req: Request, res: Response) => {

    try {
        const user = req.user
        const { postId } = req.params
        const payload = req.body

        if (!user) {
            throw new Error("You are not authorized")
        }

        const isAdmin = user.role === Role.ADMIN

        if (!postId || typeof postId !== "string") {
            return res.status(400).json({
                success: true, message: "post ID not found"
            })
        }
        const data = await postServices.postUpdate(postId, user?.id as string, payload, isAdmin)

        return res.status(200).json({ success: true, message: "successfully data retrieve", data })


    } catch (e) {
        const errorM = (e instanceof Error) ? e : "internal server error"
        console.log(e);
        res.status(500).json({ success: false, error: errorM })
    }

}


const postDelete = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        const user = req.user
        if (!user) {
            return res.status(400).json({ success: false, error: "post Id not found" })
        }

        if (!postId || (postId && typeof postId !== "string")) {
            return res.status(400).json({ success: false, error: "post Id not found" })
        }

        const data = await postServices.postDelete(postId, user?.id as string, user?.role as Role)


        return res.status(203).json({
            success: true, message: "post successfully ", data
        })







    } catch (error) {
        const errorM = error instanceof Error ? error : "internal server error due to delete failed"
        console.log(error);
        res.status(500).json({ success: false, error: errorM })
    }



}


const getStats = async (req: Request, res: Response) => {
    try {

        const data = await postServices.getStats()
        return res.status(203).json({
            success: true, message: "post successfully ", data
        })

    } catch (error) {
        const errorM = error instanceof Error ? error : "internal server error due to delete failed"
        console.log(error);
        res.status(500).json({ success: false, error: errorM })
    }
}



export const postController = {
    createPost, getAllPosts, getPostById, getMyPost, postUpdate, postDelete, getStats
}