'use client';
import { useState, useEffect } from "react";
import { signup, login, loginWithGoogle } from "@/lib/authService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import Link from "next/link";
import Image
    from "next/image";

export default function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [updatesOptIn, setUpdatesOptIn] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/app-info");
            }
        });

        return () => unsubscribe();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (isSignup && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            if (isSignup) {
                await signup(email, password, name, updatesOptIn);
                alert("A verification link has been sent to your email. Please verify to continue.");
                router.push("/log-in")
            } else {
                await login(email, password);
                router.push("/app-info");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-[#140A0A] text-white flex items-center justify-center px-4">
            <header className="absolute top-6 left-6">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <a href="/">WedDesigner</a>
                </div>
            </header>
            <div className="w-full max-w-md p-8 bg-[#1E0F0F] rounded-2xl shadow-lg">
                <h1 className="text-3xl font-semibold text-pink-500 mb-6 text-center">
                    {isSignup ? "Create an Account" : "Welcome Back"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignup && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#2A1A1A] text-white border border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#2A1A1A] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#2A1A1A] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />

                    {isSignup && (
                        <>
                            <input
                                type="password"
                                placeholder="Re-enter Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-xl bg-[#2A1A1A] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />

                            <label className="flex items-center text-sm text-gray-300">
                                <input
                                    type="checkbox"
                                    checked={updatesOptIn}
                                    onChange={() => setUpdatesOptIn(!updatesOptIn)}
                                    className="mr-2 accent-pink-500"
                                />
                                I want to receive updates about my app via email
                            </label>
                        </>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-pink-500 text-black font-bold text-lg hover:bg-pink-400 transition"
                    >
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-300">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-pink-400 underline ml-1"
                    >
                        {isSignup ? "Log in" : "Sign up"}
                    </button>
                </p>
                <div className="my-6 text-center">
                    <button
                        onClick={async () => {
                            try {
                                await loginWithGoogle();
                                router.push("/app-info");
                            } catch (err: any) {
                                setError(err.message);
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-600 text-white hover:bg-[#2A1A1A] transition"
                    >
                        <Image
                            src="/google-icon.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />                        <span className="font-medium">Continue with Google</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
