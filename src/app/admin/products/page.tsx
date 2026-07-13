"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, LayoutDashboard, LogOut, RefreshCw } from "lucide-react"
import { Product, ApiMeta } from "@/lib/types"
import { getToken, removeToken, getUser, isLoggedIn } from "@/lib/auth"
import { API_URL } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/table"
import { Alert, AlertDescription } from "@/components/snackbar"
import { Skeleton } from "@/components/skeleton"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/pagination"

const ITEMS_PER_PAGE = 8

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<ApiMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [snackbar, setSnackbar] = useState<{ msg: string; type: "ok" | "err" } | null>(null)
  const user = typeof window !== "undefined" ? getUser() : null

  const showSnack = (msg: string, type: "ok" | "err" = "ok") => {
    setSnackbar({ msg, type })
    setTimeout(() => setSnackbar(null), 3000)
  }

  useEffect(() => {
    if (!isLoggedIn()) { router.replace("/login"); return }
  }, [router])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_URL}/api/products?page=${page}&limit=${ITEMS_PER_PAGE}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      )
      const json = await res.json()
      setProducts(json.data ?? [])
      setMeta(json.meta ?? null)
    } catch {
      showSnack("Gagal memuat produk", "err")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: number) => {
    setDeleting(true)
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      showSnack("Produk berhasil dihapus!")
      setDeleteTarget(null)
      fetchProducts()
    } catch {
      showSnack("Gagal menghapus produk", "err")
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = meta?.totalPages ?? 1

  return (
    <div className="flex flex-col">

      {snackbar && (
        <div className="fixed bottom-6 right-6 z-50 w-72">
          <Alert variant={snackbar.type === "err" ? "destructive" : "default"}>
            <AlertDescription>{snackbar.msg}</AlertDescription>
          </Alert>
        </div>
      )}

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="border-4 border-border bg-white max-w-sm w-full p-6 flex flex-col gap-4" style={{ boxShadow: "8px 8px 0 var(--color-border)" }}>
            <div>
              <h3 className="font-base font-black text-xl">Hapus Produk?</h3>
              <p className="font-base font-medium text-sm text-foreground/60 mt-1">
                Produk akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleDelete(deleteTarget)}
                disabled={deleting}
                className="flex-1 border-4 rounded-none"
                style={{ boxShadow: "4px 4px 0 var(--color-accent-pink)" }}
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </Button>
              <Button
                variant="neutral"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border-4 rounded-none"
                style={{ boxShadow: "4px 4px 0 var(--color-border)" }}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b-4 border-border bg-main px-6 sm:px-10 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="border-4 border-border bg-black p-2.5 shrink-0">
            <LayoutDashboard size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-base font-black">Admin Produk</h1>
            {user && (
              <p className="font-base font-medium text-xs text-foreground/60 mt-0.5">
                Login sebagai <strong>{user.name}</strong> — {user.role}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="neutral"
            onClick={fetchProducts}
            className="border-4 rounded-none"
            style={{ boxShadow: "3px 3px 0 var(--color-border)" }}
          >
            <RefreshCw size={14} strokeWidth={2.5} /> Refresh
          </Button>
          <Button
            asChild
            className="border-4 rounded-none"
            style={{ boxShadow: "3px 3px 0 var(--color-border)" }}
          >
            <Link href="/admin/products/add">
              <Plus size={16} strokeWidth={3} /> Tambah Produk
            </Link>
          </Button>
          <Button
            variant="neutral"
            onClick={() => { removeToken(); router.push("/") }}
            className="border-4 rounded-none"
            style={{ boxShadow: "3px 3px 0 var(--color-border)" }}
          >
            <LogOut size={14} strokeWidth={2.5} /> Logout
          </Button>
        </div>
      </div>

      <div className="border-b-4 border-border grid grid-cols-3">
        {[
          { label: "Total Produk", value: meta?.total ?? "—", bg: "bg-accent-lavender" },
          { label: "Halaman", value: page, bg: "bg-accent-blue" },
          { label: "Total Halaman", value: totalPages, bg: "bg-main" },
        ].map(({ label, value, bg }, i) => (
          <div key={i} className={`${bg} ${i < 2 ? "border-r-4 border-border" : ""} px-6 py-4 text-center`}>
            <p className="font-base font-black text-2xl">{value}</p>
            <p className="font-base font-medium text-xs text-foreground/60 mt-0.5 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-background px-6 sm:px-10 py-8">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-none border-4 border-border" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border-4 border-border bg-main p-10 text-center" style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
            <p className="font-base font-black text-xl">Belum ada produk</p>
            <Button asChild className="border-4 rounded-none mt-4" style={{ boxShadow: "3px 3px 0 var(--color-border)" }}>
              <Link href="/admin/products/add">+ Tambah Sekarang</Link>
            </Button>
          </div>
        ) : (
          <div style={{ boxShadow: "5px 5px 0 var(--color-border)" }}>
            <Table className="border-4">
              <TableHeader>
                <TableRow className="bg-main hover:bg-main">
                  <TableHead className="font-black text-xs uppercase w-12">No</TableHead>
                  <TableHead className="font-black text-xs uppercase">Nama</TableHead>
                  <TableHead className="font-black text-xs uppercase hidden sm:table-cell">Kategori</TableHead>
                  <TableHead className="font-black text-xs uppercase">Harga</TableHead>
                  <TableHead className="font-black text-xs uppercase">Stok</TableHead>
                  <TableHead className="font-black text-xs uppercase">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} className="hover:bg-main/30 bg-white">
                    <TableCell className="font-base font-bold text-sm text-foreground/50">
                      {(page - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell className="font-base font-bold text-sm max-w-[150px]">
                      <span className="truncate block">{product.name}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="border-2 border-border bg-accent-blue px-2 py-0.5 font-base font-bold text-xs">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-base font-bold text-sm whitespace-nowrap">
                      Rp {product.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span className={`border-2 border-border px-2 py-0.5 font-base font-black text-xs ${product.stock === 0
                          ? "bg-black text-white"
                          : product.stock <= 5
                            ? "bg-accent-pink text-white"
                            : "bg-accent-blue text-black"
                        }`}>
                        {product.stock === 0 ? "HABIS" : product.stock <= 5 ? "MENIPIS" : "OK"}
                      </span>
                      <p className="font-base text-xs font-medium text-foreground/50 mt-0.5">{product.stock} unit</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="neutral"
                          size="sm"
                          asChild
                          className="border-4 rounded-none"
                          style={{ boxShadow: "2px 2px 0 var(--color-border)" }}
                        >
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil size={12} strokeWidth={2.5} /> Edit
                          </Link>
                        </Button>
                        <Button
                          variant="neutral"
                          size="sm"
                          onClick={() => setDeleteTarget(product.id)}
                          className="border-4 rounded-none hover:bg-accent-pink hover:text-white"
                          style={{ boxShadow: "2px 2px 0 var(--color-border)" }}
                        >
                          <Trash2 size={12} strokeWidth={2.5} /> Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                    className={`border-4 rounded-none ${page === 1 ? "opacity-40 pointer-events-none" : ""}`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p) }}
                      className="border-4 rounded-none"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                    className={`border-4 rounded-none ${page === totalPages ? "opacity-40 pointer-events-none" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
