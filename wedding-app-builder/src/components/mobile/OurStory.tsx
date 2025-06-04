"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";
import { X } from "lucide-react";

interface OurStoryProps {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;

}

const OurStory: React.FC<OurStoryProps> = ({ form, setForm }) => {
    const isSubmitted = form.isSubmitted;

    const handleAddParagraph = () => {
        setForm(prev => ({
            ...prev,
            storyParagraphs: [...(prev.storyParagraphs || []), ""],
        }));
    };

    const handleRemoveParagraph = (index: number) => {
        const updated = [...(form.storyParagraphs || [])];
        updated.splice(index, 1);
        setForm(prev => ({ ...prev, storyParagraphs: updated }));
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

    const handleRemoveImage = (index: number) => {
        const updated = [...(form.storyImages || [])];
        updated.splice(index, 1);
        setForm(prev => ({ ...prev, storyImages: updated }));
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
        <div className="max-w-2xl space-y-8 text-[#E4D7DE]">
            <h2 className="text-2xl font-semibold text-pink-400">Our Story</h2>

            <div className="space-y-4">
                {(form.storyParagraphs || []).map((text, idx) => (
                    <div key={idx} className="relative">
                        <Textarea
                            className="bg-beige text-black border border-pink-300 pr-10"
                            value={text}
                            onChange={(e) => handleParagraphChange(idx, e.target.value)}
                            placeholder={`Paragraph ${idx + 1}`}
                            disabled={isSubmitted}
                        />
                        {!isSubmitted && (
                            <button
                                onClick={() => handleRemoveParagraph(idx)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                aria-label="Remove paragraph"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <Button onClick={handleAddParagraph} className="bg-pink-400 text-black font-bold" disabled={isSubmitted}>
                    + Add Paragraph
                </Button>
            </div>

            <div className="space-y-4">
                {(form.storyImages || []).map((img, idx) => (
                    <div key={idx} className="space-y-2 border p-4 rounded-md relative">
                        {!isSubmitted && (
                            <button
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                aria-label="Remove image"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <Label className="text-black">Image {idx + 1}</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)}
                            className="bg-beige text-black border border-pink-300"
                            disabled={isSubmitted}
                        />
                        <Input
                            placeholder="Caption"
                            value={img.caption}
                            onChange={(e) => handleCaptionChange(idx, e.target.value)}
                            className="bg-beige text-black border border-pink-300"
                            disabled={isSubmitted}
                        />
                    </div>
                ))}
                <Button onClick={handleAddImage} className="bg-pink-400 text-black font-bold" disabled={isSubmitted}>
                    + Add Image
                </Button>
            </div>
        </div>
    );
};

export default OurStory;
