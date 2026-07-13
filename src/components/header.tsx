"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { LayoutDashboard, Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react"
import { getUser, removeToken, isLoggedIn, AuthUser } from "@/lib/auth"

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [user, setUser] = useState<AuthUser | null>(null)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        setUser(isLoggedIn() ? getUser() : null)
    }, [pathname])

    const handleLogout = () => {
        removeToken()
        setUser(null)
        setUserMenuOpen(false)
        setMobileOpen(false)
        router.push("/")
    }

    const navLinks = [
        { href: "/", label: "Home", active: pathname === "/" },
        { href: "/products", label: "Produk", active: pathname.startsWith("/products") },
    ]

    return (
        <>
            <header
                className="sticky top-0 z-50 border-b-4 border-border bg-main px-4 sm:px-6 py-3 flex items-center justify-between relative"
                style={{ boxShadow: "0px 4px 0px 0px var(--color-border)" }}
            >

                <Link href="/" className="font-base font-black text-xl sm:text-2xl tracking-tight shrink-0">
                    BakeryKu
                </Link>

                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`font-base font-bold text-sm px-4 py-1.5 border-4 border-transparent hover:border-border hover:bg-white transition-all duration-150 cursor-pointer ${link.active ? "border-border bg-black text-white" : ""
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2 shrink-0">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 border-4 border-border bg-black text-white px-3 py-1.5 font-base font-bold text-sm cursor-pointer hover:bg-accent-pink transition-colors"
                            >
                                <LayoutDashboard size={14} strokeWidth={2.5} />
                                {user.name}
                                <ChevronDown
                                    size={12}
                                    strokeWidth={3}
                                    className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                                />
                            </button>
                            {userMenuOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 border-4 border-border bg-white z-50 min-w-[160px]"
                                    style={{ boxShadow: "4px 4px 0 var(--color-border)" }}
                                >
                                    <Link
                                        href="/admin/products"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-3 font-base font-bold text-sm border-b-2 border-border hover:bg-main transition-colors"
                                    >
                                        <LayoutDashboard size={14} /> Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-2 px-4 py-3 font-base font-bold text-sm hover:bg-accent-pink hover:text-white transition-colors cursor-pointer"
                                    >
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 border-4 border-border bg-black text-white px-4 py-1.5 font-base font-bold text-sm cursor-pointer hover:bg-accent-pink transition-colors"
                        >
                            <LogIn size={14} strokeWidth={2.5} /> Login
                        </Link>
                    )}
                </div>

                <button
                    className="md:hidden border-4 border-border bg-black text-white p-1.5 cursor-pointer"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
                </button>
            </header>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
                    <div className="absolute inset-0 bg-black/50" />
                    <div
                        className="absolute top-[61px] left-0 right-0 border-b-4 border-border bg-main flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`border-b-2 border-border px-6 py-4 font-base font-black text-lg hover:bg-accent-blue transition-colors cursor-pointer ${link.active ? "bg-black text-main" : ""
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link
                                    href="/admin/products"
                                    onClick={() => setMobileOpen(false)}
                                    className="border-b-2 border-border px-6 py-4 font-base font-black text-lg flex items-center gap-2 hover:bg-accent-lavender transition-colors cursor-pointer"
                                >
                                    <LayoutDashboard size={18} strokeWidth={2.5} /> Dashboard ({user.name})
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-4 font-base font-black text-lg flex items-center gap-2 hover:bg-accent-pink hover:text-white transition-colors cursor-pointer text-left w-full border-b-2 border-border"
                                >
                                    <LogOut size={18} strokeWidth={2.5} /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="px-6 py-4 font-base font-black text-lg flex items-center gap-2 hover:bg-accent-pink hover:text-white transition-colors cursor-pointer"
                            >
                                <LogIn size={18} strokeWidth={2.5} /> Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
