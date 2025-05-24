"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormState } from "@/types/FormState";

type Props = {
    form: FormState;
    handleChange: (field: keyof FormState, value: string | boolean) => void;
    goNext: () => void;
    goBack: () => void;
};

const Settings: React.FC<Props> = ({ form, handleChange, goNext, goBack }) => {
    const isSubmitted = form.isSubmitted;
    if (!form.enableSettings) return null;

    return (
        <div className="max-w-xxl space-y-6">
            <h2 className="text-2xl font-semibold text-pink-400">Settings</h2>

            <div>
                <Label htmlFor="faqs" className="text-pink-500 pb-2 font-semibold">FAQs</Label>
                <Textarea
                    id="faqs"
                    placeholder="Enter FAQs..."
                    value={form.faqs}
                    onChange={(e) => handleChange("faqs", e.target.value)}
                    disabled={isSubmitted}
                />
            </div>

            <div>
                <Label htmlFor="contactInfo" className="text-pink-500 pb-2 font-semibold">Contact Information</Label>
                <Textarea
                    id="contactInfo"
                    placeholder="Enter contact information..."
                    value={form.contactInfo}
                    onChange={(e) => handleChange("contactInfo", e.target.value)}
                    disabled={isSubmitted}
                />
            </div>

            <div>
                <Label className="text-pink-500 font-semibold">App Password Protection</Label>
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="enablePassword"
                        checked={form.enablePassword || false}
                        onChange={(e) => handleChange("enablePassword", e.target.checked)}
                        className="w-4 h-4"
                        disabled={isSubmitted}
                    />
                    <label htmlFor="enablePassword" className="text-white-500">
                        Enable password for app access
                    </label>
                </div>

                {form.enablePassword && (
                    <div className="mt-4">
                        <Label htmlFor="appPassword" className="text-pink-500 font-semibold">Password</Label>
                        <Input
                            type="text"
                            id="appPassword"
                            placeholder="Enter app password"
                            value={form.appPassword || ""}
                            onChange={(e) => handleChange("appPassword", e.target.value)}
                            className="mt-1"
                            disabled={isSubmitted}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-start gap-4 pt-4">
                <Button variant="outline" className="font-bold" onClick={goBack}>Back</Button>
                <Button className="bg-purple-500 text-black font-bold" onClick={goNext}>Next</Button>
            </div>
        </div>
    );
};

export default Settings;
