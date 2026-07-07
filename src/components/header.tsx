"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"


import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "./navbar"
import { Button } from "./ui/button"

export default function Header() {
    const pathname = usePathname()

    return(
        <header className="border-b-4 border-border bg-background px-6 py-3 flex items-center justify-between">
            <Link href="/" className="font-heading font-bold text-xl">
                Bakery Ku
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/">
                                Home
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/products">
                                Produk
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <Button asChild variant="neutral">
                <Link href="/admin/products">
                    Admin
                </Link>
            </Button>
        </header>
    )
}

