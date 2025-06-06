"use client";

import React from "react";
import { FormState } from "@/types/FormState";
import Countdown from "@/components/utilities/Countdown";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";

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
                <div className="text-sm space-y-6" style={sectionStyle}>
                    {/* Implement toggle sections for FAQs, Contact Info, etc. if needed */}
                    <p>Settings Preview</p>
                </div>
            );

        default:
            return null;
    }
}
