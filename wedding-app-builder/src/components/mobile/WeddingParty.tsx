"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";
import Image from "next/image";
import OurFamily from "./OurFamily";

type WeddingProps = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
};
type Side = "bride" | "groom";

const WeddingParty: React.FC<WeddingProps> = ({ form, setForm, goNext, goBack }) => {
    const isSubmitted = form.isSubmitted;
    const addMember = (side: Side) => {
        setForm((prev) => ({
            ...prev,
            weddingParty: {
                ...prev.weddingParty,
                [side]: [...prev.weddingParty[side], { name: "", role: "", relation: "", image: null }],
            },
        }));
    };

    const removeMember = (side: Side, index: number) => {
        setForm((prev) => {
            const updated = [...prev.weddingParty[side]];
            updated.splice(index, 1);
            return {
                ...prev,
                weddingParty: {
                    ...prev.weddingParty,
                    [side]: updated,
                },
            };
        });
    };

    const updateMember = (
        side: Side,
        index: number,
        field: keyof FormState["weddingParty"]["bride"][0],
        value: string | File | null
    ) => {
        setForm((prev) => {
            const updated = [...prev.weddingParty[side]];
            updated[index] = { ...updated[index], [field]: value };
            return {
                ...prev,
                weddingParty: {
                    ...prev.weddingParty,
                    [side]: updated,
                },
            };
        });
    };

    const renderPartySide = (side: Side, label: string) => (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <h3 className="text-lg font-bold">{label}</h3>
                <Button
                    size="sm"
                    className="bg-pink-400 font-bold text-black w-fit"
                    onClick={() => addMember(side)}
                    disabled={isSubmitted}
                >
                    + Add
                </Button>
            </div>

            {form.weddingParty[side].map((member, index) => (
                <div key={index} className="border p-4 rounded-md space-y-2 relative">
                    <div className="flex justify-between items-center">
                        <h4 className="text-md font-semibold">Member {index + 1}</h4>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeMember(side, index)}
                            className="bg-beige text-xs text-red-500 font-bold hover:underline"
                            disabled={isSubmitted}
                        >
                            Remove
                        </Button>
                    </div>
                    <div>
                        <Label>Name</Label>
                        <Input
                            placeholder="Full Name"
                            value={member.name}
                            className="mb-2 text-black font-bold"
                            onChange={(e) => updateMember(side, index, "name", e.target.value)}
                            disabled={isSubmitted}
                        />
                    </div>
                    <div>
                        <Label>Role</Label>
                        <Input
                            placeholder="e.g., Best Man, Maid of Honor"
                            value={member.role}
                            className="mb-2 text-black font-bold"
                            onChange={(e) => updateMember(side, index, "role", e.target.value)}
                            disabled={isSubmitted}
                        />
                    </div>
                    <div>
                        <Label>Relation</Label>
                        <Input
                            placeholder="e.g., Friend, Cousin"
                            value={member.relation}
                            className="mb-2 text-black font-bold"
                            onChange={(e) => updateMember(side, index, "relation", e.target.value)}
                            disabled={isSubmitted}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block cursor-pointer bg-beige text-xs text-red-500 font-bold rounded px-3 py-2 text-center hover:bg-pink-100 transition">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    updateMember(side, index, "image", e.target.files?.[0] || null)
                                }
                                // className="hidden"
                                disabled={isSubmitted}
                            />
                        </label>

                        {member.image && typeof member.image !== "string" && (
                            <div className="text-black text-xs flex items-center gap-2">
                                <Image
                                    src={URL.createObjectURL(member.image)}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    className="object-cover rounded border border-pink-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => updateMember(side, index, "image", null)}
                                    className="h-6 w-6 flex items-center justify-center rounded-full bg-beige text-red-600 font-bold hover:bg-red-100"
                                    title="Remove Image"
                                    disabled={isSubmitted}
                                >
                                    –
                                </button>
                            </div>
                        )}

                    </div>
                    {/* <div>
                        <Label>Photo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                updateMember(side, index, "image", e.target.files?.[0] || null)
                            }
                        />
                    </div> */}
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-pink-400">Wedding Party</h2>
            <OurFamily form={form} setForm={setForm} />
            <h2 className="text-2xl font-semibold text-black">Bridal Party</h2>

            <div className="grid grid-cols-2 gap-6">
                {renderPartySide("bride", "Bride's Side")}
                {renderPartySide("groom", "Groom's Side")}
            </div>
            <div className="flex justify-start gap-4 pt-4 pb-4">
                <Button variant="outline" className="font-bold" onClick={goBack}>Back</Button>
                <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>Next</Button>
            </div>
        </div>
    );
}

export default WeddingParty;