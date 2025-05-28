'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { WorkStatus, WorkStatusType } from '@/types/WorkStatus';
import Link from 'next/link';

export default function DesignerSettings() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authStatus, setAuthStatus] = useState<WorkStatusType | null>(null);
    const [firestoreName, setFirestoreName] = useState<string | null>(null);
    const [editableEmail, setEditableEmail] = useState<string>("");

    useEffect(() => {
        if (!loading && !user) {
            router.push('/log-in');
        }
    }, [loading, user, router]);


    useEffect(() => {
        const fetchAppStatus = async () => {
            if (!user) return;

            setEditableEmail(user.email || "");

            // Get all workRequests and find the one matching the user's ID
            const workRequestsSnap = await getDocs(collection(db, 'workRequests'));
            const matchedDoc = workRequestsSnap.docs.find(doc => doc.data().userId === user.uid);

            if (matchedDoc) {
                console.log("Matched WorkRequest:", matchedDoc.data());
                setAuthStatus(matchedDoc.data().authStatus || null);
            } else {
                console.log("No work request found for this user");
            }

            // Fetch name from users collection
            const userRef = doc(db, 'users', user.uid);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData.name) {
                    setFirestoreName(userData.name);
                }
            }
        };

        if (user) fetchAppStatus();
    }, [user]);


    const stepLabels = [
        authStatus === WorkStatus.Submitted || !authStatus ?
            (authStatus === WorkStatus.Submitted ? "Submitted" : "Not Submitted")
            : null,
        WorkStatus.TestFlightPending,
        WorkStatus.TestFlightSent,
        WorkStatus.WaitingForUserFeedback,
        WorkStatus.InReviewByUser,
        WorkStatus.ChangesInProgress,
        WorkStatus.ReadyForFinalApproval,
        WorkStatus.ApprovedForAppStore,
        WorkStatus.SubmittedToAppStore,
        WorkStatus.AppStoreRejected,
        WorkStatus.ReleasedByApple
    ].filter(Boolean); // removes null if first label is excluded


    const cancellableStatuses = new Set<WorkStatusType>([
        WorkStatus.Submitted,
        WorkStatus.TestFlightPending,
        WorkStatus.TestFlightSent,
        WorkStatus.WaitingForUserFeedback,
        WorkStatus.InReviewByUser,
        WorkStatus.ChangesInProgress,
        WorkStatus.ReadyForFinalApproval,
        WorkStatus.ApprovedForAppStore,
        WorkStatus.SubmittedToAppStore
    ]);
    const getProgressStep = () => {
        if (!authStatus) return 0;
        const index = stepLabels.indexOf(authStatus);
        return index >= 0 ? index : 0;
    };



    const handleLogout = async () => {
        try {
            router.push("/");
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handlePasswordReset = async () => {
        if (user?.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
                alert("Password reset email sent!");
            } catch (error) {
                console.error("Password reset error:", error);
                alert("Failed to send reset email.");
            }
        }
    };

    const handleCancelRequest = async () => {
        if (!user) return;

        const confirmed = window.confirm("Are you sure you want to cancel your app submission? This cannot be undone.");
        if (!confirmed) return;

        try {
            const requestRef = doc(db, 'workRequests', user.uid);
            await updateDoc(requestRef, {
                authStatus: WorkStatus.Cancelled
            });
            setAuthStatus(WorkStatus.Cancelled);
            alert("Your submission has been cancelled.");
        } catch (error) {
            console.error("Cancellation failed:", error);
            alert("An error occurred while cancelling. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-[#140A0A] text-white px-6 py-12">
            <header className="absolute top-6 left-6">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
            </header>
            <div className="max-w-2xl mx-auto bg-[#1E0F0F] p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-pink-500 mb-6">My Account</h1>

                {user && (
                    <div className="mb-8 space-y-4">
                        {firestoreName && (
                            <p className="text-white font-bold text-xl">{firestoreName}</p>
                        )}
                        {!firestoreName && user.displayName && (
                            <p className="text-white font-medium">{user.displayName}</p>
                        )}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <Input
                                type="email"
                                value={editableEmail}
                                onChange={(e) => setEditableEmail(e.target.value)}
                                className="bg-[#1A1A1A] border border-gray-500 text-white"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={handlePasswordReset}
                            className="text-sm border border-gray-500 hover:bg-gray-800"
                        >
                            Change Password
                        </Button>
                    </div>
                )}

                <h2 className="text-lg font-semibold mb-4 text-white">App Progress</h2>

                <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden text-xs font-semibold w-full max-w-sm mx-auto">
                    {stepLabels.map((label, index) => {
                        const activeStep = getProgressStep();
                        console.log("act", activeStep);
                        const isCompleted = index < activeStep;
                        const isCurrent = index === activeStep;

                        return (
                            <div
                                key={label}
                                className={`w-full px-4 py-3 border-b last:border-b-0 transition-colors duration-300 ${isCurrent
                                    ? 'bg-pink-500 text-black font-bold'
                                    : isCompleted
                                        ? 'bg-[#3c3c3c] text-green-400'
                                        : 'bg-[#1e1e1e] text-gray-400'
                                    }`}
                            >
                                <span className="block">
                                    {index + 1}. {label}
                                </span>
                            </div>
                        );
                    })}
                </div>



                <div className="mt-6 flex justify-center gap-4">
                    <Button
                        variant="outline"
                        className="bg-[#1A1A1A] text-white border border-gray-500 hover:bg-gray-800 px-4 py-2 rounded-md text-sm"
                        onClick={() => router.push("/app-info")}
                    >
                        View My Wedding Details
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="bg-[#1A1A1A] text-white border border-gray-500 hover:bg-gray-800 px-4 py-2 rounded-md text-sm"
                    >
                        Log Out
                    </Button>

                    {authStatus && cancellableStatuses.has(authStatus) && (
                        <Button
                            variant="ghost"
                            onClick={handleCancelRequest}
                            className="text-sm border border-red-500 text-red-500 hover:bg-red-900 px-4 py-2 rounded-md"
                        >
                            Cancel Submission
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="text-white border border-gray-500 hover:bg-gray-800 text-sm"
                        onClick={() => {
                            router.push("/contact-us");
                        }}
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
}