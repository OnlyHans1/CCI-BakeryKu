"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, User, ShoppingBag } from "lucide-react"
import { setToken, setUser, isLoggedIn } from "@/lib/auth"
import { API_URL } from "@/lib/api"


export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isLoggedIn()) router.replace("/admin/products")
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!email || !password) {
            setError("Email dan password wajib diisi!")
            return
        }
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Login gagal")
            setToken(data.token)
            setUser(data.user)
            router.push("/admin/products")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login gagal")
        } finally {
            setLoading(false)
        }
    }

    const fillDummy = (type: "admin") => {
        if (type === "admin") { setEmail("admin@admin.com"); setPassword("admin123") }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background flex items-stretch">

            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12 border-r-4 border-border">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="border-4 border-main bg-main p-2">
                            <ShoppingBag size={24} strokeWidth={3} color="black" />
                        </div>
                        <span className="font-base font-black text-2xl text-main">BakeryKu</span>
                    </div>
                    <div>
                        <h1 className="font-base font-black text-5xl text-white leading-tight mb-4">
                            Selamat<br />
                            <span className="text-main">Datang</span><br />
                            Kembali!
                        </h1>
                        <p className="font-base text-white/60 font-medium text-sm leading-relaxed max-w-xs">
                            Masuk ke panel admin untuk mengelola produk, stok, dan operasional toko roti kamu.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {["#FADADD", "#C8F5E3", "#EDE7FF", "var(--color-accent-pink)", "#FADADD", "#C8F5E3"].map((c, i) => (
                        <div key={i} className="h-12 border-3 border-white/20" style={{ background: c }} />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12">
                <div className="w-full max-w-md">

                    <div className="flex items-center gap-2 mb-10 lg:hidden">
                        <div className="border-4 border-border bg-main p-2">
                            <ShoppingBag size={20} strokeWidth={3} />
                        </div>
                        <span className="font-base font-black text-xl">BakeryKu</span>
                    </div>

                    <h2 className="font-base font-black text-3xl sm:text-4xl mb-1">Masuk</h2>
                    <p className="font-base text-foreground/60 font-medium text-sm mb-8">Gunakan akun admin untuk mengakses dashboard</p>

                    <div className="border-4 border-border bg-secondary-background p-4 mb-6 flex flex-col gap-2">
                        <p className="font-base font-bold text-xs uppercase tracking-wider mb-1">Akun Demo</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => fillDummy("admin")}
                                className="flex items-center gap-1.5 border-3 border-border bg-main px-3 py-1.5 font-base font-bold text-xs cursor-pointer hover:bg-[#f5c8cc] transition-colors"
                            >
                                <User size={12} strokeWidth={3} /> Admin
                            </button>
                        </div>
                        <div className="text-xs font-base text-foreground/50 mt-1">
                            <span className="font-semibold text-foreground/70">Admin:</span> admin@admin.com / admin123
                        </div>
                    </div>

                    {error && (
                        <div className="border-4 border-border bg-accent-pink text-white px-4 py-3 mb-5 font-base font-bold text-sm flex items-center gap-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-base font-bold text-sm">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@admin.com"
                                className="border-4 border-border bg-white px-4 py-3 font-base font-medium text-sm w-full outline-none focus:border-accent-pink transition-colors"
                                autoComplete="email"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="font-base font-bold text-sm">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="border-4 border-border bg-white px-4 py-3 pr-12 font-base font-medium text-sm w-full outline-none focus:border-accent-pink transition-colors"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                                >
                                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="border-4 border-border bg-black text-white px-6 py-3 font-base font-black text-base flex items-center justify-center gap-2 cursor-pointer hover:bg-accent-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-shadow hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all duration-150"
                        >
                            <LogIn size={18} strokeWidth={2.5} />
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t-4 border-border">
                        <Link href="/" className="font-base font-bold text-sm hover:underline underline-offset-4 flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors">
                            ← Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
