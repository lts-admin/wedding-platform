export type FamilyMember = {
    name: string;
    relation: string;
    image: File | null;
};

export interface EventDetails {
    id: string; // <-- Add this line
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    dressCode: string;
}

export type WeddingPartyMember = {
    name: string;
    role: string;
    relation: string;
    image: File | null;
};

export interface PartyMember {
    name: string;
    role: string;
    relation: string;
    image: File | null;
}


export type FormState = {
    coupleName: string;
    weddingDate: string;
    weddingLocation: string;
    appName: string;
    enableRSVP: boolean;
    rsvpSheetUrl: string;
    enableGallery: boolean;
    galleryDriveUrl: string;
    enableFamily: boolean;
    enableSaveDate: boolean,
    enableStory: boolean;
    enableTravel: boolean;
    hotelDetails: string[];
    venueDetails: string[];
    familyDetails: {
        bride: FamilyMember[];
        groom: FamilyMember[];
        pets: { name: string; image: File | null }[];
    };
    enableItinerary: boolean;
    itineraryWedding: string;
    itineraryBride: string;
    itineraryGroom: string;
    enableSettings: boolean;
    faqs: { question: string; answer: string }[];
    contactInfo: { name: string, phone: string, email: string }[];
    storyParagraphs: string[];
    storyImages: { file: File | null; caption: string }[];
    enableWeddingParty: boolean;
    weddingParty: {
        bride: PartyMember[];
        groom: PartyMember[];
    };
    weddingEvents: EventDetails[];
    brideEvents: EventDetails[];
    groomEvents: EventDetails[];
    enablePassword: boolean;
    appPassword?: string;
    saveTheDateImage: File | null;
    enableCountdown: boolean;
    isHomeScreen: boolean;
    showRSVPButton: boolean;
    enableRegistry: boolean;
    isSubmitted: boolean,
    enableAdminPassword: boolean,
    adminAppPassword?: string,
    selectedFont: "Serif" | "Sans" | "Script";
    selectedColor: string;
    selectedLayout: string;
    backgroundImage: string | File | null;
    enableRSVPNotification: boolean;
    enableEventNotification: boolean;
    enablePlannerUpdates: boolean;
    rsvpDeadline?: string;
    registries: { label: string; url: string }[];
};
