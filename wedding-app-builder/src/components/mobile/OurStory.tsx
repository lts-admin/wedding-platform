"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";

interface OurStoryProps {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
    goNext: () => void;
    goBack: () => void;
}

const OurStory: React.FC<OurStoryProps> = ({ form, setForm, goNext, goBack }) => {
    const isSubmitted = form.isSubmitted;
    const handleAddParagraph = () => {
        setForm(prev => ({
            ...prev,
            storyParagraphs: [...(prev.storyParagraphs || []), ""],
        }));
    };

    const handleParagraphChange = (index: number, value: string) => {
        const updated = [...(form.storyParagraphs || [])];
        updated[index] = value;
        setForm(prev => ({ ...prev, storyParagraphs: updated }));
    };

    const handleAddImage = () => {
        setForm(prev => ({
            ...prev,
            storyImages: [...(prev.storyImages || []), { file: null, caption: "" }],
        }));
    };

    const handleImageChange = (index: number, file: File | null) => {
        const updated = [...(form.storyImages || [])];
        updated[index].file = file;
        setForm(prev => ({ ...prev, storyImages: updated }));
    };

    const handleCaptionChange = (index: number, value: string) => {
        const updated = [...(form.storyImages || [])];
        updated[index].caption = value;
        setForm(prev => ({ ...prev, storyImages: updated }));
    };

    return (
        <div className="max-w-xxl mx-auto space-y-8 text-[#E4D7DE]">
            <h2 className="text-2xl font-semibold text-pink-400">Our Story</h2>

            <div className="space-y-4">
                {(form.storyParagraphs || []).map((text, idx) => (
                    <Textarea
                        key={idx}
                        className="bg-[#1A1A1A] text-white border border-pink-300"
                        value={text}
                        onChange={(e) => handleParagraphChange(idx, e.target.value)}
                        placeholder={`Paragraph ${idx + 1}`}
                        disabled={isSubmitted}
                    />
                ))}
                <Button onClick={handleAddParagraph} className="bg-pink-500 text-black font-bold" disabled={isSubmitted}>
                    + Add Paragraph
                </Button>
            </div>

            <div className="space-y-4">
                {(form.storyImages || []).map((img, idx) => (
                    <div key={idx} className="space-y-2 border p-4 rounded-md">
                        <Label className="text-pink-300">Image {idx + 1}</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)}
                            className="bg-[#1A1A1A] text-white border border-pink-300"
                            disabled={isSubmitted}
                        />
                        <Input
                            placeholder="Caption"
                            value={img.caption}
                            onChange={(e) => handleCaptionChange(idx, e.target.value)}
                            className="bg-[#1A1A1A] text-white border border-pink-300"
                            disabled={isSubmitted}
                        />
                    </div>
                ))}
                <Button onClick={handleAddImage} className="bg-pink-500 text-black font-bold" disabled={isSubmitted}>
                    + Add Image
                </Button>
            </div>

            <div className="flex justify-between">
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

export default OurStory;
