"use client"

import Link from "next/link"
import { useState } from "react"
import { dummyProduct } from "@/lib/dummy"

import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/select"
import ImageCard from "@/components/imageCard"
import { Input } from "@/components/ui/input"

export default function ProductsPage() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")

    const filtered = dummyProduct.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === "all" || p.category === category
        return matchSearch && matchCat
    })

    return (
        <main className="flex flex-col gap-6">
            <h1 className="text-3xl font-heading font-bold">Semua Produk</h1>
            <div className="flex gap-3">
                <Input type="text" placeholder="Cari Produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="border-2 border-border px-3 py-2 w-full" />
                <Select onValueChange={(val) => setCategory(val)} defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="roti">Roti</SelectItem>
                        <SelectItem value="kue">Kue</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                        <ImageCard imageUrl={product.image ?? ""} caption={product.name} />
                    </Link>
                ))}
            </div>
        </main>
    )
}