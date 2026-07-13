export type Product = {
    id: number
    name: string
    category: string
    price: number
    stock: number
    description?: string
    image?: string
    createdAt: string
    updatedAt: string
}

export type ApiMeta = {
    total: number
    page: number
    limit: number
    totalPages: number
}

export type ApiProductsResponse = {
    data: Product[]
    meta: ApiMeta
}
