"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Search, PackageSearch, ChevronLeft, ChevronRight } from "lucide-react"
import { Product, ApiMeta } from "@/lib/types"
import { API_URL, assetUrl } from "@/lib/api"
const ITEMS_PER_PAGE = 8

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<ApiMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [inputVal, setInputVal] = useState("")

  const categories = ["Roti", "Kue", "Pastry", "Spesial"]

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
      })
      if (search) params.set("search", search)
      if (category !== "all") params.set("category", category)

      const res = await fetch(`${API_URL}/api/products?${params}`)
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()
      setProducts(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    const t = setTimeout(() => { setSearch(inputVal); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [inputVal])

  const handleCategory = (val: string) => {
    setCategory(prev => prev === val ? "all" : val)
    setPage(1)
  }

  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="flex flex-col">

      <div className="border-b-4 border-border bg-accent-blue px-6 sm:px-10 md:px-16 py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl font-base font-black mb-2">Semua Produk</h1>
        <p className="font-base font-medium text-sm text-foreground/60">
          {loading ? "Memuat..." : `${meta?.total ?? 0} produk tersedia`}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => { setCategory("all"); setPage(1) }}
            className={`border-4 border-border px-4 py-1.5 font-base font-bold text-xs cursor-pointer transition-colors ${category === "all" ? "bg-black text-white" : "bg-white text-foreground hover:bg-main"}`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`border-4 border-border px-4 py-1.5 font-base font-bold text-xs cursor-pointer transition-colors ${category === cat ? "bg-black text-white" : "bg-white text-foreground hover:bg-main"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b-4 border-border bg-background px-6 sm:px-10 md:px-16 py-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="border-4 border-border bg-white px-3 py-2.5 pl-9 w-full font-base font-medium text-sm outline-none focus:border-accent-pink transition-colors"
          />
        </div>
      </div>

      <div className="px-6 sm:px-10 md:px-16 py-8 sm:py-12 bg-background">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="border-4 border-border overflow-hidden" style={{ boxShadow: '5px 5px 0 var(--color-border)' }}>
                <div className="w-full aspect-[4/3] bg-main/60 animate-pulse" />
                <div className="border-t-4 border-border p-3 flex flex-col gap-2">
                  <div className="h-3 w-3/4 bg-gray-200 animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border-4 border-border bg-main p-12 text-center flex flex-col items-center gap-5" style={{ boxShadow: '5px 5px 0 var(--color-border)' }}>
            <div className="border-4 border-border bg-black p-4 w-fit">
              <PackageSearch size={32} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-base font-black text-2xl">Produk tidak ditemukan</p>
              <p className="font-base font-medium text-sm mt-2 text-foreground/60">Coba kata kunci atau kategori lain</p>
            </div>
            <button
              onClick={() => { setInputVal(""); setCategory("all"); setPage(1) }}
              className="border-4 border-border bg-black text-white px-5 py-2 font-base font-bold text-sm cursor-pointer hover:bg-accent-pink transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group block"
              >
                <div
                  className="border-4 border-border overflow-hidden cursor-pointer transition-all duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
                >
                  <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="border-t-4 border-border p-3 bg-main">
                    <p className="font-base font-bold text-sm leading-tight truncate">{product.name}</p>
                    <span className="inline-block border-2 border-border bg-white text-foreground px-2 py-0.5 font-base font-bold text-[10px] mt-1 mb-1">{product.category}</span>
                    <p className="font-base font-black text-base">Rp {product.price.toLocaleString("id-ID")}</p>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="inline-block border-2 border-border bg-accent-pink text-white px-2 py-0.5 font-base font-bold text-[10px] mt-1">STOK MENIPIS</span>
                    )}
                    {product.stock === 0 && (
                      <span className="inline-block border-2 border-border bg-black text-white px-2 py-0.5 font-base font-bold text-[10px] mt-1">HABIS</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-4 border-border bg-white p-2 font-base font-bold cursor-pointer hover:bg-main transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '3px 3px 0 var(--color-border)' }}
            >
              <ChevronLeft size={16} strokeWidth={3} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`border-4 border-border min-w-[40px] h-10 font-base font-black text-sm cursor-pointer transition-colors ${p === page ? "bg-black text-white" : "bg-white hover:bg-main"}`}
                style={{ boxShadow: p === page ? 'none' : '3px 3px 0 var(--color-border)' }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-4 border-border bg-white p-2 font-base font-bold cursor-pointer hover:bg-main transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '3px 3px 0 var(--color-border)' }}
            >
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}