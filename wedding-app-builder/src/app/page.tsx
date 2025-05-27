"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // for hamburger icons
import "./globals.css";

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden relative">
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-2xl shadow-lg max-w-md text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Welcome to WedDesigner!</h2>
            <p className="mb-6">Create your dream wedding app in minutes. Let’s get started!</p>
            <button
              className="bg-pink-500 text-black px-6 py-2 rounded font-semibold"
              onClick={() => setShowPopup(false)}
            >
              Let's Go
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 lg:px-12 lg:py-6 border-b border-pink-500 relative z-10">
        <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
          <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
          <Link href="/">WedDesigner</Link>
        </div>

        {/* Hamburger Button for Mobile */}
        <button
          className="lg:hidden text-pink-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8 text-sm font-bold">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="#">Contact</Link>
        </nav>
        <div className="hidden lg:flex gap-6 items-center font-bold">
          <Link href="#" className="text-sm">Download app</Link>
          <Link href="/log-in" className="text-sm">Log in</Link>
          <button className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm">Try it free</button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0D0208] border-t border-pink-500 py-6 px-6 flex flex-col gap-4 lg:hidden z-50">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="#" onClick={() => setMenuOpen(false)}>Contact</Link>
            <hr className="border-gray-600" />
            <Link href="#" className="text-sm" onClick={() => setMenuOpen(false)}>Download app</Link>
            <Link href="/log-in" className="text-sm" onClick={() => setMenuOpen(false)}>Log in</Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm mt-2"
            >
              Try it free
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="text-center py-20 px-6 sm:px-8">
        <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-bold leading-tight mb-12 text-center" style={{ fontFamily: "'Great Vibes', cursive" }}>
          Design your perfect <br /> wedding app
        </h1>


        <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
          <Image
            src="/assets/Image2.png"
            alt="App Preview"
            fill
            className="object-cover rounded-[44px]"
          />
        </div>
        <div className="py-6">
          <button className="py-6 bg-pink-500 text-white px-6 py-3 rounded-md text-lg font-medium">
            Start Designing
          </button>
        </div>

      </section>

      {/* Section 1 */}
      <section className="px-6 sm:px-8 py-24 bg-gradient-to-b from-[#0D0208] to-[#1a0a12]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Build, test, and deploy with ease.</h2>
            <p className="text-lg sm:text-xl text-white">Create a personalized wedding app effortlessly.</p>
            <button className="bg-white text-[#281B21] text-lg px-6 py-3 rounded-md font-medium">
              Generate App
            </button>
          </div>
          <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
            <Image
              src="/assets/itinerary.png"
              alt="Wedding App Preview"
              fill
              className="object-cover rounded-[44px]"
              priority
            />
          </div>

        </div>
      </section>

      {/* Section 2 */}
      <section className="px-6 sm:px-8 py-24 bg-[#0D0208]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] overflow-hidden">
            <Image
              src="/assets/rsvp.png"
              alt="Test on your phone"
              fill
              priority
              className="object-cover rounded-[44px]"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Test on your phone</h2>
            <p className="text-lg sm:text-xl">Download the app and test it instantly.</p>
            <button className="bg-pink-500 text-white text-lg px-6 py-3 rounded-md font-medium">
              Download Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0208] text-[#E4D7DE] px-6 sm:px-8 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl  font-bold mb-4">Get in Touch</h3>
            <p className="text-lg mb-6">Need help? Contact us for assistance.</p>
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="First name" className="w-full sm:w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" />
                <input type="text" placeholder="Last name" className="w-full sm:w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" />
              </div>
              <input type="email" placeholder="Email" className="w-full bg-lightpink text-white px-4 py-2 rounded-md" />
              <textarea placeholder="Message" className="w-full bg-lightpink text-white px-4 py-2 rounded-md h-24" />
              <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded-md">Submit</button>
            </form>
          </div>
        </div>
      </footer>
    </main>
  );
}
