"use client"

import { Link } from "lucide-react"
import { useRouter } from "next/router"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/formCard"
import { Textarea } from "@/components/textArea"

export default function AddProductPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !category || !price || !stock) {
            alert("Isi semua field yang wajib!")
            return
        }
        console.log({ name, category, price: Number(price), stock: Number(stock), description, image })
        alert("Produk berhasil ditambahkan! (dummy)")
        router.push("/admin/products")
    }

    return (
        <main>
            <h1 className="text-2xl font-heading font-bold mb-6">Tambah Produk</h1>
            <Card className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Form Produk Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="name">Nama Produk *</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Roti Tawar" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="category">Kategori *</Label>
                            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Roti" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                                <Label htmlFor="price">Harga *</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <Label htmlFor="stock">Stok *</Label>
                                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="50" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="image">URL Gambar</Label>
                            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi produk..." />
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-3">
                        <Button type="submit">Simpan</Button>
                        <Button type="button" variant="neutral" asChild>
                            <Link href="/admin/products">Batal</Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}