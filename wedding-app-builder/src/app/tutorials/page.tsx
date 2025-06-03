"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const tutorialVideos = [
    "/tutorials/Tutorial1.mp4",
    // "/tutorials/Tutorial2.mp4",
    // "/tutorials/Tutorial3.mp4",
    // "/tutorials/Tutorial4.mp4",
];

export default function TutorialPage() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
    const handleNext = () => setIndex((prev) => Math.min(prev + 1, tutorialVideos.length - 1));
    const handleSelect = (idx: number) => setIndex(idx);

    return (
        <main className="bg-[#FFF5F7] text-[#E4D7DE] font-sans min-h-screen overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-[#FFF5F7] w-full flex justify-between font-bold items-center px-12 py-6 border-b border-pink-500">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
                <Button className="text-white border-1px bg-pink-500 font-bold" onClick={() => router.push('/app-info')}>Back To My Wedding Details</Button>
            </header>
            <div className="py-10 flex justify-center bg-[#FFF5F7]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-black max-w-5xl w-full p-6 space-y-6"
                >
                    <h2 className="text-center text-3xl font-bold text-black">Browse Examples</h2>

                    <video
                        controls
                        key={tutorialVideos[index]}
                        className=" w-full max-h-[800px] object-contain"
                        style={{ aspectRatio: '16/9' }}
                        src={tutorialVideos[index]}
                    />

                    <div className="flex justify-center items-center gap-4 pt-4">
                        {/* <Button size="icon" onClick={handlePrev} disabled={index === 0}>
                            <ChevronLeft />
                        </Button> */}

                        <div className="flex gap-3">
                            {tutorialVideos.map((_, i) => (
                                <button
                                    key={i}
                                    className={`w-4 h-4 rounded-full border-2 transition-all ${i === index ? "bg-black border-black" : "border-black"
                                        }`}
                                    onClick={() => handleSelect(i)}
                                />
                            ))}
                        </div>
                        {/* 
                        <Button size="icon" onClick={handleNext} disabled={index === tutorialVideos.length - 1}>
                            <ChevronRight />
                        </Button> */}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
