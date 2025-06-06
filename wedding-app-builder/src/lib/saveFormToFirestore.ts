import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { FormState } from "@/types/FormState";
import { User } from "firebase/auth";

export async function saveFormToFirestore(user: User, form: FormState) {
    if (!user) return;

    // Clone the form to avoid mutating the original
    const formCopy: any = { ...form };

    // Upload image if needed
    if (form.saveTheDateImage instanceof File) {
        try {
            const imageRef = ref(storage, `weddingApps/${user.uid}/saveTheDateImage.jpg`);
            await uploadBytes(imageRef, form.saveTheDateImage);
            const downloadURL = await getDownloadURL(imageRef);
            formCopy.saveTheDateImageUrl = downloadURL;
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    }

    // ✅ Prevent storing the actual File object in Firestore
    formCopy.saveTheDateImage = null;

    // Add timestamp
    formCopy.updatedAt = new Date().toISOString();

    // ✅ Save only serializable data
    await setDoc(doc(db, "weddingApps", user.uid), formCopy, { merge: true });
}
