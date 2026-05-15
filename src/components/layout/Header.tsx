"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface MenuItem {
    key: string;
    label: string;
    href?: string;
}

interface HeaderProps {
    brandName?: string;
    menuItems?: MenuItem[];
    onBrandClick?: () => void;
}

export default function Header({
    brandName = "MyBrand",
    menuItems = [
        { key: "home", label: "Home", href: "/" },
        { key: "about", label: "About", href: "/about" },
        { key: "contact", label: "Contact", href: "/contact" }
    ],
    onBrandClick
}: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-blue-600 shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Brand Logo - Triggers Sidebar */}
                    <button
                        onClick={onBrandClick}
                        className="text-white text-2xl font-bold hover:text-blue-100 transition focus:outline-none"
                    >
                        {brandName}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-8">
                            {menuItems.map((item) => (
                                <li key={item.key}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="text-white hover:text-blue-200 transition font-medium"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white hover:text-blue-200 cursor-pointer transition">
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white hover:text-blue-200 transition p-2"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.key}>
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className="block text-white hover:bg-blue-700 px-4 py-2 rounded transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="block text-white hover:bg-blue-700 px-4 py-2 rounded transition">
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}