"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";

interface TravelProps {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
}

const Travel: React.FC<TravelProps> = ({ form, goNext, goBack }) => {
    const isSubmitted = form.isSubmitted;
    const [hotels, setHotels] = useState<string[]>([""]);
    const [venues, setVenues] = useState<string[]>([""]);

    const handleAddHotel = () => setHotels([...hotels, ""]);
    const handleAddVenue = () => setVenues([...venues, ""]);

    const handleHotelChange = (index: number, value: string) => {
        const updated = [...hotels];
        updated[index] = value;
        setHotels(updated);
    };

    const handleVenueChange = (index: number, value: string) => {
        const updated = [...venues];
        updated[index] = value;
        setVenues(updated);
    };

    return (
        <div className="max-w-xxl mx-auto space-y-8 text-[#E4D7DE]">
            <h2 className="text-2xl font-semibold text-pink-400">Travel & Accommodations</h2>

            <div className="space-y-4">
                <h3 className="text-lg text-pink-300 font-bold">Venue Details</h3>
                {venues.map((venue, idx) => (
                    <Textarea
                        key={idx}
                        value={venue}
                        onChange={(e) => handleVenueChange(idx, e.target.value)}
                        placeholder={`Venue ${idx + 1}`}
                        className="bg-[#1A1A1A] text-white border border-pink-300"
                    />
                ))}
                <Button onClick={handleAddVenue} className="bg-pink-500 text-black font-bold" disabled={isSubmitted}>
                    + Add Venue
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg text-pink-300 font-bold">Hotel Block Info</h3>
                {hotels.map((hotel, idx) => (
                    <Textarea
                        key={idx}
                        value={hotel}
                        onChange={(e) => handleHotelChange(idx, e.target.value)}
                        placeholder={`Hotel ${idx + 1}`}
                        className="bg-[#1A1A1A] text-white border border-pink-300"
                        disabled={isSubmitted}
                    />
                ))}
                <Button onClick={handleAddHotel} className="bg-pink-500 text-black font-bold" disabled={isSubmitted}>
                    + Add Hotel
                </Button>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={goBack} className="font-bold">
                    Back
                </Button>
                <Button className="bg-purple-500 text-black font-bold" onClick={goNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Travel;
