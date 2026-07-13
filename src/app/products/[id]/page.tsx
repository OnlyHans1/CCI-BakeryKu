import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Package } from "lucide-react";
import { Product } from "@/lib/types";
import { API_URL, assetUrl } from "@/lib/api";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="flex flex-col">

      <div className="border-b-4 border-border bg-accent-lavender px-6 sm:px-10 md:px-16 py-3">
        <div className="flex items-center gap-2 font-base font-bold text-sm flex-wrap">
          <Link href="/" className="hover:underline underline-offset-4 text-foreground/60 hover:text-foreground transition-colors">Home</Link>
          <span className="text-foreground/40">/</span>
          <Link href="/products" className="hover:underline underline-offset-4 text-foreground/60 hover:text-foreground transition-colors">Produk</Link>
          <span className="text-foreground/40">/</span>
          <span className="font-black text-foreground truncate max-w-[180px]">{product.name}</span>
        </div>
      </div>

      <div className="border-b-4 border-border bg-background px-6 sm:px-10 md:px-16 py-10 sm:py-14">
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12 max-w-6xl">

          <div className="border-4 border-border overflow-hidden w-full md:w-[480px] shrink-0" style={{ boxShadow: '6px 6px 0 var(--color-border)' }}>
            <img
              src={assetUrl(product.image)}
              alt={product.name}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className={`border-t-4 border-border px-4 py-2.5 font-base font-black text-xs flex items-center gap-2 ${isOutOfStock ? "bg-black text-white" : isLowStock ? "bg-accent-pink text-white" : "bg-accent-blue text-black"}`}>
              <Package size={14} strokeWidth={3} />
              {isOutOfStock
                ? "HABIS TERJUAL"
                : isLowStock
                  ? `STOK MENIPIS — ${product.stock} sisa`
                  : `TERSEDIA — ${product.stock} unit`}
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1">

            <div className="flex flex-wrap gap-2">
              <span className="border-4 border-border bg-main text-foreground px-3 py-1 font-base font-black text-sm flex items-center gap-1.5" style={{ boxShadow: '3px 3px 0 var(--color-border)' }}>
                <Tag size={12} strokeWidth={3} /> {product.category}
              </span>
              {isLowStock && (
                <span className="border-4 border-border bg-black text-white px-3 py-1 font-base font-black text-sm" style={{ boxShadow: '3px 3px 0 var(--color-accent-pink)' }}>
                  STOK TERBATAS
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-base font-black leading-tight">{product.name}</h1>

            <div className="border-4 border-border bg-main px-6 py-4 w-fit" style={{ boxShadow: '5px 5px 0 var(--color-border)' }}>
              <p className="font-base text-xs font-bold uppercase tracking-wider text-foreground/60">Harga</p>
              <p className="text-3xl font-base font-black">Rp {product.price.toLocaleString("id-ID")}</p>
            </div>

            <div className="flex items-center gap-2 border-4 border-border bg-accent-blue px-4 py-2.5 w-fit" style={{ boxShadow: '3px 3px 0 var(--color-border)' }}>
              <Package size={16} strokeWidth={2.5} />
              <p className="font-base font-bold text-sm">Stok: <strong>{product.stock}</strong> tersedia</p>
            </div>

            {product.description && (
              <div className="border-4 border-border bg-accent-lavender p-5" style={{ boxShadow: '3px 3px 0 var(--color-border)' }}>
                <p className="font-base font-black text-xs uppercase tracking-wider mb-2 text-foreground/60">Deskripsi</p>
                <p className="font-base font-medium text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button
                className="border-4 border-border bg-black text-white px-6 py-3 font-base font-black text-sm cursor-pointer hover:bg-accent-pink transition-all duration-150"
                style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Stok Habis" : "Hubungi via WhatsApp"}
              </button>
              <Link
                href="/products"
                className="flex items-center gap-2 border-4 border-border bg-white text-foreground px-6 py-3 font-base font-black text-sm cursor-pointer hover:bg-main transition-colors"
                style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
              >
                <ArrowLeft size={16} /> Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}