import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (payload: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const data = { ...payload, authorId: userId }

    const result = await prisma.post.create({ data })
    return result;
}




const getAllPosts = async ({ search, arrayOfTags, statusValue, isFeaturedBoolean, authorIdValue }: { search: string | undefined, arrayOfTags: string[] | [], isFeaturedBoolean: boolean | undefined, statusValue: PostStatus | undefined, authorIdValue: string | undefined }) => {

    const AndConditions: PostWhereInput[] = []

    if (search) {

        AndConditions.push({
            OR: [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                }, {
                    content: {
                        contains: search as string,
                        mode: "insensitive"
                    }
                },


            ]
        })
    }





    if (arrayOfTags.length > 0) {

        AndConditions.push({
            tags: {
                hasEvery: arrayOfTags as string[]
            }
        })




    }




    if (typeof isFeaturedBoolean === "boolean") {
        AndConditions.push({ isFeatured: isFeaturedBoolean })
    }

    if (statusValue) {
        AndConditions.push({ status: statusValue })
    }

    if (authorIdValue) {
        AndConditions.push({ authorId: authorIdValue })
    }




    const result = await prisma.post.findMany({
        where: {
            AND: AndConditions





        }




    })
    return result
}

export const postServices = {
    createPost, getAllPosts
}