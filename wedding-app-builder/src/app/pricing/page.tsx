"use client";

import React from "react";
import Link from "next/link";

export default function PricingPage() {
    const tiers = [
        {
            name: "Basic",
            price: "$20/month",
            downPayment: "$75 one-time",
            features: [
                "1 App Revision",
                "ZIP Download Only",
                "No Website",
                "Support within 48 hours",
                "Shutdown 30 days after wedding"
            ],
            website: "Optional (+$7/month)",
            subdomain: "Not included"
        },
        {
            name: "Standard",
            price: "$25/month",
            downPayment: "$125 one-time",
            features: [
                "2 App/Site Revisions",
                "ZIP + Test Build",
                "Website Included",
                "Support within 24 hours",
                "Shutdown 60 days after wedding"
            ],
            website: "Included",
            subdomain: "Custom subdomain (e.g. couple.weddingapps.com)"
        },
        {
            name: "Premium",
            price: "$35/month",
            downPayment: "$250+ one-time",
            features: [
                "Unlimited Revisions",
                "App Store Deployment",
                "Custom Domain or Subdomain",
                "Support within 12 hours",
                "Shutdown 90+ days after wedding"
            ],
            website: "Included",
            subdomain: "Custom subdomain or domain"
        }
    ];

    return (
        <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden">
            <header className="w-full flex justify-between items-center px-12 py-6">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
                <nav className="flex gap-8 text-sm">
                    <Link href="/">Home</Link>
                    <Link href="/features">Features</Link>
                    {/* <Link href="/pricing">Pricing</Link> */}
                    <Link href="#">Contact</Link>
                </nav>
                <div className="flex gap-6 items-center">
                    <Link href="#" className="text-sm">Download app</Link>
                    <Link href="/app-info" className="text-sm">Log in</Link>
                    <button className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm">Try it free</button>
                </div>
            </header>

            <section className="w-full px-6 py-20 bg-[#0D0208] text-[#E4D7DE]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-center mb-16">
                        Pricing Plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {tiers.map((tier) => (
                            <div key={tier.name} className="border border-[#FF69B4] rounded-xl p-8 bg-[#1A1A1A]">
                                <h3 className="text-3xl font-semibold text-[#FF69B4] mb-2">{tier.name}</h3>
                                <p className="text-xl mb-1">{tier.price}</p>
                                <p className="text-sm mb-4 italic">{tier.downPayment}</p>
                                <ul className="mb-4 space-y-2 text-sm">
                                    {tier.features.map((feature, i) => (
                                        <li key={i}>• {feature}</li>
                                    ))}
                                </ul>
                                <p className="text-sm">Website: <span className="font-medium">{tier.website}</span></p>
                                <p className="text-sm">Subdomain: <span className="font-medium">{tier.subdomain}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
