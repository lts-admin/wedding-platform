"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import "./globals.css";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

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
    <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden relative">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 lg:px-12 lg:py-6 border-b border-pink-500 relative z-10">
        <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
          <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
          <Link href="/">WedDesigner</Link>
        </div>

        <button className="lg:hidden text-pink-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="hidden lg:flex gap-8 text-sm font-bold">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/contact-us">Contact</Link>
        </nav>
        <div className="hidden lg:flex gap-6 items-center font-bold">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm" onClick={() => router.push('/log-in')}>Log in</button>
          <Link href="/app-info" className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm">Try it free</Link>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0D0208] border-t border-pink-500 py-6 px-6 flex flex-col gap-4 lg:hidden z-50">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="#" onClick={() => setMenuOpen(false)}>Contact</Link>
            <hr className="border-gray-600" />
            <Link href="#" className="text-sm" onClick={() => setMenuOpen(false)}>Download app</Link>
            <Link href="/log-in" className="text-sm" onClick={() => setMenuOpen(false)}>Log in</Link>
            <button onClick={() => setMenuOpen(false)} className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm mt-2">Try it free</button>
          </div>
        )}
      </header>

      <section className="text-center py-20 px-6 sm:px-8">
        <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-bold leading-tight mb-12 text-center" style={{ fontFamily: "'Great Vibes', cursive" }}>
          Design your perfect <br /> wedding app
        </h1>
        <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
          <Image src="/assets/Image2.png" alt="App Preview" fill className="object-cover rounded-[44px]" />
        </div>
        <div className="py-6">
          <button className="py-6 bg-pink-500 text-white px-6 py-3 rounded-md text-lg font-medium" onClick={() => router.push("/log-in")}>Start Designing</button>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-24 bg-gradient-to-b from-[#0D0208] to-[#1a0a12]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Build, test, and deploy with ease.</h2>
            <p className="text-lg sm:text-xl text-white">Create a personalized wedding app effortlessly.</p>
            <button className="bg-white text-[#281B21] text-lg px-6 py-3 rounded-md font-medium">Generate App</button>
          </div>
          <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
            <Image src="/assets/itinerary.png" alt="Wedding App Preview" fill className="object-cover rounded-[44px]" priority />
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-8 py-24 bg-[#0D0208]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
            <Image src="/assets/rsvp.png" alt="Test on your phone" fill priority className="object-cover rounded-[44px]" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Test on your phone</h2>
            <p className="text-lg sm:text-xl">Download the app and test it instantly.</p>
            <Button onClick={() => router.push('/log-in')} className="bg-pink-500 text-white text-lg px-6 py-3 rounded-md font-medium">Try Now</Button>
          </div>
        </div>
      </section>

      <footer className="bg-[#0D0208] text-[#E4D7DE] px-6 sm:px-8 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl  font-bold mb-4">Get in Touch</h3>
            <p className="text-lg mb-6">Need help? Contact us for assistance.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="First name" className="w-full sm:w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                <input type="text" placeholder="Last name" className="w-full sm:w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
              <input type="email" placeholder="Email" className="w-full bg-lightpink text-white px-4 py-2 rounded-md" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <textarea placeholder="Message" className="w-full bg-lightpink text-white px-4 py-2 rounded-md h-24" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-md">Submit</button>
              {submitted && <p className="text-green-400 pt-2">Thanks! We'll be in touch shortly.</p>}
            </form>
          </div>
        </div>
      </footer>
    </main>
  );
}
