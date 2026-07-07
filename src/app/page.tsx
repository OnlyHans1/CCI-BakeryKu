import Link from "next/link";
import { dummyProduct } from "@/lib/dummy";

import ImageCard from "@/components/imageCard";
import { Button } from "@/components/ui/button";


export default function Home() {
  const featured = dummyProduct.slice(0, 4)
  return (
    <main>
      <section className="flex flex-col items-center text-center gap-6 py-16 border-4 border-border bg-main shadow-shadow">
        <h1 className="text-5xl font-heading font-black">Roti Segar Tiap Hari</h1>
        <p className="text-lg font-base max-w-md">
          Nikmati berbagai pilihan roti fresh dari dapur kami langsung ke meja kamu
        </p>
        <Button asChild size="lg"><Link href="/products">Lihat Produk</Link></Button>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-headign font-bold">Produk Unggulan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{featured.map((product) => (
          <ImageCard key={product.id} imageUrl={product.image ?? ""} caption={product.name} />
        ))}</div>
      </section>
    </main>
  );
}
