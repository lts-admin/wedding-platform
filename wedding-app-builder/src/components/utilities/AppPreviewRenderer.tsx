"use client";

import React, { useState } from "react";
import { FormState } from "@/types/FormState";
import Countdown from "@/components/utilities/Countdown";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
type Props = {
    form: FormState;
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const fontMap: Record<string, string> = {
    Script: "'Dancing Script', cursive",
    Serif: "Georgia, serif",
    Sans: "Helvetica, Arial, sans-serif",
};

const formatFullDateTime = (date: string, startTime: string, endTime: string) => {
    const fullDate = new Date(date);
    const weekdayDate = fullDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return `${weekdayDate} ${startTime} - ${endTime}`;
};

export default function AppPreviewRenderer({ form, activeTab, setActiveTab }: Props) {
    const [showInvitationModal, setShowInvitationModal] = useState(false);
    const [faqsOpen, setFaqsOpen] = useState(true);
    const [contactOpen, setContactOpen] = useState(true);
    const [venueOpen, setVenueOpen] = useState(true);
    const [hotelOpen, setHotelOpen] = useState(true);

    const sectionStyle = {
        color: form.selectedFontColor,
        backgroundColor: form.selectedColor || "#ffffff",
        fontFamily: fontMap[form.selectedFont] || "sans-serif",
    };

    switch (activeTab) {
        case "home":
            return (
                <div className="space-y-2 text-center" style={sectionStyle}>
                    <p className="text-xl font-bold py-6">SAVE THE DATE</p>
                    <p className="text-lg font-bold">Join us for the wedding of</p>
                    <p className="text-xl font-bold">{form.brideName} & {form.groomName}</p>
                    <p className="text-lg">
                        {new Date(form.weddingDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p className="text-xl">{form.weddingLocation}</p>
                    {form.saveTheDateImage && (
                        <div className="flex justify-center">
                            <img
                                src={URL.createObjectURL(form.saveTheDateImage)}
                                alt="Save the Date Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}
                    {form.enableRSVP && (
                        <div className="flex justify-center">
                            <Button className="bg-black text-white" onClick={() => setActiveTab("rsvp")}>RSVP</Button>
                        </div>
                    )}
                    {form.enableCountdown && <Countdown weddingDate={form.weddingDate} />}
                </div>
            );
        case "rsvp":
            return (
                <div className="h-full text-center px-6 pt-4 space-y-6" style={{ color: form.selectedFontColor, backgroundColor: form.selectedColor || "#ffffff", fontFamily: fontMap[form.selectedFont] || "sans-serif" }}>
                    {/* Top bar with back arrow and title */}
                    {/* Chevron Left Button */}
                    <Button
                        onClick={() => setActiveTab("home")}
                        className="absolute left-0 text-2xl font-light text-black"
                        variant="ghost"
                    >
                        <ChevronLeft size={30} />
                    </Button>
                    <div className="mb-2 text-black h-10 flex items-center">

                        <h2 className=" text-lg font-bold">
                            Find your Invite!
                        </h2>
                    </div>




                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="text-left">
                            <label className="block font-medium text-black text-sm mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full border-b border-gray-400 placeholder:text-white bg-transparent p-2 text-sm outline-none"
                            />
                        </div>
                        <div className="text-left">
                            <label className="block font-medium text-black text-sm mb-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="w-full border-b border-gray-400 placeholder:text-white bg-transparent p-2 text-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className="pt-4">
                        <Button
                            onClick={() => setShowInvitationModal(true)}
                            className="bg-[#F8E1E7] text-black font-semibold px-6 py-2 rounded-full shadow-sm hover:shadow-md"
                        >
                            Look Up Invitation
                        </Button>
                    </div>
                    <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
                        <DialogContent className="bg-[#f8f5f4] text-black">
                            <DialogHeader>
                                <DialogTitle>Look up RSVP</DialogTitle>
                                <p className="text-sm text-gray-600">
                                    This functionality will be visible when your app is generated and downloadable.
                                </p>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setShowInvitationModal(false)}>
                                    Close
                                </Button>

                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div >
            );
        case "story":
            return (
                <div className="text-sm space-y-2 text-left" style={sectionStyle}>
                    <h2 className="text-xl font-bold">Our Story</h2>
                    {form.storyParagraphs.length > 0 ? (
                        form.storyParagraphs.map((p, i) => <p key={i}>{p}</p>)
                    ) : (
                        <p>No story added.</p>
                    )}
                </div>
            );

        case "party":
            return (
                <div className="text-sm px-4 py-6 space-y-8 text-center" style={sectionStyle}>
                    <h3 className="text-xl font-bold">Wedding Party</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {form.familyDetails.bride.map((m, i) => (
                            <div key={`bride-family-${i}`}>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-xs">{m.relation}</p>
                            </div>
                        ))}
                        {form.familyDetails.groom.map((m, i) => (
                            <div key={`groom-family-${i}`}>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-xs">{m.relation}</p>
                            </div>
                        ))}
                        {form.familyDetails.pets.map((m, i) => (
                            <div key={`pet-${i}`}>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-xs">Beloved Pet</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {form.weddingParty.bride.map((m, i) => (
                            <div key={`bride-party-${i}`}>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-xs">{m.role} ({m.relation})</p>
                            </div>
                        ))}
                        {form.weddingParty.groom.map((m, i) => (
                            <div key={`groom-party-${i}`}>
                                <p className="font-bold">{m.name}</p>
                                <p className="text-xs">{m.role} ({m.relation})</p>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "itinerary":
            return (
                <div className="text-sm px-4 py-6 space-y-6" style={sectionStyle}>
                    {(["brideEvents", "groomEvents", "weddingEvents"] as const).map((key) => {
                        const events = form[key];
                        if (!events || events.length === 0) return null;

                        const label = key
                            .replace("Events", " Events")
                            .replace(/^bride/, "Bride")
                            .replace(/^groom/, "Groom")
                            .replace(/^wedding/, "Wedding");

                        return (
                            <div key={key}>
                                <h2 className="text-lg font-bold mb-1">{label}</h2>
                                {events.map((e, i) => (
                                    <div key={i} className="flex items-start gap-2 mb-4">
                                        <CalendarIcon className="mt-1" size={20} />
                                        <div>
                                            <p className="font-semibold">{e.name}</p>
                                            <p className="text-sm">Venue: {e.location}</p>
                                            <p className="font-semibold">
                                                {formatFullDateTime(e.date, e.startTime, e.endTime)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            );

        case "settings":
            return (
                <div className="text-sm space-y-6" style={{ color: form.selectedFontColor, backgroundColor: form.selectedColor || "#ffffff", fontFamily: fontMap[form.selectedFont] || "sans-serif" }}>
                    {/* FAQs */}
                    <div>
                        <button
                            onClick={() => setFaqsOpen(!faqsOpen)}
                            className="flex justify-between items-center w-full text-left font-semibold mb-2"
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
                            className="flex justify-between items-center w-full text-left  font-semibold mb-2"
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
                    <div style={{ color: form.selectedFontColor, backgroundColor: form.selectedColor || "#ffffff", fontFamily: fontMap[form.selectedFont] || "sans-serif" }}>
                        <button
                            onClick={() => setVenueOpen(!venueOpen)}
                            className="flex justify-between items-center w-full text-left font-semibold mb-2"
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
                            className="flex justify-between items-center w-full text-left font-semibold mb-2"
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
}
