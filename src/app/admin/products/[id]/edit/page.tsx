"use client"

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Pencil, ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/formCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Textarea } from "@/components/textArea"
import { Alert, AlertDescription } from "@/components/snackbar"
import { getToken, isLoggedIn } from "@/lib/auth"
import { API_URL, assetUrl } from "@/lib/api"
import { Product } from "@/lib/types"

const CATEGORIES = ["Roti", "Kue", "Pastry", "Spesial"]

export default function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params)
    const router = useRouter()
    const fileRef = useRef<HTMLInputElement>(null)

    const [product, setProduct] = useState<Product | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [fetching, setFetching] = useState(true)

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [price, setPrice] = useState("")
    const [stock, setStock] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

    useEffect(() => {
        if (!isLoggedIn()) { router.replace("/login"); return }
    }, [router])

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`)
                if (res.status === 404) { setNotFound(true); return }
                if (!res.ok) throw new Error()
                const data: Product = await res.json()
                setProduct(data)
                setName(data.name)
                setCategory(data.category)
                setPrice(String(data.price))
                setStock(String(data.stock))
                setDescription(data.description ?? "")
                if (data.image) setImagePreview(assetUrl(data.image))
            } catch {
                setNotFound(true)
            } finally {
                setFetching(false)
            }
        }
        load()
    }, [id])

    const showSnack = (msg: string, type: "ok" | "err" = "ok") => {
        setSnackbar({ msg, type })
        setTimeout(() => setSnackbar(null), 3000)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        if (fileRef.current) fileRef.current.value = ""
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !category || !price || !stock) {
            showSnack("Isi semua field yang wajib!", "err")
            return
        }
        setLoading(true)
        try {
            let imagePath = product?.image ?? ""

            if (imageFile) {
                const fd = new FormData()
                fd.append("image", imageFile)
                const upRes = await fetch(`${API_URL}/api/upload`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: fd,
                })
                if (!upRes.ok) throw new Error("Gagal upload gambar")
                const upData = await upRes.json()
                imagePath = upData.path ?? ""
            }

            const res = await fetch(`${API_URL}/api/products/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    name, category,
                    price: Number(price),
                    stock: Number(stock),
                    description,
                    image: imagePath,
                }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Gagal memperbarui")
            }
            showSnack("Produk berhasil diperbarui!")
            setTimeout(() => router.push("/admin/products"), 1200)
        } catch (err: unknown) {
            showSnack(err instanceof Error ? err.message : "Gagal memperbarui produk", "err")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="px-6 py-20 flex justify-center">
                <p className="font-base font-black text-xl animate-pulse">Memuat data produk...</p>
            </div>
        )
    }

    if (notFound || !product) {
        return (
            <div className="border-b-4 border-border bg-main px-6 py-20 flex flex-col items-center gap-4 text-center">
                <p className="font-base font-black text-2xl">Produk tidak ditemukan</p>
                <Button asChild className="border-4 rounded-none" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
                    <Link href="/admin/products"><ArrowLeft size={16} /> Kembali</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col">

            {snackbar && (
                <div className="fixed bottom-6 right-6 z-50 w-72">
                    <Alert variant={snackbar.type === "err" ? "destructive" : "default"}>
                        <AlertDescription>{snackbar.msg}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="border-b-4 border-border bg-accent-lavender px-6 sm:px-10 py-3">
                <div className="flex items-center gap-2 font-base font-bold text-sm">
                    <Link href="/admin/products" className="hover:underline text-foreground/60 hover:text-foreground transition-colors">
                        Admin Produk
                    </Link>
                    <span className="text-foreground/40">/</span>
                    <span className="font-black truncate max-w-[180px]">Edit: {product.name}</span>
                </div>
            </div>

            <div className="border-b-4 border-border bg-accent-blue px-6 sm:px-10 py-6 flex items-center gap-3">
                <div className="border-4 border-border bg-black p-2.5 shrink-0">
                    <Pencil size={20} color="white" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-base font-black">Edit Produk</h1>
                    <p className="font-base font-medium text-xs text-foreground/60 mt-0.5">
                        Mengedit: <strong>{product.name}</strong>
                    </p>
                </div>
            </div>

            <div className="bg-background px-6 sm:px-10 py-10">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <Card className="border-4 rounded-none" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
                            <CardHeader className="border-b-4 border-border pb-4">
                                <CardTitle className="font-black text-lg">Data Produk</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5 pt-4">

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Produk <span className="text-accent-pink">*</span></Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border-4 rounded-none" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="category">Kategori <span className="text-accent-pink">*</span></Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger id="category" className="border-4 rounded-none h-11">
                                            <SelectValue placeholder="Pilih kategori..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-4">
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c} className="rounded-none">{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="price">Harga (Rp) <span className="text-accent-pink">*</span></Label>
                                        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" className="border-4 rounded-none" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="stock">Stok <span className="text-accent-pink">*</span></Label>
                                        <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" className="border-4 rounded-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="border-4 rounded-none resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-4 rounded-none" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
                            <CardHeader className="border-b-4 border-border pb-4">
                                <CardTitle className="font-black text-lg">Gambar Produk</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 pt-4">

                                {imagePreview ? (
                                    <div className="relative border-4 border-border overflow-hidden" style={{ boxShadow: "3px 3px 0 var(--color-border)" }}>
                                        <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 border-4 border-border bg-black text-white p-1 cursor-pointer hover:bg-accent-pink transition-colors"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-4 border-dashed border-border bg-main/30 aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-main/60 transition-colors"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <div className="border-4 border-border bg-black p-4">
                                            <ImagePlus size={28} color="white" strokeWidth={2} />
                                        </div>
                                        <p className="font-base font-bold text-sm">Klik untuk pilih gambar</p>
                                        <p className="font-base text-xs text-foreground/50">JPG, PNG, WEBP — maks 5MB</p>
                                    </div>
                                )}

                                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                                {imagePreview && (
                                    <Button type="button" variant="neutral" onClick={() => fileRef.current?.click()} className="border-4 rounded-none w-full">
                                        <ImagePlus size={16} /> Ganti Gambar
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex gap-3 flex-wrap mt-6">
                        <Button type="submit" disabled={loading} className="border-4 rounded-none px-8" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
                            <Save size={16} strokeWidth={2.5} />
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Button type="button" variant="neutral" asChild className="border-4 rounded-none" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
                            <Link href="/admin/products"><ArrowLeft size={16} strokeWidth={2.5} /> Batal</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}