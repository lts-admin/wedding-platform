// OurFamily.tsx (with trash icon delete button next to each member)
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormState, FamilyMember } from "@/types/FormState";
import Image from "next/image";
import { Trash2 } from "lucide-react";

type FamilySide = "bride" | "groom";

type Props = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

const OurFamily: React.FC<Props> = ({ form, setForm }) => {
    const isSubmitted = form.isSubmitted;
    const [openModalIndex, setOpenModalIndex] = useState<{ side: FamilySide; index: number } | null>(null);

    const addMember = (side: FamilySide) => {
        setForm((prev) => {
            const updated = [...prev.familyDetails[side], { name: "", relation: "", image: null }];
            setTimeout(() => setOpenModalIndex({ side, index: updated.length - 1 }), 0);
            return {
                ...prev,
                familyDetails: { ...prev.familyDetails, [side]: updated },
            };
        });
    };

    const removeMember = (side: FamilySide, index: number) => {
        if (openModalIndex?.side === side && openModalIndex.index === index) {
            setOpenModalIndex(null);
        }
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

    const renderFamilySide = (side: FamilySide, label: string) => (
        <div key={side} className="space-y-4 pt-8">
            <div className="flex justify-between items-center">
                <h2 className="text-black text-lg pb-2 font-bold">{label}</h2>
                <Button
                    className="bg-pink-400 text-white font-bold text-sm px-3 py-1"
                    size="sm"
                    onClick={() => addMember(side)}
                    disabled={isSubmitted}
                >
                    + Add
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {form.familyDetails[side].map((member, index) => {
                    const isOpen = openModalIndex?.side === side && openModalIndex.index === index;
                    return (
                        <Dialog key={index} open={isOpen} onOpenChange={(open) => { if (!open) setOpenModalIndex(null); }}>
                            <div className="relative">
                                <DialogTrigger asChild>
                                    <div className="border rounded p-4 bg-white cursor-pointer hover:shadow" onClick={() => setOpenModalIndex({ side, index })}>
                                        <div className="text-center space-y-1">
                                            {member.image && typeof member.image !== "string" ? (
                                                <Image
                                                    src={URL.createObjectURL(member.image)}
                                                    alt={member.name || "Preview"}
                                                    width={80}
                                                    height={80}
                                                    className="mx-auto rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                                    No Photo
                                                </div>
                                            )}
                                            <p className="font-semibold text-pink-900">{member.name || "Unnamed"}</p>
                                            <p className="text-sm text-gray-700 italic">{member.relation || "Relation not set"}</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                {!isSubmitted && (
                                    <button
                                        onClick={() => removeMember(side, index)}
                                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                            <DialogContent className="space-y-4 max-w-xl bg-[#FFF5F7] text-black !bg-opacity-100 !backdrop-blur-none shadow-xl border border-gray-300 rounded-xl">
                                <DialogTitle className="text-lg font-bold text-center">Add Family Member</DialogTitle>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Name"
                                        value={member.name}
                                        onChange={(e) => updateMember(side, index, "name", e.target.value)}
                                        disabled={isSubmitted}
                                    />
                                    <Input
                                        placeholder="Relation"
                                        value={member.relation}
                                        onChange={(e) => updateMember(side, index, "relation", e.target.value)}
                                        disabled={isSubmitted}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => updateMember(side, index, "image", e.target.files?.[0] || null)}
                                        disabled={isSubmitted}
                                    />
                                    <Button
                                        onClick={() => setOpenModalIndex(null)}
                                        className="bg-pink-400 text-white text-xs font-bold hover:bg-pink-500"
                                        disabled={isSubmitted}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-semibold text-black">Our Family</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {renderFamilySide("bride", "Bride's Side")}
                {renderFamilySide("groom", "Groom's Side")}
            </div>

            <div>
                <h2 className="text-black pb-2 pt-6 font-bold">Pets</h2>
                {/* Pets logic unchanged */}
            </div>
        </div>
    );
};

export default OurFamily;
