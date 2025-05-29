"use client";

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { FormState } from "@/types/FormState";

type Props = {
    form: FormState;
    goNext: () => void;
    goBack: () => void;
};

const fontOptions = ["Serif", "Sans", "Script"] as const;
const colorOptions = ["#A17956", "#EECAC4", "#B0848B", "#826056", "#3C314D"];
const layoutOptions = ["layout1", "layout2"];

const Themes: React.FC<Props> = ({ form, goNext, goBack }) => {
    const [selectedFont, setSelectedFont] = useState(form.selectedFont || "Script");
    const [selectedColor, setSelectedColor] = useState(form.selectedColor || colorOptions[0]);
    const [selectedLayout, setSelectedLayout] = useState(form.selectedLayout || "layout1");

    const generateAIImage = async (prompt: string): Promise<string> => {
        await new Promise((res) => setTimeout(res, 1000)); // simulate delay
        return "https://source.unsplash.com/800x600/?floral,wedding";
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-pink-400">Build & Customize</h2>
            <div className="flex flex-col lg:flex-row gap-4">

                {/* Left Column */}
                <div className="flex-1 max-w-2xl bg-petal p-6 rounded-xl space-y-6">

                    {/* Font Selector */}
                    <div>
                        <p className="mb-2 font-serif text-lg">Font Style</p>
                        <div className="flex gap-4 flex-wrap">
                            {fontOptions.map((font) => (
                                <button
                                    key={font}
                                    className={classNames(
                                        "px-4 py-2 rounded-md border font-medium transition",
                                        selectedFont === font
                                            ? "border-mauve bg-white text-cocoa"
                                            : "border-gray-300 hover:border-mauve"
                                    )}
                                    onClick={() => setSelectedFont(font)}
                                >
                                    <span className={font === "Script" ? "italic" : ""}>{font}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <p className="mb-2 font-serif text-lg">Color Palette</p>
                        <div className="flex gap-4">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className={classNames(
                                        "w-8 h-8 rounded-full border-2 transition-all",
                                        selectedColor === color
                                            ? "border-white shadow-lg"
                                            : "border-gray-300 hover:border-mauve"
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Background Image Selection */}
                    <div>
                        <p className="mb-2 font-serif text-lg">App Background</p>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1 text-black font-medium">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        // handleChange("backgroundImage", file as unknown as string | boolean);
                                    }}
                                    className="text-black bg-white border rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-black font-medium">Or use AI to generate</label>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const prompt = "Floral wedding background in soft pastels";
                                        const generatedImageUrl = await generateAIImage(prompt);
                                        // handleChange("backgroundImage", generatedImageUrl);
                                    }}
                                    className="bg-mauve text-white px-4 py-2 rounded-md hover:brightness-110"
                                >
                                    Generate AI Background
                                </button>
                            </div>

                            {form.backgroundImage && (
                                <div className="mt-4">
                                    <p className="text-black font-medium">Selected Background:</p>
                                    <img
                                        src={
                                            typeof form.backgroundImage === "string"
                                                ? form.backgroundImage
                                                : URL.createObjectURL(form.backgroundImage)
                                        }
                                        alt="Selected Background"
                                        className="w-full h-auto max-h-64 mt-2 rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 pt-12">
                        <button
                            onClick={goBack}
                            className="border border-mauve text-cocoa font-bold px-4 py-2 rounded-md hover:text-black transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={goNext}
                            className="bg-pink-400 text-white font-bold px-4 py-2 rounded-md hover:brightness-110 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Right Column – Preview */}
                <div className="flex justify-center items-start">
                    <div
                        className="relative shadow-2xl rounded-[40px] w-[300px] h-[600px] overflow-hidden border-[6px] border-gray-200 text-black"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <div className="p-6 pt-8 overflow-y-auto pb-20 h-full">
                            <div className="flex flex-col items-center text-center">
                                <p
                                    className={classNames(
                                        selectedFont === "Script"
                                            ? "italic font-serif"
                                            : selectedFont === "Sans"
                                                ? "font-sans"
                                                : "font-serif",
                                        "text-2xl text-black py-20"
                                    )}
                                >
                                    {form.coupleName || "Your Names"}
                                </p>
                                <p className="text-black text-xl mt-2">
                                    Our special date: <br />
                                    {new Date(`${form.weddingDate}T00:00:00`).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Themes;
