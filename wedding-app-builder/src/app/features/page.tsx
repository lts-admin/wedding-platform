"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function FeaturesSection() {
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-[#0D0208] w-full flex justify-between font-bold items-center px-12 py-6 border-b border-pink-500">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
                <Button className="lg:hidden text-pink-400" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </Button>
                <nav className="hidden lg:flex gap-8 text-sm font-bold">
                    <Link href="/">Home</Link>
                    <Link href="/features">Features</Link>
                    <Link href="/contact-us">Contact</Link>
                </nav>
                <div className="hidden lg:flex gap-6 items-center font-bold">
                    {/* <Link href="#" className="text-sm">Download app</Link> */}
                    <button
                        className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm"
                        onClick={() => router.push('/log-in')}
                    >Log in</button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm">Try it free</button>
                </div>
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-[#0D0208] border-t border-pink-500 py-6 px-6 flex flex-col gap-4 lg:hidden z-50">
                        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
                        {/* <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link> */}
                        <Link href="/contact-us" onClick={() => setMenuOpen(false)}>Contact</Link>
                        <hr className="border-gray-600" />
                        <Link href="#" className="text-sm" onClick={() => setMenuOpen(false)}>Download app</Link>
                        <Link href="/log-in" className="text-sm" onClick={() => setMenuOpen(false)}>Log in</Link>
                        <Button onClick={() => setMenuOpen(false)} className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm mt-2">Try it free</Button>
                    </div>
                )}
            </header>

            <section className="w-full px-6 py-20 bg-[#0D0208] text-[#E4D7DE]">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-16" style={{ fontFamily: "'Great Vibes', cursive" }}>Features You’ll Love</h2>
                    <div className="grid gap-16 md:grid-cols-2">
                        <motion.div
                            className="flex flex-col items-center text-left"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative mx-auto w-[300px] h-[600px] rounded-[44px] overflow-hidden mb-6 bg-black">
                                <Image
                                    src="/assets/customize.png"
                                    alt="Build and Customize"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-semibold text-pink-400 mb-2">Build and Customize</h3>
                            <p className="text-sm text-[#E4D7DE] max-w-xs text-center">
                                Design your wedding app with simplicity. Choose fonts, colors, and layouts.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center text-left"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            {/* <div
                                className="relative mx-auto w-[300px] h-[600px] rounded-[44px] overflow-hidden mb-6 bg-black cursor-pointer"
                                onClick={() => setModalOpen(true)}
                            > */}
                            <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden" onClick={() => setModalOpen(true)}>

                                <Image
                                    src="/assets/preview.png"
                                    alt="Real-Time Preview"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-semibold text-pink-400 mb-2 pt-6">Live Preview</h3>
                            <p className="text-sm text-[#E4D7DE] max-w-xs text-center">
                                See your app live in an iPhone frame while you design it.
                            </p>
                        </motion.div>

                        {/* Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                                {/* Close button */}
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="absolute top-6 right-6 text-white text-3xl font-bold z-50 hover:text-pink-400 transition"
                                    aria-label="Close"
                                >
                                    &times;
                                </button>

                                <div className="relative w-full max-w-3xl h-[80vh]">
                                    <Image
                                        src="/assets/preview.png"
                                        alt="Expanded Preview"
                                        fill
                                        className="object-contain rounded-xl"
                                    />
                                </div>
                            </div>
                        )}

                        <motion.div
                            className="flex flex-col items-center text-left"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
                                <Image
                                    src="/assets/notify.png"
                                    alt="Enable Notifications with Ease"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-semibold text-pink-400 mb-2">Simplify Notifications </h3>
                            <p className="text-sm text-[#E4D7DE] max-w-xs text-center">
                                Real-time updates, real-time satisfaction.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center text-left"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
                                <Image
                                    src="/features/website.png"
                                    alt="Share a Wedding Website"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <h3 className="text-2xl font-semibold text-pink-400 mb-2">Wedding Website</h3>
                            <p className="text-sm text-[#E4D7DE] max-w-xs text-center">
                                Generate a matching website with RSVP, gallery, and event details.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
