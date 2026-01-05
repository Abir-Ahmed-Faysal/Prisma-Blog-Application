interface IPayload {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface IPayloadReturn {
  take: number
  skip: number
  page:number
  orderBy: Record<string, "asc" | "desc">
}

const ALLOWED_SORT_FIELDS = ["createdAt", "updatedAt", "name"] as const

export const paginationSortHelper = (
  payload: IPayload
): IPayloadReturn => {

  const page = Math.max(Number(payload.page) || 1, 1)

  const limit = Math.min(Math.max(Number(payload.limit) || 5, 1), 100)


  const sortBy = ALLOWED_SORT_FIELDS.includes(
    payload.sortBy as any
  )
    ? payload.sortBy!
    : "createdAt"

  const sortOrder = payload.sortOrder === "asc" ? "asc" : "desc"

  const take = limit
  const skip = (page - 1) * take

  return {
    take, page,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  }
}
