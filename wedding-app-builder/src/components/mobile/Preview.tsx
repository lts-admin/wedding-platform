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
import Countdown from "@/components/utilities/Countdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import { saveFormToFirestore } from "@/lib/saveFormToFirestore";

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
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [faqsOpen, setFaqsOpen] = useState(true);
    const [contactOpen, setContactOpen] = useState(true);
    const [venueOpen, setVenueOpen] = useState(true);
    const [hotelOpen, setHotelOpen] = useState(true);

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
                    <div className="space-y-2 text-center" style={{ fontFamily: form.selectedFont }}>
                        <p className="text-xl font-bold py-6">SAVE THE DATE</p>
                        <p className="text-xl font-bold py-6">Join us for the wedding of<br />{form.coupleName}</p>
                        <p className="text-lg text-black">
                            {new Date(`${form.weddingDate}T00:00:00`).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>

                        <p className="text-xl text-black">{form.weddingLocation}</p>
                        <div className="flex justify-center">
                            {form.saveTheDateImage && (
                                <img
                                    src={URL.createObjectURL(form.saveTheDateImage)}
                                    alt="Save the Date Preview"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}
                        </div>
                        <div className="flex justify-center">
                            {form.enableRSVP && (
                                <Button className="bg-black text-white">RSVP</Button>
                            )}
                        </div>
                        {form.enableCountdown && (
                            <Countdown weddingDate={form.weddingDate} />
                        )}
                    </div>
                );

            case "rsvp":
                return (
                    <div className="space-y-2 text-center" style={{ fontFamily: form.selectedFont }}>
                        <p className="text-xl font-bold py-6">SAVE THE DATE</p>
                        <p className="text-xl font-bold" >{form.coupleName}</p>
                        <p className="text-xl text-black">{form.weddingDate}</p>
                        <p className="text-sm text-gray-700">{form.weddingLocation}</p>
                        <div className="flex justify-center">
                            {form.saveTheDateImage && (
                                <img
                                    src={URL.createObjectURL(form.saveTheDateImage)}
                                    alt="Save the Date Preview"
                                    className="w-32 h-32 object-cover rounded"
                                />
                            )}
                        </div>
                        <div className="flex justify-center">
                            {form.enableRSVP && (
                                <Button className="bg-black text-white">RSVP</Button>
                            )}
                        </div>
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
            case "party":
                return (
                    <div className="text-sm space-y-6">
                        {/* Family Section */}
                        <div>
                            <h3 className="font-bold text-lg">Family</h3>
                            <h4 className="font-semibold mt-2">Bride&apos;s Side</h4>
                            {form.familyDetails.bride.map((m, i) => (
                                <p key={`family-bride-${i}`}>
                                    {m.name} - {m.relation}
                                </p>
                            ))}
                            <h4 className="font-semibold mt-2">Groom&apos;s Side</h4>
                            {form.familyDetails.groom.map((m, i) => (
                                <p key={`family-groom-${i}`}>
                                    {m.name} - {m.relation}
                                </p>
                            ))}
                            {form.familyDetails.pets.length > 0 && (
                                <>
                                    <h4 className="font-semibold mt-2">Pets</h4>
                                    {form.familyDetails.pets.map((p, i) => (
                                        <p key={`family-pet-${i}`}>{p.name}</p>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Wedding Party Section */}
                        <div>
                            <h3 className="font-bold text-lg">Wedding Party</h3>
                            <h4 className="font-semibold mt-2">Bride&apos;s Side</h4>
                            {form.weddingParty.bride.map((m, i) => (
                                <p key={`party-bride-${i}`}>
                                    {m.name} - {m.role} ({m.relation})
                                </p>
                            ))}
                            <h4 className="font-semibold mt-2">Groom&apos;s Side</h4>
                            {form.weddingParty.groom.map((m, i) => (
                                <p key={`party-groom-${i}`}>
                                    {m.name} - {m.role} ({m.relation})
                                </p>
                            ))}
                        </div>
                    </div>
                );
            case "itinerary":
                return (
                    <div className="text-sm space-y-2">
                        {form.weddingEvents.map((e, i) => (
                            <div key={i}>
                                <p className="font-semibold">{e.name}</p>
                                <p>
                                    {e.date} • {e.startTime} • {e.location} • {e.dressCode}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            case "settings":
                return (
                    <div className="text-sm space-y-6">
                        {/* FAQs */}
                        <div>
                            <button
                                onClick={() => setFaqsOpen(!faqsOpen)}
                                className="flex justify-between items-center w-full text-left text-black font-semibold mb-2"
                            >
                                <span>FAQs</span>
                                {faqsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {faqsOpen && (
                                <ul className="space-y-3">
                                    {Array.isArray(form.faqs) &&
                                        form.faqs.map((faq, index) => (
                                            <li key={index}>
                                                <p className="font-bold">{faq.question}</p>
                                                <p className="text-gray-300">{faq.answer}</p>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <button
                                onClick={() => setContactOpen(!contactOpen)}
                                className="flex justify-between items-center w-full text-left text-black font-semibold mb-2"
                            >
                                <span>Contact Info</span>
                                {contactOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {contactOpen && (
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
                            )}
                        </div>

                        {/* Venue Details */}
                        <div>
                            <button
                                onClick={() => setVenueOpen(!venueOpen)}
                                className="flex justify-between items-center w-full text-left text-black font-semibold mb-2"
                            >
                                <span>Venue Details</span>
                                {venueOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {venueOpen && (
                                <ul className="space-y-3">
                                    {Array.isArray(form.venueDetails) &&
                                        form.venueDetails.map((venue, index) => (
                                            <li key={index} className="text-black">
                                                {venue}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>

                        {/* Hotel Info */}
                        <div>
                            <button
                                onClick={() => setHotelOpen(!hotelOpen)}
                                className="flex justify-between items-center w-full text-left text-black font-semibold mb-2"
                            >
                                <span>Hotel Info</span>
                                {hotelOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {hotelOpen && (
                                <ul className="space-y-3">
                                    {Array.isArray(form.hotelDetails) &&
                                        form.hotelDetails.map((hotel, index) => (
                                            <li key={index} className="text-black">
                                                {hotel}
                                            </li>
                                        ))}
                                </ul>
                            )}
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
        // ...(form.enableFamily ? [{ id: "family", label: "Family", icon: <Users size={18} /> }] : []),
        ...(form.enableWeddingParty ? [{ id: "party", label: "Wedding Party", icon: <Users2 size={18} /> }] : []),
        //...(form.enableGallery ? [{ id: "gallery", label: "Gallery", icon: <Image size={18} /> }] : []),
        ...(form.enableItinerary ? [{ id: "itinerary", label: "Itinerary", icon: <CalendarDays size={18} /> }] : []),
        ...(form.enableSettings ? [{ id: "settings", label: "Settings", icon: <Settings size={18} /> }] : []),
    ];

    const validateRequiredFields = () => {
        const errors: string[] = [];

        if (!form.coupleName.trim()) errors.push("Couple name");
        if (!form.weddingDate.trim()) errors.push("Wedding date ");
        if (!form.weddingLocation.trim()) errors.push("Wedding location");
        if (!form.appName.trim()) errors.push("App name");

        setErrorMessages(errors);
        return errors;
    };
    const handleGenerateApp = async () => {
        if (!user) return false;

        const errors = validateRequiredFields();
        if (errors.length > 0) {
            setShowErrorModal(true);
            return;
        }


        try {
            saveFormToFirestore(user, form).catch(console.error);
            setIsSubmitted(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-app`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) return false;

            const blob = await response.blob();
            const zipPath = `zips/${user.uid}/wedding_app.zip`;
            const storageRef = ref(storage, zipPath);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            const appDocRef = doc(db, "weddingApps", user.uid);
            await setDoc(appDocRef, {
                ...form,
                isSubmitted: true,
                zipGenerated: true,
                formCompleted: true,
                feedbackReceived: false,
                published: false,
                generatedAt: serverTimestamp(),
            }, { merge: true });

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
                if (!isNaN(latestId)) newId = latestId + 1;
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

            await fetch('/api/send-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'App Submission Request' }), // or "Help Request", etc.
            });

            return true;
        } catch (error) {
            console.error("Error generating app:", error);
            return false;
        }
    };

    // const handleGenerateApp = async () => {
    //     if (!user) return;
    //     const errors = validateRequiredFields();
    //     if (errors.length > 0) {
    //         errors.forEach((message: string) => {
    //             window.alert(message);
    //         });
    //         return;
    //     }
    //     // saveFormToFirestore(user, form).catch(console.error);
    //     // setIsSubmitted(true);
    //     // console.log("form", form);
    //     // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-app`, {
    //     //     method: "POST",
    //     //     headers: { "Content-Type": "application/json" },
    //     //     body: JSON.stringify(form),
    //     // });

    //     // if (!response.ok) return;

    //     // const blob = await response.blob();
    //     // const zipPath = `zips/${user.uid}/wedding_app.zip`;
    //     // const storageRef = ref(storage, zipPath);
    //     // await uploadBytes(storageRef, blob);
    //     // const downloadURL = await getDownloadURL(storageRef);

    //     // const appDocRef = doc(db, "weddingApps", user.uid);
    //     // await setDoc(
    //     //     appDocRef,
    //     //     {
    //     //         ...form,
    //     //         isSubmitted: true,
    //     //         zipGenerated: true,
    //     //         formCompleted: true,
    //     //         feedbackReceived: false,
    //     //         published: false,
    //     //         generatedAt: serverTimestamp(),
    //     //     },
    //     //     { merge: true }
    //     // );

    //     // const zipDocRef = doc(db, "weddingAppZips", user.uid);
    //     // await setDoc(zipDocRef, {
    //     //     userId: user.uid,
    //     //     downloadUrl: downloadURL,
    //     //     zipPath,
    //     //     generatedAt: serverTimestamp(),
    //     // });

    //     // const workRequestsCollection = collection(db, "workRequests");
    //     // const latestQuery = query(workRequestsCollection, orderBy("__name__", "desc"), limit(1));
    //     // const latestSnap = await getDocs(latestQuery);
    //     // let newId = 1;
    //     // if (!latestSnap.empty) {
    //     //     const latestId = parseInt(latestSnap.docs[0].id);
    //     //     if (!isNaN(latestId)) {
    //     //         newId = latestId + 1;
    //     //     }
    //     // }

    //     // const workRequestRef = doc(db, "workRequests", newId.toString());
    //     // await setDoc(workRequestRef, {
    //     //     assignee: "Satya Vinjamuri",
    //     //     userId: user.uid,
    //     //     coupleName: form.coupleName,
    //     //     zipFileUrl: downloadURL,
    //     //     authStatus: WorkStatus.Submitted,
    //     //     feedback: "",
    //     //     dateCreated: serverTimestamp(),
    //     //     dateCompleted: null,
    //     // });
    // };

    return (
        <div>
            <div className="pb-6">
                <h2 className="text-2xl font-semibold text-pink-400">Preview of your Custom App</h2>
                <p className="mt-4 text-sm text-red-500 font-bold italic bg-petal px-4 py-2 rounded-md border max-w-2xl">
                    Please remember this is just a preview and not what your app will actually look like!
                </p>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-12">
                <div className="flex flex-col items-center lg:items-start">
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
                                    className={`flex flex-col items-center w-[60px] text-center ${activeTab === tab.id ? "text-blue-600 font-semibold" : "text-gray-600"}`}
                                >
                                    {tab.icon}
                                    <span className="text-[11px] leading-tight truncate">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pb-12">
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
                                const success = await handleGenerateApp();
                                if (success) setShowSuccessModal(true);
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
            <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                <DialogContent className="bg-[#f5f5dc] text-black">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 font-bold">Submission Error</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-black px-1 pb-2">
                        These fields are required and must be filled before submission:
                        <ul className="list-disc mt-2 ml-6">
                            {errorMessages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                        <p className="text-red-500 font-bold font-italic">Please fill out the complete form to get the best experience! </p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowErrorModal(false)}>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
