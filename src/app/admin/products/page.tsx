"use client"

import Link from "next/link"
import { useState } from "react"
import { dummyProduct } from "@/lib/dummy"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/table"
import { Dialog } from "@/components/dialog"
import { Button } from "@/components/ui/button"

export default function AdminProductsPage() {
  const [products, setProducts] = useState(dummyProduct)

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <main>
      <div> </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyProduct.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button asChild><Link href={`/admin/products/${product.id}/edit`}>Edit</Link></Button>
                <Button onClick={() => handleDelete(product.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
