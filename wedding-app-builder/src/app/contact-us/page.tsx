'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'contactRequests'), {
                ...form,
                responded: '',
                respondedDate: '',
                timestamp: new Date().toISOString(),
            });
            setSubmitted(true);
            setForm({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error('Failed to submit contact request:', error);
        }
    };

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
            <section className="w-full flex justify-center px-6 py-20 bg-[#0D0208] text-[#E4D7DE]">

                <div className="w-full max-w-2xl bg-[#1C0E0E] p-8 rounded-lg shadow-lg">
                    <h3 className="text-3xl font-serif font-bold mb-2 text-pink-400">Get in Touch</h3>
                    <p className="text-md text-gray-200 mb-6">Need help? Contact us for assistance.</p>

                    {submitted ? (
                        <div className="bg-green-800 text-green-100 px-4 py-3 rounded-md mb-4">
                            ✅ Your message has been sent. Thank you!
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 bg-[#3A1A1A] placeholder-gray-400 text-white px-4 py-2 rounded-md"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    className="flex-1 bg-[#3A1A1A] placeholder-gray-400 text-white px-4 py-2 rounded-md"
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#3A1A1A] placeholder-gray-400 text-white px-4 py-2 rounded-md"
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#3A1A1A] placeholder-gray-400 text-white px-4 py-2 rounded-md h-32"
                            />
                            <button
                                type="submit"
                                className="bg-pink-500 hover:bg-pink-400 transition text-black font-bold px-6 py-2 rounded-md"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </section>

        </main>
    );
}
