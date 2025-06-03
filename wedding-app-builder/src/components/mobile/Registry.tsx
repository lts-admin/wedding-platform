"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";

interface RegistryEntry {
    label: string;
    url: string;
}

interface RegistryProps {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
}

export default function Registry({ form, setForm, goNext, goBack }: RegistryProps) {
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");

    const addRegistry = () => {
        if (!label.trim() || !url.trim()) return;
        const newRegistry = { label, url };
        const updatedRegistries = [...(form.registries || []), newRegistry];
        setForm({ ...form, registries: updatedRegistries });
        setLabel("");
        setUrl("");
    };

    const deleteRegistry = (index: number) => {
        const updatedRegistries = (form.registries || []).filter((_, i) => i !== index);
        setForm({ ...form, registries: updatedRegistries });
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-pink-400 mb-4">Add Your Registry Links</h2>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Label className="text-black font-bold pb-6 pt-6 text-lg">Registry</Label>
                        <div className="relative group cursor-pointer">
                            <span className="text-white bg-gray-500 rounded-full px-2 text-xs font-bold">?</span>
                            <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-black text-white text-sm rounded shadow-lg top-full mt-1">
                                e.g. Amazon Registry
                            </div>
                        </div>
                    </div>

                    <Input
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="bg-beige text-black border border-pink-300"
                        placeholder="Enter Registry Provider"
                        disabled={form.isSubmitted}
                    />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Label className="text-black font-bold pb-6 pt-6 text-lg">URL</Label>
                        <div className="relative group cursor-pointer">
                            <span className="text-white bg-gray-500 rounded-full px-2 text-xs font-bold">?</span>
                            <div className="absolute z-10 hidden group-hover:block max-w-xl p-2 bg-black text-white text-sm rounded shadow-lg top-full mt-1">
                                e.g. https://www.amazon.com/wedding/james-maria
                            </div>
                        </div>
                    </div>
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-beige text-black border border-pink-300"
                        placeholder="Enter URL"
                        disabled={form.isSubmitted}
                    />
                </div>

                <Button onClick={addRegistry} className="bg-pink-400 text-white font-bold">
                    Add Registry
                </Button>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-black mb-4">Your Registries</h3>
                {(form.registries || []).length === 0 ? (
                    <p className="text-gray-600">No registries added yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {form.registries.map((entry, index) => (
                            <li
                                key={index}
                                className="bg-white rounded-md shadow-md p-4 flex justify-between items-center border border-gray-300"
                            >
                                <div>
                                    <p className="font-semibold text-black">{entry.label}</p>
                                    <a href={entry.url} target="_blank" className="text-blue-600 underline">
                                        {entry.url}
                                    </a>
                                </div>
                                <Button
                                    variant="outline"
                                    className="text-red-500 border border-red-300 hover:bg-red-50"
                                    onClick={() => deleteRegistry(index)}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex justify-start gap-4 pt-4 pb-6">
                    <Button variant="outline" className="font-bold" onClick={goBack}>
                        Back
                    </Button>
                    <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
