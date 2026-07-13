import Link from "next/link";
import { ArrowRight, Truck, Star, Clock, ChefHat, Leaf, Flame } from "lucide-react";
import { Product } from "@/lib/types";
import { API_URL, assetUrl } from "@/lib/api";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=4&page=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <div className="flex flex-col">

      <div className="border-b-4 border-border bg-black text-white overflow-hidden">
        <div className="ticker-track py-2.5">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 font-base font-black text-sm uppercase tracking-widest text-main">
              Roti Fresh <span className="text-accent-pink"><Star/></span> Pesan Sekarang <span className="text-accent-blue"><Star/></span> Gratis Ongkir <span className="text-main"><Star/></span> Buka 07:00–21:00 <span className="text-accent-pink"><Star/></span>
            </span>
          ))}
        </div>
      </div>

      <section className="border-b-4 border-border bg-main px-6 sm:px-10 md:px-16 py-14 sm:py-20 md:py-28 flex flex-col gap-6 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-48 sm:w-64 h-full bg-black/5 border-l-4 border-border hidden sm:block" />
        <div className="absolute top-8 right-8 w-24 h-24 sm:w-32 sm:h-32 bg-accent-pink border-4 border-border hidden sm:block" style={{ boxShadow: '6px 6px 0 var(--color-border)' }} />
        <div className="absolute bottom-8 right-16 w-16 h-16 bg-accent-blue border-4 border-border hidden sm:block" style={{ boxShadow: '4px 4px 0 var(--color-border)' }} />

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-base font-black leading-none max-w-2xl">
          Roti<br />
          <span className="bg-black text-main px-2 py-1 inline-block">Segar</span><br />
          Tiap Hari
        </h1>

        <p className="font-base text-base sm:text-lg max-w-md font-medium text-foreground/70 leading-relaxed">
          Nikmati berbagai pilihan roti fresh dari dapur kami. Dibuat dengan bahan premium, dipanggang sempurna setiap pagi.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/products"
            className="flex items-center gap-2 border-4 border-border bg-black text-white px-6 py-3 font-base font-black text-sm cursor-pointer hover:bg-accent-pink transition-colors"
            style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
          >
            Lihat Produk <ArrowRight size={16} strokeWidth={3} />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 border-4 border-border bg-white text-black px-6 py-3 font-base font-black text-sm cursor-pointer hover:bg-accent-lavender transition-colors"
            style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
          >
            Login Admin
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {["Roti", "Kue", "Pastry", "Spesial"].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat.toLowerCase()}`}
              className="border-4 border-border bg-white text-foreground px-3 py-1 font-base font-bold text-xs hover:bg-accent-blue transition-colors cursor-pointer"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b-4 border-border grid grid-cols-1 sm:grid-cols-3">
        <div className="border-b-4 sm:border-b-0 sm:border-r-4 border-border bg-accent-blue p-6 sm:p-8 flex items-center gap-4">
          <div className="border-4 border-border bg-black p-2.5 shrink-0">
            <Truck size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-base font-black text-sm uppercase tracking-wide">Pengiriman Cepat</p>
            <p className="font-base text-xs font-medium text-foreground/60 mt-0.5">Sampai dalam 1–2 jam</p>
          </div>
        </div>
        <div className="border-b-4 sm:border-b-0 sm:border-r-4 border-border bg-main p-6 sm:p-8 flex items-center gap-4">
          <div className="border-4 border-border bg-black p-2.5 shrink-0">
            <Star size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-base font-black text-sm uppercase tracking-wide">Kualitas Terjamin</p>
            <p className="font-base text-xs font-medium text-foreground/60 mt-0.5">Bahan premium pilihan</p>
          </div>
        </div>
        <div className="bg-accent-lavender p-6 sm:p-8 flex items-center gap-4">
          <div className="border-4 border-border bg-black p-2.5 shrink-0">
            <Clock size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-base font-black text-sm uppercase tracking-wide">Buka Setiap Hari</p>
            <p className="font-base text-xs font-medium text-foreground/60 mt-0.5">07:00 – 21:00 WIB</p>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-border bg-background px-6 sm:px-10 md:px-16 py-12 sm:py-16">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-base font-black">Produk Unggulan</h2>
            <span className="border-4 border-border bg-accent-pink text-white px-2.5 py-0.5 font-base font-black text-xs" style={{ boxShadow: '3px 3px 0 var(--color-border)' }}>HOT</span>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 border-4 border-border bg-white px-4 py-2 font-base font-bold text-sm hover:bg-main transition-colors cursor-pointer"
            style={{ boxShadow: '3px 3px 0 var(--color-border)' }}
          >
            Lihat Semua <ArrowRight size={14} strokeWidth={3} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border-4 border-border overflow-hidden" style={{ boxShadow: '5px 5px 0 var(--color-border)' }}>
                <div className="w-full aspect-[4/3] bg-main animate-pulse" />
                <div className="border-t-4 border-border p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 animate-pulse w-3/4 rounded-none" />
                  <div className="h-3 bg-gray-200 animate-pulse w-1/2 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featured.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group block">
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
                    <p className="font-base font-black text-base mt-1">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-b-4 border-border bg-black text-white px-6 sm:px-10 md:px-16 py-12 sm:py-16">
        <h2 className="text-3xl sm:text-4xl font-base font-black text-main mb-8">Kenapa Pilih BakeryKu?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ChefHat, title: "DIBUAT OLEH CHEF", desc: "Setiap roti dibuat oleh pastry chef berpengalaman lebih dari 10 tahun." },
            { icon: Leaf, title: "BAHAN ALAMI", desc: "Tanpa pengawet, tanpa pewarna buatan. Semua alami dan menyehatkan." },
            { icon: Star, title: "4.9 RATING", desc: "Lebih dari 5.000 pelanggan puas setiap bulannya. Bergabunglah!" },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="border-4 border-main p-6 flex flex-col gap-3"
              style={{ boxShadow: '5px 5px 0 var(--color-main)' }}
            >
              <div className="border-4 border-main bg-main p-2 w-fit">
                <Icon size={20} color="black" strokeWidth={2.5} />
              </div>
              <p className="font-base font-black text-main text-sm">{title}</p>
              <p className="font-base text-xs text-white/60 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-4 border-border bg-accent-pink px-6 sm:px-10 md:px-16 py-12 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-base font-black text-3xl sm:text-4xl leading-tight text-white">
            Siap Pesan<br />Roti Favoritmu?
          </p>
          <p className="font-base font-medium text-sm mt-2 text-white/80">Stok terbatas, pesan sekarang sebelum habis!</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 border-4 border-white bg-white text-black px-8 py-4 font-base font-black text-base cursor-pointer hover:bg-black hover:text-white transition-colors shrink-0"
          style={{ boxShadow: '5px 5px 0 var(--color-border)' }}
        >
          Order Sekarang <ArrowRight size={18} strokeWidth={3} />
        </Link>
      </section>

    </div>
  );
}
