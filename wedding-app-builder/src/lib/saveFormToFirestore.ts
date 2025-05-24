import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { FormState } from "@/types/FormState";
import { User } from "firebase/auth";

export async function saveFormToFirestore(user: User, form: FormState) {
    if (!user) return;

    await setDoc(doc(db, "weddingApps", user.uid), {
        ...form,
        updatedAt: new Date().toISOString(),
    }, { merge: true });
}
