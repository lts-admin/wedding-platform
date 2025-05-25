import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Sign up and store extra data in Firestore
export async function signup(email: string, password: string, name: string, updatesOptIn: boolean) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        updatesOptIn,
        createdAt: new Date().toISOString(),
    });

    await sendEmailVerification(user);

    return user;
}

// Login and ensure email is verified
export async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
    }

    return user;
}

export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Optional: store user data in Firestore if not already stored
    await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        updatesOptIn: false,
        provider: "google",
        createdAt: new Date().toISOString(),
    }, { merge: true });

    return user;
}
