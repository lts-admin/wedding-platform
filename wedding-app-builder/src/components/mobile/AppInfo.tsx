"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SaveTheDate from "@/components/mobile/SaveTheDate";
import RSVPAndGallery from "@/components/mobile/RSVPAndGallery";
import OurFamily from "@/components/mobile/OurFamily";
import WeddingParty from "@/components/mobile/WeddingParty";
import Itinerary from "@/components/mobile/Itinerary";
import Travel from "@/components/mobile/Travel";
import Settings from "@/components/mobile/Settings";
import Preview from "@/components/mobile/Preview";
import Themes from "@/components/mobile/Themes";
import { FormState } from "@/types/FormState";
import { useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { saveFormToFirestore } from "@/lib/saveFormToFirestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Registry from "./Registry";
import CalendarPage from "@/components/utilities/Calendar";

export default function Home() {
    const [step, setStep] = useState(0);
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        brideName: "",
        groomName: "",
        weddingDate: "",
        weddingLocation: "",
        appName: "",
        enableRSVP: true,
        rsvpSheetUrl: "",
        enableGallery: false,
        galleryDriveUrl: "",
        enableFamily: false,
        enableStory: false,
        familyDetails: { bride: [], groom: [], pets: [] },
        enableItinerary: true,
        enableSaveDate: true,
        itineraryWedding: "",
        itineraryBride: "",
        itineraryGroom: "",
        enableSettings: true,
        enableTravel: false,
        faqs: [],
        contactInfo: [],
        enableWeddingParty: false,
        weddingParty: { bride: [], groom: [] },
        weddingEvents: [],
        brideEvents: [],
        groomEvents: [],
        enablePassword: false,
        storyImages: [],
        storyParagraphs: [],
        saveTheDateImage: null,
        enableCountdown: true,
        isHomeScreen: true,
        showRSVPButton: true,
        enableRegistry: false,
        isSubmitted: false,
        enableAdminPassword: false,
        selectedFont: "Serif",
        selectedColor: "",
        selectedFontColor: "",
        enableRSVPNotification: false,
        enableEventNotification: false,
        enablePlannerUpdates: false,
        backgroundImage: "",
        registries: [],
        hotelDetails: [],
        venueDetails: []
    });

    useEffect(() => {
        const fetchSavedForm = async () => {
            if (!user) return;
            try {
                const appRef = doc(db, "weddingApps", user.uid);
                const appSnap = await getDoc(appRef);
                if (appSnap.exists()) {
                    const data = appSnap.data();
                    setForm(prev => ({ ...prev, ...data }));
                    if (data?.zipGenerated || data.isSubmitted) setIsSubmitted(true);
                }

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const createdAt = userData.createdAt?.toDate?.() || new Date(userData.createdAt);
                    const today = new Date();
                    if (
                        createdAt.getFullYear() === today.getFullYear() &&
                        createdAt.getMonth() === today.getMonth() &&
                        createdAt.getDate() === today.getDate() &&
                        !userData.watchedTutorial
                    ) {
                        // Show tutorial logic can go here
                    }
                }
            } catch (err) {
                console.error("Failed to load form or user data:", err);
            }
        };

        fetchSavedForm();
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const shouldSave = () => form.brideName || form.groomName || form.weddingDate || form.appName;
        const interval = setInterval(() => {
            if (shouldSave() && !form.isSubmitted) {
                saveFormToFirestore(user, form).catch(console.error);
            }
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, form]);

    const handleChange = (field: keyof FormState, value: any) => {
        if (!isSubmitted) setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleLogout = async () => {
        if (user) await saveFormToFirestore(user, form);
        router.push("/");
        await signOut(auth);
    };

    const goNext = () => setStep(prev => Math.min(prev + 1, sidebarItems.length - 1));
    const goBack = () => setStep(prev => Math.max(prev - 1, 0));

    const handleToggle = (field: keyof FormState) => {
        if (isSubmitted) return;
        setForm(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const sidebarItems = useMemo(() => [
        { label: "Getting Started", key: "appInfo" },
        { label: "App Home Page", key: "saveDate", condition: form.enableSaveDate },
        { label: "Gallery", key: "rsvpGallery", condition: form.enableGallery },
        { label: "Wedding Party", key: "weddingParty", condition: form.enableWeddingParty || form.enableFamily },
        { label: "Itinerary", key: "itinerary", condition: form.enableItinerary },
        { label: "Registry", key: "registry", condition: form.enableRegistry },
        { label: "Travel", key: "travel", condition: form.enableTravel },
        { label: "Settings", key: "settings", condition: form.enableSettings },
        { label: "App Themes", key: "themes" },
        { label: "Preview", key: "preview" }
    ].filter(item => item.condition !== false), [form]);

    return (
        <main className="min-h-screen bg-[#FFF5F7] text-[#4B2E2E] flex">
            <aside className={`w-64 h-screen bg-[#fdf6f1] border-r border-gray-300 p-4 hidden lg:block`}>
                <h1 className="text-xl font-bold text-pink-500 mb-6">My WedDesigner</h1>
                <div className="space-y-2">
                    {sidebarItems.map((item, idx) => (
                        <Button
                            key={item.key}
                            variant={step === idx ? "default" : "ghost"}
                            onClick={() => setStep(idx)}
                            className={`w-full justify-start text-sm ${step === idx ? "bg-purple-500 text-white" : "hover:text-pink-400"}`}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </aside>

            <section className="flex-1 px-4 sm:px-6 md:px-8 pt-10">
                {sidebarItems[step]?.key === "appInfo" && (
                    <div>
                        <h2 className="text-2xl font-semibold text-pink-400 pb-6">Wedding Details</h2>
                        <Label>Bride's Name</Label>
                        <Input value={form.brideName} onChange={(e) => handleChange("brideName", e.target.value)} />
                        <Label>Groom's Name</Label>
                        <Input value={form.groomName} onChange={(e) => handleChange("groomName", e.target.value)} />
                        <Label>App Name</Label>
                        <Input value={form.appName} onChange={(e) => handleChange("appName", e.target.value)} />
                        <CalendarPage form={form} setForm={setForm} />
                    </div>
                )}

                {sidebarItems[step]?.key === "saveDate" && (
                    <SaveTheDate setForm={setForm} handleChange={handleChange} goNext={goNext} goBack={goBack} form={form} />
                )}

                {sidebarItems[step]?.key === "rsvpGallery" && (
                    <RSVPAndGallery form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "weddingParty" && (
                    <WeddingParty form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "itinerary" && (
                    <Itinerary form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "registry" && (
                    <Registry form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "travel" && (
                    <Travel form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "settings" && (
                    <Settings form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "themes" && (
                    <Themes form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "preview" && (
                    <Preview form={form} goBack={goBack} />
                )}
            </section>
        </main>
    );
}
