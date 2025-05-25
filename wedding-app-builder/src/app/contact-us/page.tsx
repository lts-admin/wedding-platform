'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Link from 'next/link';

export default function ContactUsPage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'contactRequests'), {
                ...form,
                timestamp: new Date().toISOString(),
            });
            setSubmitted(true);
            setForm({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error('Failed to submit contact request:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#140A0A] text-white px-6 py-12 flex justify-center items-start">
            <header className="absolute top-6 left-6">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
            </header>
            <div className="w-full max-w-2xl">
                <h3 className="text-3xl font-serif font-bold mb-4">Get in Touch</h3>
                <p className="text-lg mb-6">Need help? Contact us for assistance.</p>

                {submitted ? (
                    <p className="text-green-400 font-medium">Your message has been sent. Thank you!</p>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                className="w-1/2 bg-[#3A1A1A] text-white px-4 py-2 rounded-md"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                className="w-1/2 bg-[#3A1A1A] text-white px-4 py-2 rounded-md"
                            />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#3A1A1A] text-white px-4 py-2 rounded-md"
                        />
                        <textarea
                            name="message"
                            placeholder="Message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#3A1A1A] text-white px-4 py-2 rounded-md h-24"
                        />
                        <button
                            type="submit"
                            className="bg-pink-500 text-black px-4 py-2 rounded-md"
                        >
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
