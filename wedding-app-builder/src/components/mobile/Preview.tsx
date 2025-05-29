"use client";

import React, { useState, useEffect } from "react";
import { FormState } from "@/types/FormState";
import { WorkStatus } from "@/types/WorkStatus";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    Home,
    Image,
    Settings,
    Users,
    Users2,
    BookOpen,
} from "lucide-react";
import {
    collection,
    query,
    orderBy,
    limit,
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const db = getFirestore();

type Props = {
    form: FormState;
    goBack: () => void;
};

export default function Preview({ form, goBack }: Props) {
    const [activeTab, setActiveTab] = useState("home");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSubmissionStatus = async () => {
            if (!user) return;
            const docRef = doc(db, "weddingApps", user.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists() && snapshot.data().zipGenerated) {
                setIsSubmitted(true);
            }
        };

        fetchSubmissionStatus();
    }, [user]);

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (
                    <div className="space-y-2 text-center">
                        <p className="text-xl font-serif font-bold">{form.coupleName}</p>
                        <p className="text-sm text-gray-700">{form.weddingDate}</p>
                        <p className="text-sm text-gray-700">{form.weddingLocation}</p>
                    </div>
                );
            case "story":
                return (
                    <div className="text-sm space-y-2 text-center">
                        {form.storyParagraphs.length > 0 ? (
                            form.storyParagraphs.map((p, i) => (
                                <p key={i} className="text-sm text-gray-700">
                                    {p}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm text-black">No story added.</p>
                        )}
                    </div>
                );
            case "gallery":
                return (
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-medium">Gallery Preview</p>
                        {form.galleryDriveUrl ? (
                            <a
                                href={form.galleryDriveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                View Gallery Folder
                            </a>
                        ) : (
                            <p className="text-xs text-black">No gallery link provided.</p>
                        )}
                    </div>
                );
            case "family":
                return (
                    <div className="text-sm space-y-2">
                        <h4 className="font-bold">Bride&apos;s Side</h4>
                        {form.familyDetails.bride.map((m, i) => (
                            <p key={i}>
                                {m.name} - {m.relation}
                            </p>
                        ))}
                        <h4 className="font-bold mt-2">Groom&apos;s Side</h4>
                        {form.familyDetails.groom.map((m, i) => (
                            <p key={i}>
                                {m.name} - {m.relation}
                            </p>
                        ))}
                        {form.familyDetails.pets.length > 0 && (
                            <>
                                <h4 className="font-bold mt-2">Pets</h4>
                                {form.familyDetails.pets.map((p, i) => (
                                    <p key={i}>{p.name}</p>
                                ))}
                            </>
                        )}
                    </div>
                );
            case "party":
                return (
                    <div className="text-sm space-y-2">
                        <h4 className="font-bold">Bride&apos;s Side</h4>
                        {form.weddingParty.bride.map((m, i) => (
                            <p key={i}>
                                {m.name} - {m.role} ({m.relation})
                            </p>
                        ))}
                        <h4 className="font-bold mt-2">Groom&apos;s Side</h4>
                        {form.weddingParty.groom.map((m, i) => (
                            <p key={i}>
                                {m.name} - {m.role} ({m.relation})
                            </p>
                        ))}
                    </div>
                );
            case "itinerary":
                return (
                    <div className="text-sm space-y-2">
                        {form.weddingEvents.map((e, i) => (
                            <div key={i}>
                                <p className="font-semibold">{e.name}</p>
                                <p>
                                    {e.date} • {e.time} • {e.location} • {e.dressCode}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            case "settings":
                return (
                    <div className="text-sm space-y-6">
                        <div>
                            <h3 className="text-black font-semibold mb-2">FAQs:</h3>
                            <ul className="space-y-3">
                                {Array.isArray(form.faqs) &&
                                    form.faqs.map((faq, index) => (
                                        <li key={index}>
                                            <p className="font-bold">{faq.question}</p>
                                            <p className="text-gray-300">{faq.answer}</p>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-black font-semibold mb-2">Contact Info:</h3>
                            <ul className="space-y-3">
                                {Array.isArray(form.contactInfo) &&
                                    form.contactInfo.map((contact, index) => (
                                        <li key={index}>
                                            <p>{contact.name}</p>
                                            <p>{contact.phone}</p>
                                            <p>{contact.email}</p>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const tabs = [
        { id: "home", label: "Home", icon: <Home size={18} /> },
        ...(form.enableStory ? [{ id: "story", label: "Our Story", icon: <BookOpen size={18} /> }] : []),
        ...(form.enableGallery ? [{ id: "gallery", label: "Gallery", icon: <Image size={18} /> }] : []),
        ...(form.enableFamily ? [{ id: "family", label: "Family", icon: <Users size={18} /> }] : []),
        ...(form.enableWeddingParty ? [{ id: "party", label: "Wedding Party", icon: <Users2 size={18} /> }] : []),
        ...(form.enableItinerary ? [{ id: "itinerary", label: "Itinerary", icon: <CalendarDays size={18} /> }] : []),
        ...(form.enableSettings ? [{ id: "settings", label: "Settings", icon: <Settings size={18} /> }] : []),
    ];

    const handleGenerateApp = async () => {
        if (!user) return;

        setIsSubmitted(true);
        console.log("form", form);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-app`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (!response.ok) return;

        const blob = await response.blob();
        const zipPath = `zips/${user.uid}/wedding_app.zip`;
        const storageRef = ref(storage, zipPath);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const appDocRef = doc(db, "weddingApps", user.uid);
        await setDoc(
            appDocRef,
            {
                ...form,
                isSubmitted: true,
                zipGenerated: true,
                formCompleted: true,
                feedbackReceived: false,
                published: false,
                generatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        const zipDocRef = doc(db, "weddingAppZips", user.uid);
        await setDoc(zipDocRef, {
            userId: user.uid,
            downloadUrl: downloadURL,
            zipPath,
            generatedAt: serverTimestamp(),
        });

        const workRequestsCollection = collection(db, "workRequests");
        const latestQuery = query(workRequestsCollection, orderBy("__name__", "desc"), limit(1));
        const latestSnap = await getDocs(latestQuery);
        let newId = 1;
        if (!latestSnap.empty) {
            const latestId = parseInt(latestSnap.docs[0].id);
            if (!isNaN(latestId)) {
                newId = latestId + 1;
            }
        }

        const workRequestRef = doc(db, "workRequests", newId.toString());
        await setDoc(workRequestRef, {
            assignee: "Satya Vinjamuri",
            userId: user.uid,
            coupleName: form.coupleName,
            zipFileUrl: downloadURL,
            authStatus: WorkStatus.Submitted,
            feedback: "",
            dateCreated: serverTimestamp(),
            dateCompleted: null,
        });
    };

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-12">
                <div className="flex flex-col items-center lg:items-start">
                    <h2 className="text-2xl font-semibold text-pink-400 mb-4">Preview of your Custom App</h2>
                    <div className="relative shadow-2xl rounded-[40px] w-[300px] h-[600px] overflow-hidden border-[6px] border-gray-200 text-black">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-300 rounded-b-xl z-10" />
                        <div className="p-6 pt-8 overflow-y-auto pb-20 h-full" style={{ backgroundColor: form.selectedColor || "#ffffff", fontFamily: form.selectedFont }}>
                            {renderContent()}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-neutral-100 p-2 rounded-b-[40px] flex justify-around text-xs border-t">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center ${activeTab === tab.id ? "text-blue-600 font-semibold" : "text-gray-600"}`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Button className="w-[200px] bg-pink-400 text-black font-bold" onClick={() => setShowConfirmModal(true)} disabled={isSubmitted}>
                        {isSubmitted ? "Submitted" : "Build My App"}
                    </Button>
                    <Button variant="outline" className="w-[200px] font-bold" onClick={goBack}>
                        Back
                    </Button>
                </div>
            </div>

            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="bg-[#f5f5dc] text-black">
                    <DialogHeader>
                        <DialogTitle className="text-black">Are you sure?</DialogTitle>
                        <DialogDescription className="text-black">
                            You won't be able to make changes after this step.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" className="text-black" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button
                            onClick={async () => {
                                setShowConfirmModal(false);
                                await handleGenerateApp();
                                setShowSuccessModal(true);
                            }}
                            variant="outline"
                            className="text-black"
                        >
                            Yes, Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="bg-[#f5f5dc] text-black">
                    <DialogHeader>
                        <DialogTitle>Thank you!</DialogTitle>
                        <DialogDescription>
                            You will receive an email with instructions in the next 24 hours on how you can download your personal wedding mobile app.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccessModal(false)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
