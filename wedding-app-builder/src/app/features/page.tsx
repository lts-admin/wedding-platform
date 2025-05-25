"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeaturesSection() {
    const features = [
        {
            title: "Build and Customize",
            description: "Design your wedding app with drag-and-drop simplicity. Choose fonts, colors, and layouts.",
            image: "/features/customize.png"
        },
        {
            title: "Real-Time Preview",
            description: "See your app live in an iPhone frame while you design it.",
            image: "/features/preview-iphone.gif"
        },
        {
            title: "Deploy with One Click",
            description: "Push your app to the App Store or Play Store with our guided deployment tools.",
            image: "/features/deploy.png"
        },
        {
            title: "Share a Wedding Website",
            description: "Generate a matching website with RSVP, gallery, and event details.",
            image: "/features/website.png"
        }
    ];

    return (
        <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-[#0D0208] w-full flex justify-between items-center px-12 py-6 border-b border-pink-500">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
                <nav className="flex gap-8 text-sm">
                    <Link href="/">Home</Link>
                    <Link href="/features">Features</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="#">Contact</Link>
                </nav>
                <div className="flex gap-6 items-center">
                    <Link href="#" className="text-sm">Download app</Link>
                    <Link href="/app-info" className="text-sm">Log in</Link>
                    <button className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm">Try it free</button>
                </div>
            </header>

            <section className="w-full px-6 py-20 bg-[#0D0208] text-[#E4D7DE]">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-16">Features You’ll Love</h2>
                    <div className="grid gap-16 md:grid-cols-2">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center text-left"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-[280px] h-[560px] relative mb-6">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover rounded-[36px] border border-pink-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-semibold text-pink-400 mb-2">{feature.title}</h3>
                                <p className="text-sm text-[#E4D7DE] max-w-xs">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
