import { promise } from "better-auth/*";
import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { Role } from "../../types/type";

const createPost = async (payload: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">, userId: string) => {
    const data = { ...payload, authorId: userId }

    const result = await prisma.post.create({ data })
    return result;
}




const getAllPosts = async ({ search, arrayOfTags, statusValue, isFeaturedBoolean, authorIdValue, take, skip, page,
    orderBy }: {
        search: string | undefined, arrayOfTags: string[] | [], isFeaturedBoolean: boolean | undefined, statusValue: PostStatus | undefined, authorIdValue: string | undefined, take: number, skip: number,
        orderBy: Record<string, "asc" | "desc">, page: number
    }) => {

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





    const data = await prisma.post.findMany({
        where: {
            AND: AndConditions
        }, take, skip, orderBy
        , include: {
            _count: { select: { comments: true } }
        }



    })

    const total = await prisma.post.count({
        where: {
            AND: AndConditions
        }
    })





    return {
        data,
        pagination: {
            total,
            page,
            limit: take,
            totalPage: Math.ceil(total / take)


        }
    }
}



const getPostById = async (postId: string) => {

    const result = await prisma.$transaction(async (tx) => {

        await tx.post.update({
            where: {
                id: postId
            }, data: {
                views: {
                    increment: 1
                }
            }
        })

        const data = await tx.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        replies: {
                            orderBy: {
                                createdAt: "asc",
                            },
                            include: {
                                replies: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
        })

        return data
    })

    return result

}


const getMyPosts = async (authorId: string) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId
        }, select: {
            id: true
        }
    })

    if (!userInfo) {
        throw new Error("post failed to load")
    }

    const data = await prisma.post.findMany({
        where: {
            authorId,
        }, orderBy: {
            createdAt: "desc"
        }, include: {
            _count: {
                select: { comments: true }
            }
        }
    })

    const total = await prisma.post.count({
        where: {
            authorId
        }
    })


    return { data, total }

}



const postUpdate = async (postId: string, authorId: string, payload: Partial<Post>, isAdmin: boolean) => {

    const findPost = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,

        }, select: {
            id: true,
            authorId: true
        }
    })
    if ((findPost.authorId !== authorId) && !isAdmin) {
        throw new Error("You are not owner or creator of the post")
    }
    if (isAdmin) {
        delete payload.isFeatured
    }


    return await prisma.post.update({
        where: {
            id: findPost.id
        }, data: payload
    })
}


// user nijer post delete kortae parbe
// admin all post delete korete parebe 

const postDelete = async (id: string, authorId: string, role: Role) => {

    const findPost = await prisma.post.findUniqueOrThrow({
        where: { id },
        select: {
            authorId: true,
        }
    })


    if (findPost.authorId !== authorId && role !== Role.ADMIN) {
        throw new Error("invalid user response to delete post")
    }


    return prisma.post.delete({
        where: { id }
    })


}





const getStats = async () => {
  const [users, archived, published, drafts] = await Promise.all([
    prisma.user.count(),

    prisma.post.count({
      where: { status: PostStatus.ARCHIVE },
    }),

    prisma.post.count({
      where: { status: PostStatus.PUBLISHED },
    }),

    prisma.post.count({
      where: { status: PostStatus.DRAFT },
    }),
  ])

  return {
    users,
    posts: {
      archived,
      published,
      drafts,
      total: archived + published + drafts,
    },
  }
}




export const postServices = {
    createPost, getAllPosts, getPostById, getMyPosts, postUpdate, postDelete, getStats
}