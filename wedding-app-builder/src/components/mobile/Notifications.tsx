"use client";

import React from "react";
import { Button } from "../ui/button";

type NotificationsProps = {
    form: {
        enableRSVPNotification: boolean;
        enableEventNotification: boolean;
        enablePlannerUpdates: boolean;
        rsvpDeadline?: string; // NEW
    };
    handleChange: (field: string, value: any) => void;
    goNext: () => void;
    goBack: () => void;
};

export default function Notifications({
    form,
    handleChange,
    goNext,
    goBack,
}: NotificationsProps) {
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold text-pink-400">Push Notifications</h2>
                <p className="text-sm text-mauve mt-2">
                    Choose which updates you'd like your guests to receive.
                </p>
            </div>
            <div className="max-w-2xl bg-petal p-6 rounded-lg text-cocoa space-y-6">

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.enableRSVPNotification}
                                onChange={(e) =>
                                    handleChange("enableRSVPNotification", e.target.checked)
                                }
                                className="accent-pink-500 w-4 h-4"
                            />
                            <span className="text-cocoa font-medium">
                                RSVP Notifications
                            </span>
                        </label>

                        {form.enableRSVPNotification && (
                            <div className="ml-6">
                                <label className="block text-sm font-medium mb-1 text-cocoa">
                                    RSVP Deadline Date
                                </label>
                                <input
                                    type="date"
                                    value={form.rsvpDeadline || ""}
                                    onChange={(e) =>
                                        handleChange("rsvpDeadline", e.target.value)
                                    }
                                    className="px-3 py-2 border border-mauve rounded-md bg-white text-cocoa"
                                />
                            </div>
                        )}
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.enableEventNotification}
                            onChange={(e) =>
                                handleChange("enableEventNotification", e.target.checked)
                            }
                            className="accent-pink-500 w-4 h-4"
                        />
                        <span className="text-cocoa font-medium">
                            Wedding Event Notifications
                        </span>
                    </label>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.enablePlannerUpdates}
                            onChange={(e) =>
                                handleChange("enablePlannerUpdates", e.target.checked)
                            }
                            className="accent-pink-500 w-4 h-4"
                        />
                        <span className="text-cocoa font-medium">
                            Updates from Wedding Planner/Couple
                        </span>
                    </label>
                </div>

                <div className="flex justify-start gap-4 pt-12">
                    <Button variant="outline" className="font-bold" onClick={goBack}>
                        Back
                    </Button>
                    <Button className="bg-pink-400 text-white font-bold" onClick={goNext}>
                        Next
                    </Button>
                </div>
            </div>
        </div>

    );
}
