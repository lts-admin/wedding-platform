"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";
import { X } from "lucide-react";

type ItineraryProps = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
};

const Itinerary: React.FC<ItineraryProps> = ({ form, setForm, goNext, goBack }) => {
    const isSubmitted = form.isSubmitted;

    const handleEventChange = (
        section: "weddingEvents" | "brideEvents" | "groomEvents",
        index: number,
        field: keyof FormState["weddingEvents"][0],
        value: string
    ) => {
        const updatedEvents = [...form[section]];
        updatedEvents[index][field] = value;
        setForm({ ...form, [section]: updatedEvents });
    };

    const addEvent = (section: "weddingEvents" | "brideEvents" | "groomEvents") => {
        const newEvent = { name: "", date: "", time: "", location: "", dressCode: "" };
        setForm({ ...form, [section]: [...form[section], newEvent] });
    };

    const handleRemoveEvent = (
        section: "weddingEvents" | "brideEvents" | "groomEvents",
        index: number
    ) => {
        const updatedEvents = [...form[section]];
        updatedEvents.splice(index, 1);
        setForm({ ...form, [section]: updatedEvents });
    };

    const renderEventInputs = (
        section: "weddingEvents" | "brideEvents" | "groomEvents",
        label: string
    ) => (
        <div className="space-y-4">
            <h3 className="text-pink-500 pb-2 font-semibold">{label}</h3>
            {form[section].map((event, index) => (
                <div key={index} className="border p-4 rounded-md space-y-2 relative">
                    {!isSubmitted && (
                        <button
                            onClick={() => handleRemoveEvent(section, index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            aria-label="Remove event"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <Input
                        placeholder="Event Name"
                        value={event.name}
                        onChange={(e) => handleEventChange(section, index, "name", e.target.value)}
                        className="mb-2 text-black font-bold"
                        disabled={isSubmitted}
                    />
                    <Input
                        type="date"
                        placeholder="Date"
                        value={event.date}
                        onChange={(e) => handleEventChange(section, index, "date", e.target.value)}
                        className="mb-2 font-bold"
                        disabled={isSubmitted}
                    />
                    <Input
                        placeholder="Time"
                        value={event.time}
                        onChange={(e) => handleEventChange(section, index, "time", e.target.value)}
                        className="mb-2 font-bold"
                        disabled={isSubmitted}
                    />
                    <Input
                        placeholder="Location"
                        value={event.location}
                        onChange={(e) => handleEventChange(section, index, "location", e.target.value)}
                        className="mb-2 text-black font-bold"
                        disabled={isSubmitted}
                    />
                    <Input
                        placeholder="Dress Code"
                        value={event.dressCode}
                        onChange={(e) => handleEventChange(section, index, "dressCode", e.target.value)}
                        className="mb-2 text-black font-bold"
                        disabled={isSubmitted}
                    />
                </div>
            ))}
            <Button
                type="button"
                className="bg-pink-400 font-bold text-black"
                onClick={() => addEvent(section)}
                disabled={isSubmitted}
            >
                + Add {label} Event
            </Button>
        </div>
    );

    return (
        <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">Wedding Itinerary</h2>
            {renderEventInputs("weddingEvents", "Wedding Events")}
            {renderEventInputs("brideEvents", "Bride Events")}
            {renderEventInputs("groomEvents", "Groom Events")}
            <div className="flex justify-start gap-4 pt-4 pb-6">
                <Button variant="outline" className="font-bold" onClick={goBack}>
                    Back
                </Button>
                <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Itinerary;
