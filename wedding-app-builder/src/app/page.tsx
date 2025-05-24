"use client";

import Image from "next/image";
import Link from "next/link";
import "./globals.css";
export default function HomePage() {
  return (
    <main className="bg-[#0D0208] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden">
      <header className="w-full flex justify-between items-center px-12 py-6">
        <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
          <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
          <a href="/">WedDesigner</a>
        </div>
        <nav className="flex gap-8 text-sm font-bold">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="#">Contact</Link>
        </nav>
        <div className="flex gap-6 items-center font-bold">
          <Link href="#" className="text-sm">Download app</Link>
          {/* <Link href="/app-info" className="text-sm">Log in</Link> */}
          <Link href="/log-in" className="text-sm">Log in</Link>
          <button className="bg-pink-500 text-black px-4 py-2 rounded-md text-sm">Try it free</button>
        </div>
      </header>

      <section className="text-center py-24 px-8">
        <h1 className="text-[64px] md:text-[100px] font-serif font-bold leading-tight mb-12">
          Design the perfect <br /> wedding app
        </h1>
        <div className="relative mx-auto w-[300px] h-[600px] border border-pink-200 rounded-[44px] bg-black overflow-hidden">
          <Image
            src="/mobile-placeholder.png"
            alt="App Preview"
            fill
            className="object-cover rounded-[44px] opacity-70"
          />
          <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-500 text-black px-6 py-3 rounded-md text-lg font-medium">
            Start Designing
          </button>
        </div>
      </section>

      <section className="px-8 py-24 bg-gradient-to-b from-[#0D0208] to-[#1a0a12]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold">Build, test, and deploy with ease.</h2>
            <p className="text-xl text-[#FFFFFF]">Create a personalized wedding app effortlessly.</p>
            <button className="bg-white text-[#281B21] text-lg px-6 py-3 rounded-md font-medium">
              Generate App
            </button>
          </div>
          <Image
            src="/wedding-app-floral.png"
            alt="Wedding App Preview"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      <section className="px-8 py-24 bg-[#0D0208]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Image
            src="/test-on-phone.jpg"
            alt="Test on your phone"
            width={500}
            height={500}
            className="rounded-xl shadow-md"
          />
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold">Test on your phone</h2>
            <p className="text-xl">Download the app and test it instantly.</p>
            <button className="bg-pink-500 text-black text-lg px-6 py-3 rounded-md font-medium">
              Download Now
            </button>
          </div>
        </div>
      </section>

      <section className="px-8 py-24 bg-[#0D0208]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold">Deploy to Apple Store</h2>
            <p className="text-xl">Guided steps for releasing your app.</p>
            <button className="bg-pink-500 text-black text-lg px-6 py-3 rounded-md font-medium">
              Start Deployment
            </button>
          </div>
          <Image
            src="/deploy-apple.jpg"
            alt="Deploy to Apple Store"
            width={500}
            height={500}
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      <footer className="bg-[#0D0208] text-[#E4D7DE] px-12 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-serif font-bold mb-4">Get in Touch</h3>
            <p className="text-lg mb-6">Need help? Contact us for assistance.</p>
            <form className="space-y-4">
              <div className="flex gap-4">
                <input type="text" placeholder="First name" className="w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" />
                <input type="text" placeholder="Last name" className="w-1/2 bg-lightpink text-white px-4 py-2 rounded-md" />
              </div>
              <input type="email" placeholder="Email" className="w-full bg-lightpink text-white px-4 py-2 rounded-md" />
              <textarea placeholder="Message" className="w-full bg-lightpink text-white px-4 py-2 rounded-md h-24" />
              <button type="submit" className="bg-pink-500 text-black px-4 py-2 rounded-md">Submit</button>
            </form>
          </div>
        </div>
      </footer>
    </main>
  );
}
