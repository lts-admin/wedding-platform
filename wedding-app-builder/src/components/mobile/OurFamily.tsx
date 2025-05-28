"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormState, FamilyMember } from "@/types/FormState";
import Image from "next/image";

type FamilySide = "bride" | "groom";

type Props = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
};

export default function OurFamily({ form, setForm, goNext, goBack }: Props) {
    const isSubmitted = form.isSubmitted;

    const addMember = (side: FamilySide) => {
        setForm((prev) => {
            const updated = [...prev.familyDetails[side], { name: "", relation: "", image: null }];
            return {
                ...prev,
                familyDetails: { ...prev.familyDetails, [side]: updated },
            };
        });
    };

    const removeMember = (side: FamilySide, index: number) => {
        setForm((prev) => {
            const updated = [...prev.familyDetails[side]];
            updated.splice(index, 1);
            return {
                ...prev,
                familyDetails: { ...prev.familyDetails, [side]: updated },
            };
        });
    };

    const updateMember = (side: FamilySide, index: number, field: keyof FamilyMember, value: any) => {
        setForm((prev) => {
            const updated = [...prev.familyDetails[side]];
            updated[index] = { ...updated[index], [field]: value };
            return {
                ...prev,
                familyDetails: { ...prev.familyDetails, [side]: updated },
            };
        });
    };

    const updatePets = (value: { name: string; image: File | null }[]) => {
        setForm((prev) => ({
            ...prev,
            familyDetails: { ...prev.familyDetails, pets: value },
        }));
    };

    return (
        <div className="space-y-6 pt-20 lg:pt-10 px-4">
            <h2 className="text-2xl font-semibold text-blue-400">Our Family Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {["bride", "groom"].map((side) => (
                    <div key={side} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-black pb-2 font-bold">
                                {side === "bride" ? "Bride's Side" : "Groom's Side"}
                            </h2>
                            <Button
                                className="bg-pink-400 text-black font-bold text-sm px-3 py-1"
                                size="sm"
                                onClick={() => addMember(side as FamilySide)}
                                disabled={isSubmitted}
                            >
                                + Add
                            </Button>
                        </div>
                        {form.familyDetails[side as FamilySide].map((member: FamilyMember, index: number) => (
                            <div key={index} className="border rounded p-3 mb-4">
                                <Input
                                    placeholder="Name"
                                    value={member.name}
                                    onChange={(e) => updateMember(side as FamilySide, index, "name", e.target.value)}
                                    className="mb-2 bg-beige text-black font-bold px-3 py-2 text-sm rounded w-full"
                                    disabled={isSubmitted}
                                />
                                <Input
                                    placeholder="Relation"
                                    value={member.relation}
                                    onChange={(e) => updateMember(side as FamilySide, index, "relation", e.target.value)}
                                    className="mb-2 bg-beige text-black font-bold px-3 py-2 text-sm rounded w-full"
                                    disabled={isSubmitted}
                                />
                                <div className="space-y-2">
                                    <label className="block cursor-pointer bg-beige text-xs text-red-500 font-bold rounded px-3 py-2 text-center hover:bg-pink-100 transition">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                updateMember(side as FamilySide, index, "image", file);
                                            }}
                                            className="border-black  5px "
                                            disabled={isSubmitted}
                                        />
                                    </label>

                                    {member.image && typeof member.image !== "string" && (
                                        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                                            <Image
                                                src={URL.createObjectURL(member.image)}
                                                alt="Preview"
                                                width={80}
                                                height={80}
                                                className="object-cover rounded border border-pink-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateMember(side as FamilySide, index, "image", null)}
                                                className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-red-600 font-bold hover:bg-red-100"
                                                title="Remove Image"
                                                disabled={isSubmitted}
                                            >
                                                –
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={() => removeMember(side as FamilySide, index)}
                                        className="bg-white text-xs text-red-500 font-bold hover:underline"
                                        disabled={isSubmitted}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-black pb-2 font-bold">Pets</h2>
                {form.familyDetails.pets.map((pet, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 mb-4 bg-beige p-3 rounded border border-pink-400"
                    >
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <Input
                                value={pet.name}
                                placeholder="Pet Name - Type"
                                onChange={(e) => {
                                    const newPets = [...form.familyDetails.pets];
                                    newPets[index].name = e.target.value;
                                    updatePets(newPets);
                                }}
                                className="text-white font-bold px-3 py-2 text-sm rounded w-full"
                                disabled={isSubmitted}
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    const newPets = [...form.familyDetails.pets];
                                    newPets.splice(index, 1);
                                    updatePets(newPets);
                                }}
                                className="bg-white text-xs text-red-500 font-bold hover:underline"
                                disabled={isSubmitted}
                            >
                                Remove
                            </Button>
                        </div>

                        <label className="block cursor-pointer bg-white text-xs text-red-500 font-bold rounded px-3 py-1 text-center w-fit hover:bg-pink-100 transition">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    const newPets = [...form.familyDetails.pets];
                                    newPets[index].image = file;
                                    updatePets(newPets);
                                }}
                                disabled={isSubmitted}
                            />
                        </label>

                        {pet.image && typeof pet.image !== "string" && (
                            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                                <Image
                                    src={URL.createObjectURL(pet.image)}
                                    alt="Pet Preview"
                                    width={80}
                                    height={80}
                                    className="object-cover rounded border border-pink-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPets = [...form.familyDetails.pets];
                                        newPets[index].image = null;
                                        updatePets(newPets);
                                    }}
                                    className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-red-600 font-bold hover:bg-red-100"
                                    title="Remove Image"
                                    disabled={isSubmitted}
                                >
                                    –
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <Button
                    className="bg-pink-400 text-black font-bold text-sm px-3 py-1"
                    size="sm"
                    onClick={() => updatePets([...form.familyDetails.pets, { name: "", image: null }])}
                    disabled={isSubmitted}
                >
                    + Add Pet
                </Button>
            </div>

            <div className="flex justify-start gap-4 pt-4">
                <Button variant="outline" className="text-black font-bold" onClick={goBack}>
                    Back
                </Button>
                <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>
                    Next
                </Button>
            </div>
        </div>
    );
}
