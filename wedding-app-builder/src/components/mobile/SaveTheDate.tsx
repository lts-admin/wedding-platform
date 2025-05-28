"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SaveTheDateProps {
    goNext: () => void;
    goBack: () => void;
    form: {
        isSubmitted: any;
        saveTheDateImage: File | null;
        enableCountdown: boolean;
        isHomeScreen: boolean;
        showRSVPButton: boolean;
        enableRSVP: boolean; // <-- add this
    };
    setForm: React.Dispatch<React.SetStateAction<any>>;
}

const CustomSwitch = ({
    checked,
    onToggle,
    disabled = false,
}: {
    checked: boolean;
    onToggle: () => void;
    disabled: boolean;
}) => (
    <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${checked ? "bg-pink-500" : "bg-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
        }
    >
        <span
            className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"
                }`}
        />
    </button>
);

const SaveTheDate: React.FC<SaveTheDateProps> = ({
    goNext,
    goBack,
    form,
    setForm,
}) => {
    const isSubmitted = form.isSubmitted;
    const handleToggle = (field: keyof SaveTheDateProps["form"]) => {
        setForm((prev: { [x: string]: any }) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleImageChange = (file: File | null) => {
        setForm((prev: any) => ({ ...prev, saveTheDateImage: file }));
    };

    // 🔁 Sync showRSVPButton with enableRSVP
    useEffect(() => {
        if (form.enableRSVP && !form.showRSVPButton) {
            setForm((prev: any) => ({ ...prev, showRSVPButton: true }));
        }
    }, [form.enableRSVP, form.showRSVPButton, setForm]);

    return (
        <div className="max-w-xxl space-y-8 text-[#E4D7DE]">
            <h2 className="text-2xl font-semibold text-blue-700">Save The Date</h2>

            <div>
                <Label className="text-black pb-2 font-bold">
                    Upload Save The Date Image
                </Label>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="bg-beige text-black border border-pink-300"
                    disabled={isSubmitted}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <Label className="text-black pb-2 font-bold">Enable Countdown</Label>
                    <div className="flex items-center gap-4 pt-2">
                        <CustomSwitch
                            disabled={isSubmitted}
                            checked={form.enableCountdown}
                            onToggle={() => handleToggle("enableCountdown")}

                        />
                        <span className="text-black ">{form.enableCountdown ? "Enabled" : "Disabled"}</span>
                    </div>
                </div>

                <div>
                    <Label className="text-black pb-2 font-bold">Make Home Screen</Label>
                    <div className="flex items-center gap-4 pt-2" >
                        <CustomSwitch
                            disabled={isSubmitted}
                            checked={form.isHomeScreen}
                            onToggle={() => handleToggle("isHomeScreen")}
                        />
                        <span className="text-black ">{form.isHomeScreen ? "Enabled" : "Disabled"}</span>
                    </div>
                </div>

                <div>
                    <Label className="text-black pb-2 font-bold">Insert RSVP Button</Label>
                    <div className="flex items-center gap-4 pt-2">
                        <CustomSwitch
                            disabled={isSubmitted}
                            checked={form.showRSVPButton}
                            onToggle={() => handleToggle("showRSVPButton")}
                        />
                        <span className="text-black ">{form.showRSVPButton ? "Enabled" : "Disabled"}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={goBack} className="text-black font-bold">
                    Back
                </Button>
                <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default SaveTheDate;
