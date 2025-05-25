"use client";

import React from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Input } from "@/components/ui/input";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const LocationAutocomplete: React.FC<Props> = ({ onChange }) => {
    const {
        value: inputValue,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Optionally restrict results by region */
        },
        debounce: 300,
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    const handleSelect = (description: string) => {
        setValue(description, false);
        onChange(description);
        clearSuggestions();
    };

    return (
        <div className="relative">
            <Input
                value={inputValue}
                onChange={handleInput}
                placeholder="Start typing your venue address..."
                className="bg-[#1A1A1A] text-white font-bold border border-pink-300"
            />
            {status === "OK" && (
                <ul className="absolute z-10 bg-white text-black mt-1 w-full rounded shadow max-h-52 overflow-auto">
                    {data.map(({ place_id, description }) => (
                        <li
                            key={place_id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelect(description)}
                        >
                            {description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
