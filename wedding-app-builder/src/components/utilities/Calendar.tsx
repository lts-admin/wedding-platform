"use client";

import {
    Calendar as BigCalendar,
    momentLocalizer,
    SlotInfo,
    Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { View } from "react-big-calendar";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import type { EventDetails, FormState } from "@/types/FormState";

const localizer = momentLocalizer(moment);

type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    type: "weddingEvents" | "brideEvents" | "groomEvents";
    location: string;
    dressCode: string;
    time: string;
    endTime: string;
};

type CalendarPageProps = {
    form: FormState;
    setForm: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function CalendarPage({ form, setForm }: CalendarPageProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState<{ start: Date; end: Date } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [eventTitle, setEventTitle] = useState("");
    const [eventType, setEventType] = useState<CalendarEvent["type"]>("weddingEvents");
    const [eventLocation, setEventLocation] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [eventDressCode, setEventDressCode] = useState("");
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());

    const months = moment.months();
    const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

    const handleSelectSlot = ({ start, end }: SlotInfo) => {
        setSlotInfo({ start, end });
        setEditingId(null);
        setEventTitle("");
        setEventLocation("");
        setEventTime("");
        setEndTime("");
        setEventDressCode("");
        setEventType("weddingEvents");
        setModalOpen(true);
    };

    useEffect(() => {
        const convertToCalendar = (type: CalendarEvent["type"]) => (event: EventDetails): CalendarEvent => ({
            id: event.id,
            start: parseTime(new Date(`${event.date}T12:00:00`), event.startTime),
            end: parseTime(new Date(`${event.date}T12:00:00`), event.endTime),
            title: event.name,
            location: event.location,
            dressCode: event.dressCode,
            time: event.startTime,
            endTime: event.endTime,
            type,
        });


        const allEvents: CalendarEvent[] = [
            ...form.weddingEvents.map(convertToCalendar("weddingEvents")),
            ...form.brideEvents.map(convertToCalendar("brideEvents")),
            ...form.groomEvents.map(convertToCalendar("groomEvents")),
        ];

        setEvents(allEvents);
    }, [form]);

    const parseTime = (date: Date, timeStr: string): Date => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours < 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = "#38a169"; // default green for wedding

        if (event.type === "brideEvents") backgroundColor = "#ed64a6"; // pink
        if (event.type === "groomEvents") backgroundColor = "#4299e1"; // blue

        return {
            style: {
                backgroundColor,
                borderRadius: "6px",
                color: "white",
                border: "none",
                display: "block",
            },
        };
    };

    const handleAddOrUpdateEvent = () => {
        if (!eventTitle || !slotInfo || !eventTime || !endTime) return;

        const startDate = parseTime(slotInfo.start, eventTime);
        const endDate = parseTime(slotInfo.start, endTime);

        const id = editingId ?? uuidv4();

        const newFormEvent: EventDetails = {
            id,
            name: eventTitle,
            date: format(slotInfo.start, "yyyy-MM-dd"),
            startTime: eventTime,
            endTime,
            location: eventLocation,
            dressCode: eventDressCode,
        };

        const newCalendarEvent: CalendarEvent = {
            ...newFormEvent,
            id,
            title: eventTitle,
            start: startDate,
            end: endDate,
            time: eventTime,
            type: eventType,
        };

        const formList = form[eventType];

        const hasConflict = events.some((ev) => {
            if (ev.type !== eventType || ev.id === id) return false;
            return (
                (startDate >= ev.start && startDate < ev.end) ||
                (endDate > ev.start && endDate <= ev.end) ||
                (startDate <= ev.start && endDate >= ev.end)
            );
        });

        if (hasConflict) {
            alert("Time conflict detected with another event of the same type.");
            return;
        }

        const updatedFormArray = editingId
            ? formList.map((e) => (e.id === editingId ? newFormEvent : e))
            : [...formList, newFormEvent];

        // Clone current form
        const updatedForm = { ...form, [eventType]: updatedFormArray };

        // Set weddingDate and weddingLocation if event is "wedding ceremony"
        if (eventTitle.trim().toLowerCase() === "wedding ceremony") {
            console.log(slotInfo.start);
            console.log(slotInfo.start.toString());
            updatedForm.weddingDate = format(slotInfo.start, "yyyy-MM-dd");
            updatedForm.weddingLocation = eventLocation;
        }

        setForm(updatedForm);

        console.log(form)

        setEditingId(null);
        setModalOpen(false);
        setEventTitle("");
        setEventLocation("");
        setEventTime("");
        setEndTime("");
        setEventDressCode("");
    };


    // const handleAddOrUpdateEvent = () => {
    //     if (!eventTitle || !slotInfo || !eventTime || !endTime) return;

    //     const startDate = parseTime(slotInfo.start, eventTime);
    //     const endDate = parseTime(slotInfo.start, endTime);

    //     const id = editingId ?? uuidv4();

    //     const newFormEvent: EventDetails = {
    //         id,
    //         name: eventTitle,
    //         date: format(slotInfo.start, "yyyy-MM-dd"),
    //         startTime: eventTime,
    //         endTime,
    //         location: eventLocation,
    //         dressCode: eventDressCode,
    //     };

    //     const newCalendarEvent: CalendarEvent = {
    //         ...newFormEvent,
    //         id,
    //         title: eventTitle,
    //         start: startDate,
    //         end: endDate,
    //         time: eventTime,
    //         type: eventType,
    //     };

    //     const formList = form[eventType];

    //     const hasConflict = events.some((ev) => {
    //         if (ev.type !== eventType || ev.id === id) return false;
    //         return (
    //             (startDate >= ev.start && startDate < ev.end) ||
    //             (endDate > ev.start && endDate <= ev.end) ||
    //             (startDate <= ev.start && endDate >= ev.end)
    //         );
    //     });

    //     if (hasConflict) {
    //         alert("Time conflict detected with another event of the same type.");
    //         return;
    //     }

    //     const updatedFormArray = editingId
    //         ? formList.map((e) => (e.id === editingId ? newFormEvent : e))
    //         : [...formList, newFormEvent];

    //     setForm({ ...form, [eventType]: updatedFormArray });

    //     setEditingId(null);
    //     setModalOpen(false);
    //     setEventTitle("");
    //     setEventLocation("");
    //     setEventTime("");
    //     setEndTime("");
    //     setEventDressCode("");
    // };

    return (
        <div className="py-6 bg-[#FFF5F7]">
            <div className="flex items-center gap-2">
                <Label className="text-black font-bold text-lg">Wedding Event Calendar</Label>
                <div className="relative group cursor-pointer">
                    <span className="text-white bg-gray-500 rounded-full px-2 text-xs font-bold">?</span>
                    <div className="absolute z-10 hidden group-hover:block max-w-xs w-[280px] p-3 bg-black text-white text-sm rounded shadow-lg top-full mt-1 whitespace-pre-line break-words">
                        Enter all your wedding festivities! Remember to highlight the actual wedding ceremony as event name "Wedding Ceremony"
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mb-4 items-center">
                <select
                    value={currentDate.getMonth()}
                    onChange={(e) => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(parseInt(e.target.value));
                        setCurrentDate(newDate);
                    }}
                    className="border p-2 bg-[#FFF5F7] rounded"
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>

                <select
                    value={currentDate.getFullYear()}
                    onChange={(e) => {
                        const newDate = new Date(currentDate);
                        newDate.setFullYear(parseInt(e.target.value));
                        setCurrentDate(newDate);
                    }}
                    className="border bg-[#FFF5F7] p-2 rounded"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="w-full overflow-x-auto">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    view={currentView}
                    views={["month", "week", "day"]}
                    onView={setCurrentView}
                    date={currentDate}
                    onNavigate={setCurrentDate}
                    style={{ height: 400, width: "100%" }} // ✅ Full width
                    popup
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={(event: CalendarEvent) => {
                        setSlotInfo({ start: event.start, end: event.end });
                        setEventTitle(event.title);
                        setEventType(event.type);
                        setEventLocation(event.location);
                        setEventTime(event.time);
                        setEndTime(event.endTime);
                        setEventDressCode(event.dressCode);
                        setEditingId(event.id);
                        setModalOpen(true);
                    }}
                    eventPropGetter={eventStyleGetter}
                />
            </div>


            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="space-y-4 max-w-xl bg-[#FFF5F7] text-black !bg-opacity-100 !backdrop-blur-none shadow-xl border border-gray-300 rounded-xl">
                    <DialogTitle className="text-lg font-bold text-center">{editingId ? "Update Event" : "Add New Event"}</DialogTitle>

                    {slotInfo && (
                        <p className="text-sm text-center text-gray-600">
                            {format(slotInfo.start, "PPP")} — {format(slotInfo.end, "p")}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Event Name</Label>
                            <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
                        </div>

                        <div>
                            <Label>Event Type</Label>
                            <select
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value as CalendarEvent["type"])}
                                className="w-full border rounded-md px-2 py-2 bg-[#FFF5F7] text-black"
                            >
                                <option value="weddingEvents">Wedding</option>
                                <option value="brideEvents">Bride</option>
                                <option value="groomEvents">Groom</option>
                            </select>
                        </div>

                        <div>
                            <Label>Start Time</Label>
                            <Input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="e.g. 5:00 PM" />
                        </div>
                        <div>
                            <Label>End Time</Label>
                            <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="e.g. 5:00 PM" />
                        </div>

                        <div>
                            <Label>Location</Label>
                            <Input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label>Dress Code</Label>
                            <Input value={eventDressCode} onChange={(e) => setEventDressCode(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddOrUpdateEvent} className="bg-pink-500 text-white font-bold">
                            {editingId ? "Update Event" : "Add Event"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
