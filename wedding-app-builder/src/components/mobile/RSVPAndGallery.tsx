// components/steps/RSVPAndGallery.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RSVPAndGallery({ form, handleChange, goNext, goBack }: any) {
    const isSubmitted = form.isSubmitted;
    return (
        <div className="max-w-xxl space-y-4">
            <h2 className="text-2xl font-semibold text-blue-400">RSVP & Gallery</h2>
            {form.enableRSVP && (
                <div>
                    <Label className="text-black pb-2 font-bold">RSVP Google Sheet Link</Label>
                    <Input
                        value={form.rsvpSheetUrl}
                        onChange={(e) => handleChange("rsvpSheetUrl", e.target.value)}
                        disabled={isSubmitted}
                    />
                </div>
            )}
            {form.enableGallery && (
                <div>
                    <Label className="text-black pb-2 font-bold">Gallery Google Drive Folder Link</Label>
                    <Input
                        value={form.galleryDriveUrl}
                        onChange={(e) => handleChange("galleryDriveUrl", e.target.value)}
                        disabled={isSubmitted}
                    />
                </div>
            )}
            <div className="flex justify-start gap-4 pt-4">
                <Button variant="outline" className="font-bold" onClick={goBack}>Back</Button>
                <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>Next</Button>
            </div>
        </div>
    );
}
