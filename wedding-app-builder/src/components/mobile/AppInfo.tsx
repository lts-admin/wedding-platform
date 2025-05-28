"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SaveTheDate from "@/components/mobile/SaveTheDate";
import OurStory from "@/components/mobile/OurStory";
import RSVPAndGallery from "@/components/mobile/RSVPAndGallery";
import OurFamily from "@/components/mobile/OurFamily";
import WeddingParty from "@/components/mobile/WeddingParty";
import Itinerary from "@/components/mobile/Itinerary";
import Travel from "@/components/mobile/Travel";
import Settings from "@/components/mobile/Settings";
import Preview from "@/components/mobile/Preview";
import Themes from "@/components/mobile/Themes";
import Notifications from "@/components/mobile/Notifications";
import { FormState } from "@/types/FormState";
import { useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { saveFormToFirestore } from "@/lib/saveFormToFirestore";
import { doc, getDoc } from "firebase/firestore";

const CustomSwitch = ({ checked, onToggle, disabled = false }: { checked: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 ${checked ? "bg-pink-400" : "bg-gray-200"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
        <span
            className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
    </button>
);

export default function Home() {
    const [step, setStep] = useState(0);
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [form, setForm] = useState<FormState>({
        coupleName: "",
        weddingDate: "",
        weddingLocation: "",
        enableRSVP: true,
        rsvpSheetUrl: "",
        enableGallery: true,
        galleryDriveUrl: "",
        enableFamily: true,
        enableStory: true,
        familyDetails: { bride: [], groom: [], pets: [] },
        enableItinerary: true,
        enableSaveDate: true,
        itineraryWedding: "",
        itineraryBride: "",
        itineraryGroom: "",
        enableSettings: true,
        enableTravel: true,
        faqs: [],
        contactInfo: [],
        enableWeddingParty: true,
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
        enableRegistry: true,
        isSubmitted: false,
        enableAdminPassword: false,
        selectedFont: "Serif",
        selectedColor: "",
        selectedLayout: "",
        enableRSVPNotification: true,
        enableEventNotification: true,
        enablePlannerUpdates: true,
    });

    useEffect(() => {
        const fetchSavedForm = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "weddingApps", user.uid);
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setForm(prev => ({ ...prev, ...data }));
                    if (data?.zipGenerated || data.isSubmitted) setIsSubmitted(true);
                }
            } catch (err) {
                console.error("Failed to load form:", err);
            }
        };
        fetchSavedForm();
    }, [user]);

    const screenToggles: { label: string; field: keyof FormState }[] = [
        { label: "Save The Date", field: "enableSaveDate" },
        { label: "Our Story", field: "enableStory" },
        { label: "RSVP", field: "enableRSVP" },
        { label: "Gallery", field: "enableGallery" },
        { label: "Our Family", field: "enableFamily" },
        { label: "Wedding Party", field: "enableWeddingParty" },
        { label: "Wedding Itinerary", field: "enableItinerary" },
        { label: "Travel", field: "enableTravel" },
        { label: "Settings (FAQs)", field: "enableSettings" }
    ];

    const sidebarItems = useMemo(() => [
        { label: "Couple Details", key: "appInfo" },
        { label: "Save the Date", key: "saveDate", condition: form.enableSaveDate },
        { label: "Our Story", key: "ourStory", condition: form.enableStory },
        { label: "RSVP & Gallery", key: "rsvpGallery", condition: form.enableRSVP || form.enableGallery },
        { label: "Our Family", key: "ourFamily", condition: form.enableFamily },
        { label: "Wedding Party", key: "weddingParty", condition: form.enableWeddingParty },
        { label: "Itinerary", key: "itinerary", condition: form.enableItinerary },
        { label: "Travel", key: "travel", condition: form.enableTravel },
        { label: "Settings", key: "settings", condition: form.enableSettings },
        { label: "Notifications", key: "notification" },
        { label: "App Themes", key: "themes" },
        { label: "Preview", key: "preview" },
    ].filter(item => item.condition !== false), [form]);

    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            saveFormToFirestore(user, form).catch(console.error);
        }, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, form]);

    const handleChange = (field: string, value: string | boolean) => {
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

    return (
        <main className="min-h-screen bg-[#FFF5F7] text-[#4B2E2E] flex flex-col lg:flex-row">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 fixed top-3 left-3 z-50 bg-pink-500 rounded-md text-black shadow-md"
            >
                {sidebarOpen ? <X size={16} /> : <Menu size={20} />}
            </button>


            <aside className={`fixed z-40 lg:static top-0 left-0 bg-beige text-[#F5EAF3] w-64 h-screen transform transition-transform duration-300 ease-in-out border-r border-gray-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>


                <div className="p-4 space-y-4 flex flex-col h-full">
                    <h1 className="text-xl font-bold text-pink-500">My WedDesigner</h1>
                    <div className="space-y-2">
                        {sidebarItems.map((item, idx) => (
                            <Button
                                key={item.key}
                                variant={step === idx ? "default" : "ghost"}
                                onClick={() => setStep(idx)}
                                className={`w-full justify-start text-black ${step === idx ? "bg-purple-500 text-white font-semibold" : "font-semibold hover:text-pink-400"}`}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="text-black border border-gray-500 hover:bg-gray-100 text-sm font-bold"
                            onClick={() => {
                                setSidebarOpen(false);
                                router.push("/designer-settings");
                            }}
                        >
                            <User size={16} className="mr-2" /> Account
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="bg-pink-400 text-black px-4 py-2 font-bold text-sm"
                        >
                            Log Out
                        </Button>
                        <div className="py-6"></div>
                        <Button
                            variant="outline"
                            className="text-black border border-gray-500 hover:bg-gray-100 text-sm hover:font-bold"
                            onClick={() => {
                                setSidebarOpen(false);
                                router.push("/contact-us");
                            }}
                        >
                            Need help?
                        </Button>
                    </div>
                </div>
            </aside>

            <section className="flex-1 px-4 sm:px-6 md:px-8 pt-20 lg:pt-10 space-y-6">
                {sidebarItems[step]?.key === "appInfo" && (
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-2xl font-semibold text-pink-500">Wedding Details</h2>
                        <div>
                            <Label className="text-blue-500 pb-2 font-bold">Couple Name</Label>
                            <Input
                                className="w-full bg-beige text-black border border-pink-300 px-4 py-2"
                                value={form.coupleName}
                                onChange={(e) => handleChange("coupleName", e.target.value)}
                                disabled={isSubmitted}
                            />
                        </div>
                        <div>
                            <Label className="text-blue-500 pb-2 font-bold">Wedding Date</Label>
                            <Input
                                type="date"
                                className="w-full bg-beige text-black border border-pink-300 px-4 py-2"
                                value={form.weddingDate}
                                onChange={(e) => handleChange("weddingDate", e.target.value)}
                                disabled={isSubmitted}
                            />
                        </div>
                        <div>
                            <Label className="text-blue-500 pb-2 font-bold">Wedding Location</Label>
                            <Input
                                className="w-full bg-beige text-black border border-pink-300 px-4 py-2"
                                value={form.weddingLocation}
                                onChange={(e) => handleChange("weddingLocation", e.target.value)}
                                disabled={isSubmitted}
                            />
                        </div>
                        <div className="font-bold text-lg">All screens are enabled by default. Please review and select the ones you would like to include in your custom mobile wedding app.</div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {screenToggles.map(({ label, field }) => (
                                <button
                                    key={field}
                                    className={`px-4 py-2 rounded-full border text-sm font-bold transition 
        ${form[field] ? "bg-pink-400 text-white border-white" : "bg-transparent text-black border-[#6B5A7A] hover:border-white"}`}
                                    onClick={() => handleToggle(field)}
                                    disabled={isSubmitted}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>Next</Button>
                    </div>
                )}

                {sidebarItems[step]?.key === "saveDate" && (
                    <SaveTheDate setForm={setForm} goNext={goNext} goBack={goBack} form={form} />
                )}

                {sidebarItems[step]?.key === "ourStory" && (
                    <OurStory form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "rsvpGallery" && (
                    <RSVPAndGallery form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "ourFamily" && (
                    <OurFamily form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "weddingParty" && (
                    <WeddingParty form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "itinerary" && (
                    <Itinerary form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "travel" && (
                    <Travel form={form} setForm={setForm} goNext={goNext} goBack={goBack} />
                )}

                {sidebarItems[step]?.key === "settings" && (
                    <Settings form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}
                {sidebarItems[step]?.key === "notification" && (
                    <Notifications form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}
                {sidebarItems[step]?.key === "themes" && (
                    <Themes form={form} handleChange={handleChange} goNext={goNext} goBack={goBack} />
                )}
                {sidebarItems[step]?.key === "preview" && (
                    <Preview form={form} goBack={goBack} />
                )}
            </section>
        </main>
        //     <div className="grid grid-cols-2 gap-4">
        //     <div>
        //         <Label className="text-blue-500 pb-2">Save The Date</Label>
        //         <CustomSwitch checked={form.enableSaveDate} onToggle={() => handleToggle("enableSaveDate")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Our Story</Label>
        //         <CustomSwitch checked={form.enableStory} onToggle={() => handleToggle("enableStory")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Enable RSVP</Label>
        //         <CustomSwitch checked={form.enableRSVP} onToggle={() => handleToggle("enableRSVP")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Enable Gallery</Label>
        //         <CustomSwitch checked={form.enableGallery} onToggle={() => handleToggle("enableGallery")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Our Family Section</Label>
        //         <CustomSwitch checked={form.enableFamily} onToggle={() => handleToggle("enableFamily")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Wedding Party</Label>
        //         <CustomSwitch checked={form.enableWeddingParty} onToggle={() => handleToggle("enableWeddingParty")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Wedding Itinerary</Label>
        //         <CustomSwitch checked={form.enableItinerary} onToggle={() => handleToggle("enableItinerary")} disabled={isSubmitted} />
        //     </div>
        //     <div>
        //         <Label className="text-blue-500 pb-2">Travel</Label>
        //         <CustomSwitch checked={form.enableTravel} onToggle={() => handleToggle("enableTravel")} disabled={isSubmitted} />
        //     </div>
        //     {/* <div>
        //                             <Label className="text-blue-500 pb-2">Registry</Label>
        //                             <CustomSwitch checked={form.enableRegistry} onToggle={() => handleToggle("enableRegistry")} />
        //                         </div> */}
        //     <div>
        //         <Label className="text-blue-500 pb-2">Settings (FAQs)</Label>
        //         <CustomSwitch checked={form.enableSettings} onToggle={() => handleToggle("enableSettings")} disabled={isSubmitted} />
        //     </div>
        // </div>
    );
}



