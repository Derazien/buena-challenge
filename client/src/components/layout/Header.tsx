'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/app/providers';
import Image from 'next/image';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="flex items-center">
                            <Image
                                src={theme === 'dark' ? "/logo-dark.svg" : "/logo.svg"}
                                alt="Buena Logo"
                                width={40}
                                height={40}
                                className="mr-3"
                                priority
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                }}
                            />
                            <span className="font-bold text-xl inline-block text-foreground">Buena</span>
                        </div>
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
                        <Link href="/investments" className="transition-colors hover:text-foreground/80 text-foreground">
                            Investments
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search here if needed */}
                    </div>
                    <nav className="flex items-center space-x-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="mr-3"
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            )}
                        </Button>

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
                        <Link href="/investments" className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground">
                            Investments
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;