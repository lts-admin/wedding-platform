"use client";

import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { FormState } from "@/types/FormState";

type Props = {
    form: FormState;
    handleChange: (field: keyof FormState, value: string | boolean) => void;
    goNext: () => void;
    goBack: () => void;
};

const fontOptions = ["Serif", "Sans", "Script"];
const colorOptions = ["#A17956", "#EECAC4", "#B0848B", "#826056", "#3C314D"];
const layoutOptions = ["layout1", "layout2"];

const Themes: React.FC<Props> = ({ form, handleChange, goNext, goBack }) => {
    const [selectedFont, setSelectedFont] = useState(form.selectedFont || "Script");
    const [selectedColor, setSelectedColor] = useState(form.selectedColor || colorOptions[0]);
    const [selectedLayout, setSelectedLayout] = useState(form.selectedLayout || "layout1");

    // Persist theme selections to form state
    useEffect(() => {
        handleChange("selectedFont", selectedFont);
        handleChange("selectedColor", selectedColor);
        handleChange("selectedLayout", selectedLayout);
    }, [selectedFont, selectedColor, selectedLayout]);

    return (
        <div className="max-w-2xl   bg-petal p-6 rounded-xl space-y-6">
            <h2 className="text-2xl font-semibold text-pink-400">Build & Customize</h2>

            {/* Font Selector */}
            <div>
                <p className="mb-2 font-serif text-lg">Font Style</p>
                <div className="flex gap-4 flex-wrap">
                    {fontOptions.map((font: any) => (
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
                                selectedColor === color ? "border-white shadow-lg" : "border-gray-300 hover:border-mauve"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                        />
                    ))}
                </div>
            </div>

            {/* Layout Selector */}
            <div>
                <p className="mb-2 font-serif text-lg">Layout</p>
                <div className="flex gap-4">
                    {layoutOptions.map((layout) => (
                        <button
                            key={layout}
                            className={classNames(
                                "w-12 h-16 border rounded-md",
                                selectedLayout === layout
                                    ? "border-mauve bg-white"
                                    : "border-gray-300 hover:border-mauve"
                            )}
                            onClick={() => setSelectedLayout(layout)}
                        >
                            <span className="sr-only">{layout}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <div
                className="mt-8 p-6 rounded-xl text-center border border-mauve bg-white"
                style={{ backgroundColor: selectedColor }}
            >
                <p
                    className={classNames(
                        selectedFont === "Script"
                            ? "italic font-serif"
                            : selectedFont === "Sans"
                                ? "font-sans"
                                : "font-serif",
                        "text-2xl text-black"
                    )}
                >
                    {form.coupleName || "Your Names"}
                </p>
                <p className="text-black text-sm mt-2">July 30, 2025</p>
            </div>

            <div className="flex justify-between pt-4">
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
    );
};

export default Themes;
