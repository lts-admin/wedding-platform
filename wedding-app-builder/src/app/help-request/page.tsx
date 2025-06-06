'use client';

import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from '@/components/ui/input';
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";

export default function HelpRequest() {
    const router = useRouter();
    const { user } = useAuth();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [attachment, setAttachment] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(docRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    const fullName = data.name || '';
                    const [firstName, ...lastNameArr] = fullName.split(' ');
                    setForm(prev => ({
                        ...prev,
                        firstName: firstName,
                        lastName: lastNameArr.join(' '),
                        email: data.email || user.email || ''
                    }));
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAttachment(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'helpRequest'), {
                ...form,
                responded: '',
                respondedDate: '',
                timestamp: new Date().toISOString(),
                attachmentName: attachment?.name || '',
            });

            // Optional: upload attachment to Firebase Storage with the docRef.id
            await fetch('/api/send-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'Help Request' }), // or "Help Request", etc.
            });
            setSubmitted(true);
            setForm({ firstName: '', lastName: '', email: '', message: '' });
            setAttachment(null);
            router.push("/app-info");
        } catch (error) {
            console.error('Failed to submit help request:', error);
        }
    };

    return (
        <main className=" bg-[#FFF5F7] text-black font-sans min-h-screen overflow-x-hidden">

            <header className="sticky top-0 z-50  bg-[#FFF5F7] w-full flex justify-between font-bold items-center px-12 py-6 border-b border-pink-500">
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
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm" onClick={() => router.push('/log-in')}>Log in</button>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm">Try it free</button>
                </div>
                {menuOpen && (
                    <div className="absolute top-full left-0 w-full bg-[#0D0208] border-t border-pink-500 py-6 px-6 flex flex-col gap-4 lg:hidden z-50">
                        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
                        <Link href="/contact-us" onClick={() => setMenuOpen(false)}>Contact</Link>
                        <hr className="border-gray-600" />
                        <Link href="#" className="text-sm" onClick={() => setMenuOpen(false)}>Download app</Link>
                        <Link href="/log-in" className="text-sm" onClick={() => setMenuOpen(false)}>Log in</Link>
                        <Button onClick={() => setMenuOpen(false)} className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm mt-2">Try it free</Button>
                    </div>
                )}
            </header>
            <section className="w-full flex justify-center px-6 py-20  bg-[#FFF5F7] text-black">

                <div className="w-full max-w-2xl  bg-[#FFF5F7] p-8 rounded-lg shadow-lg">
                    <h3 className="text-3xl font-serif font-bold mb-2 text-pink-400">Report your issue!</h3>
                    <p className="text-md text-black mb-6">Contact us for assistance.</p>

                    {submitted ? (
                        <div className="bg-green-800 text-green-100 px-4 py-3 rounded-md mb-4">
                            ✅ Your issue has been submitted. A WedDesigner technical admin will reach out to you shortly!
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={form.firstName}
                                    readOnly
                                    required
                                    className="flex-1 bg-[#FFF5F7] border border-pink-500 placeholder:text-black font-bold px-4 py-2 rounded-md"
                                />
                                <Input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={form.lastName}
                                    readOnly
                                    required
                                    className="flex-1 bg-[#FFF5F7] border border-pink-500 placeholder:text-black font-bold px-4 py-2 rounded-md"
                                />
                            </div>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                readOnly
                                required
                                className="w-full bg-[#FFF5F7] border border-pink-500 placeholder:text-black font-bold px-4 py-2 rounded-md"
                            />
                            <textarea
                                name="message"
                                placeholder="Please tell us what your issue is"
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#FFF5F7] border border-pink-500 placeholder-gray-400 text-black px-4 py-2 rounded-md h-32"
                            />
                            <div className="flex gap-4">
                                <Label className="bg-pink-500 hover:bg-pink-400 transition text-white font-bold px-6 py-2 rounded-md">
                                    Attach File
                                    <Input
                                        type="file"
                                        name="attachment"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </Label>
                                <Button
                                    type="submit"
                                    className="bg-pink-500 hover:bg-pink-400 transition text-white font-bold px-6 py-2 rounded-md"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

        </main>
    );
}