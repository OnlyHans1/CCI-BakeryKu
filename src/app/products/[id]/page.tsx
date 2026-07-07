import { dummyProduct } from "@/lib/dummy";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/breadcrumbs";
import ImageCard from "@/components/imageCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetailPage({
    params }: {
        params: Promise<{ id: string }>
    }) {
    const { id } = await params
    const product = dummyProduct.find((p) => p.id === Number(id))

    if (!product) return notFound()

    return (
        <main className="flex flex-col gap-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">
                                Home
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/products">
                                Produk
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {product.name}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row gap-8">
                <ImageCard imageUrl={product.image ?? ""} caption={product.name} />
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                    <Badge variant="default">{product.category}</Badge>
                    <h1 className="text-4xl font-heading font-black">{product.name}</h1>
                    <p className="text-2xl font-heading font-bold">
                        Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <p className="font-base text-sm">Stok tersedia: <strong>{product.stock}</strong></p>
                    {product.description && (
                        <p className="font-base">{product.description}</p>
                    )}
                    <Button asChild variant="neutral">
                        <Link href="/products"> <ArrowLeft/> Kembali ke Produk</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}