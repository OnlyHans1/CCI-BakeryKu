"use client"

import { useState, use } from "react"
import { useRouter } from "next/router"
import { notFound } from "next/navigation"
import Link from "next/link"

import { dummyProduct } from "@/lib/dummy"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/formCard"
import { Textarea } from "@/components/textArea"

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const existing = dummyProduct.find((p) => p.id === Number(id))

    if (!existing) return notFound()

    const router = useRouter()

    const [name, setName] = useState(existing.name)
    const [category, setCategory] = useState(existing.category)
    const [price, setPrice] = useState(existing.price)
    const [stock, setStock] = useState(existing.stock)
    const [description, setDescription] = useState(existing.description ?? "")
    const [image, setImage] = useState(existing.image ?? "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Diedit: ", { id: existing.id, name, category, price, stock })
        router.push("/admin/products")
    }

    return (
        <main>
            <h1 className="text-2xl font-heading font-bold mb-6">
                Edit: {existing.name}
            </h1>
            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>
                            Form Edit Product
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="name">
                                Nama Produk *
                            </Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="category">Kategori *</Label>
                            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <Label htmlFor="price">Harga *</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <Label htmlFor="stock">Stok *</Label>
                                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="image">URL Gambar</Label>
                            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        <Button type="submit">Simpan Perubahan</Button>
                        <Button type="button" variant="neutral" asChild>
                            <Link href="/admin/products">Batal</Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}