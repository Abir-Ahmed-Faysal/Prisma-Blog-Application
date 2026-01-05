import { Request, Response } from "express"
import { postServices } from "./post.service"
import { PostStatus } from "../../../generated/prisma/enums"
import { paginationSortHelper } from "../../utilities/paginationSortHelper"


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
        const { postId} = req.params
        console.log('user id here: ******',postId);

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





export const postController = {
    createPost, getAllPosts,getPostById 
}