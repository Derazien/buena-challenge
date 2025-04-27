'use client';
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-buena-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-buena-primary font-bold text-2xl">
                            Buena
                        </Link>

                        <nav className="hidden md:flex ml-8 space-x-6">
                            <Link href="/" className="text-buena-dark hover:text-buena-primary text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link href="/properties" className="text-buena-muted hover:text-buena-primary text-sm font-medium">
                                Properties
                            </Link>
                            <Link href="/tickets" className="text-buena-muted hover:text-buena-primary text-sm font-medium">
                                Tickets
                            </Link>
                            <Link href="/reinvest" className="text-buena-muted hover:text-buena-primary text-sm font-medium">
                                Invest
                            </Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-buena-muted hover:text-buena-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>

                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-buena-primary text-white flex items-center justify-center font-medium">
                                PO
                            </div>
                            <span className="ml-2 text-sm font-medium text-buena-dark">Property Owner</span>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-buena-muted"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pb-2 space-y-4">
                        <Link href="/" className="block text-buena-dark hover:text-buena-primary font-medium">
                            Dashboard
                        </Link>
                        <Link href="/properties" className="block text-buena-muted hover:text-buena-primary">
                            Properties
                        </Link>
                        <Link href="/tickets" className="block text-buena-muted hover:text-buena-primary">
                            Tickets
                        </Link>
                        <Link href="/reinvest" className="block text-buena-muted hover:text-buena-primary">
                            Invest
                        </Link>

                        <div className="pt-4 border-t border-buena-border flex items-center">
                            <div className="h-8 w-8 rounded-full bg-buena-primary text-white flex items-center justify-center font-medium">
                                PO
                            </div>
                            <span className="ml-2 text-sm font-medium text-buena-dark">Property Owner</span>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;