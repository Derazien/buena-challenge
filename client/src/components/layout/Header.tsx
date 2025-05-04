'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold inline-block text-foreground">Buena</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
                            Dashboard
                        </Link>
                        <Link href="/properties" className="transition-colors hover:text-foreground/80 text-foreground">
                            Properties
                        </Link>
                        <Link href="/tickets" className="transition-colors hover:text-foreground/80 text-foreground">
                            Tickets
                        </Link>
                        <Link href="/portfolio" className="transition-colors hover:text-foreground/80 text-foreground">
                            Re-Investment
                        </Link>
                        <Link href="/reinvest" className="transition-colors hover:text-foreground/80 text-foreground">
                            Invest
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search here if needed */}
                    </div>
                    <nav className="flex items-center">
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                                PO
                            </div>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={cn(
                "fixed inset-0 top-14 z-50 w-full md:hidden",
                isMenuOpen ? "block" : "hidden"
            )}>
                <div className="border-t border-border bg-background p-4 space-y-4">
                    <nav className="space-y-2">
                        <Link href="/" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Dashboard
                        </Link>
                        <Link href="/properties" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Properties
                        </Link>
                        <Link href="/tickets" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Tickets
                        </Link>
                        <Link href="/portfolio" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Re-Investment
                        </Link>
                        <Link href="/reinvest" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Invest
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;