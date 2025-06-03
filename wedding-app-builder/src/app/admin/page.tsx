"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    getFirestore,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { app } from "@/lib/firebaseConfig";
import { WorkStatus } from "@/types/WorkStatus";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const db = getFirestore(app);
const ADMIN_PASSWORD = "wedadmin";
const ASSIGNEE_LIST = ["Satya Vinjamuri ", "John", "Priya"];

const statusColors: Record<string, string> = {
    Submitted: "bg-gray-600",
    "TestFlight Pending": "bg-yellow-600",
    "TestFlight Sent": "bg-yellow-400",
    "Waiting for User Feedback": "bg-blue-400",
    "In Review by User": "bg-indigo-500",
    "Changes in Progress": "bg-purple-500",
    "Ready for Final Approval": "bg-green-500",
    "Approved for App Store": "bg-green-700",
    "Submitted to App Store": "bg-pink-600",
    "App Store Rejected": "bg-red-600",
    "Released by Apple": "bg-teal-500",
    Cancelled: "bg-gray-400"
};

const statusFlow = [
    WorkStatus.Submitted,
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
];

export default function AdminDashboard() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [modalInput, setModalInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [contactRequests, setContactRequests] = useState<any[]>([]);
    const [helpRequests, setHelpRequests] = useState<any[]>([]);
    const [view, setView] = useState("app"); // "app", "contact", or "help"

    useEffect(() => {
        const session = localStorage.getItem("admin-auth");
        if (session) {
            const expiresAt = new Date(session);
            if (new Date() < expiresAt) {
                setAuthenticated(true);
            } else {
                localStorage.removeItem("admin-auth");
            }
        }
    }, []);

    useEffect(() => {
        if (!authenticated) return;

        const fetchData = async () => {
            const workSnap = await getDocs(collection(db, "workRequests"));
            const workData = workSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setRequests(workData);

            const contactSnap = await getDocs(collection(db, "contactRequests"));
            const contactData = contactSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setContactRequests(contactData);

            const helpSnap = await getDocs(collection(db, "helpRequest"));
            const helpData = helpSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setHelpRequests(helpData);

            setLoading(false);
        };

        fetchData();
    }, [authenticated]);

    const handleLogin = () => {
        if (passwordInput === ADMIN_PASSWORD) {
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + (rememberMe ? 1440 : 15)); // 24 hours or 15 min
            localStorage.setItem("admin-auth", expiration.toISOString());
            setAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const filteredRequests =
        filter === "All" ? requests : requests.filter((r) => r.authStatus === filter);

    const moveToNextStatus = async () => {
        if (!selectedRequest) return;
        const currentIndex = statusFlow.indexOf(selectedRequest.authStatus);
        const nextStatus = statusFlow[currentIndex + 1] || selectedRequest.authStatus;

        await updateDoc(doc(db, "workRequests", selectedRequest.id), {
            authStatus: nextStatus,
            feedback: modalInput,
            assignee:
                nextStatus === WorkStatus.TestFlightSent
                    ? selectedRequest.coupleName
                    : selectedRequest.assignee,
            lastUpdated: serverTimestamp(),
            ...(nextStatus === WorkStatus.ReleasedByApple && {
                dateCompleted: serverTimestamp()
            })
        });

        setRequests((prev) =>
            prev.map((r) =>
                r.id === selectedRequest.id
                    ? { ...r, authStatus: nextStatus, feedback: modalInput }
                    : r
            )
        );
        setSelectedRequest(null);
        setModalInput("");
        setShowModal(false);
    };

    const moveBack = async () => {
        if (!selectedRequest) return;
        const currentIndex = statusFlow.indexOf(selectedRequest.authStatus);
        const prevStatus = statusFlow[currentIndex - 1] || selectedRequest.authStatus;

        await updateDoc(doc(db, "workRequests", selectedRequest.id), {
            authStatus: prevStatus,
            feedback: modalInput,
            lastUpdated: serverTimestamp()
        });

        setRequests((prev) =>
            prev.map((r) =>
                r.id === selectedRequest.id
                    ? { ...r, authStatus: prevStatus, feedback: modalInput }
                    : r
            )
        );
        setSelectedRequest(null);
        setModalInput("");
        setShowModal(false);
    };

    const getActionLabel = (status: string) => {
        switch (status) {
            case WorkStatus.Submitted:
                return "Start Task";
            case WorkStatus.TestFlightPending:
                return "Test Flight Sent";
            default:
                return "Complete Task";
        }
    };

    const handlePrimaryAction = async (request: any) => {
        if (request.authStatus === WorkStatus.Submitted) {
            const nextStatus = WorkStatus.TestFlightPending;
            await updateDoc(doc(db, "workRequests", request.id), {
                authStatus: nextStatus,
                lastUpdated: serverTimestamp()
            });

            setRequests((prev) =>
                prev.map((r) =>
                    r.id === request.id
                        ? { ...r, authStatus: nextStatus, lastUpdated: new Date() }
                        : r
                )
            );
        } else {
            setSelectedRequest(request);
            setShowModal(true);
        }
    };

    const handleViewDetails = (userId: string) => {
        if (userId) {
            router.push(`/app-info?adminView=${userId}`);
        }
    };

    const handleRespond = async (id: string) => {
        const assignee = window.prompt(`Assign a responder (e.g. ${ASSIGNEE_LIST.join(", ")})`);
        if (!assignee) return;

        const ref = doc(db, "contactRequests", id);
        await updateDoc(ref, {
            responded: "Yes",
            assignee,
            respondedAt: serverTimestamp(),
        });

        setContactRequests((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, responded: "Yes", assignee, respondedAt: new Date() } : c
            )
        );
    };

    const handleHelpResponse = async (id: string) => {
        const assignee = window.prompt(`Assign a responder (e.g. ${ASSIGNEE_LIST.join(", ")})`);
        if (!assignee) return;

        const ref = doc(db, "helpRequest", id);
        await updateDoc(ref, {
            responded: "Yes",
            assignee,
            respondedAt: serverTimestamp(),
        });

        setHelpRequests((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, responded: "Yes", assignee, respondedAt: new Date() } : c
            )
        );
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white p-6">
                <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Admin Access</h2>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label>Remember Me (24 hrs)</label>
                    </div>
                    <button
                        onClick={handleLogin}
                        className="bg-pink-500 text-white font-bold w-full py-2 rounded"
                    >
                        Enter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <header className="absolute top-6 left-6">
                <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
                    <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
                    <Link href="/">WedDesigner</Link>
                </div>
            </header>
            <div className="pt-16 pb-6 flex gap-4">
                <Button
                    onClick={() => setView("app")}
                    className={`font-bold px-4 py-2 ${view === "app"
                        ? "bg-pink-500 text-black cursor-default"
                        : "bg-gray-700 text-white opacity-50 hover:opacity-70"
                        }`}
                >
                    App Submission Requests
                </Button>
                <Button
                    onClick={() => setView("contact")}
                    className={`font-bold px-4 py-2 ${view === "contact"
                        ? "bg-pink-500 text-black cursor-default"
                        : "bg-gray-700 text-white opacity-50 hover:opacity-70"
                        }`}
                >
                    Contact Requests
                </Button>
                <Button onClick={() => setView("help")} className={`font-bold px-4 py-2 ${view === "help"
                    ? "bg-pink-500 text-black cursor-default"
                    : "bg-gray-700 text-white opacity-50 hover:opacity-70"
                    }`}>Help Requests</Button>

            </div>


            {view === "app" && (
                <div>
                    <h1 className="text-3xl font-bold">App Submission Requests</h1>
                    <div className="mt-4 pb-6">
                        <label className="mr-2">Filter by Status:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1"
                        >
                            <option value="All">All</option>
                            {Object.values(WorkStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    {
                        loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table className="w-full text-sm border border-gray-600">
                                <thead className="bg-gray-800 text-left">
                                    <tr>
                                        <th className="p-2 border-b">ID</th>
                                        <th className="p-2 border-b">Couple</th>
                                        <th className="p-2 border-b">View Wedding Form</th>
                                        <th className="p-2 border-b">Zip URL</th>
                                        <th className="p-2 border-b">Auth Status</th>
                                        <th className="p-2 border-b">Date Created</th>
                                        <th className="p-2 border-b">Last Updated</th>
                                        <th className="p-2 border-b">Actions</th>
                                        <th className="p-2 border-b">Assignee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((r) => (
                                        <tr key={r.id} className="border-t border-gray-700">
                                            <td className="p-2">{r.id}</td>
                                            <td className="p-2">{r.coupleName}</td>
                                            <td className="p-2">
                                                <button
                                                    className="text-blue-400 underline"
                                                    onClick={() => handleViewDetails(r.userId)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                            <td className="p-2">
                                                <a
                                                    href={r.zipFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 underline"
                                                >
                                                    Download
                                                </a>
                                            </td>
                                            <td className="p-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-bold ${statusColors[r.authStatus] || "bg-gray-500"}`}
                                                >
                                                    {r.authStatus}
                                                </span>
                                            </td>
                                            <td className="p-2">
                                                {r.dateCreated?.toDate?.().toLocaleString() || "-"}
                                            </td>
                                            <td className="p-2">
                                                {r.lastUpdated?.toDate?.().toLocaleString() || "-"}
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handlePrimaryAction(r)}
                                                    className="bg-pink-500 text-white font-bold px-3 py-1 rounded"
                                                >
                                                    {getActionLabel(r.authStatus)}
                                                </button>
                                            </td>
                                            <td className="p-2">{r.assignee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    }

                    {
                        showModal && selectedRequest && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-xl font-bold mb-4">Task Update</h2>
                                    <p className="text-sm mb-2">Couple: {selectedRequest.coupleName}</p>
                                    <textarea
                                        value={modalInput}
                                        onChange={(e) => setModalInput(e.target.value)}
                                        placeholder="Describe what was done or any notes..."
                                        className="w-full p-2 h-24 bg-gray-800 border border-gray-600 rounded text-white mb-4"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="bg-gray-700 text-white px-4 py-2 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={moveBack}
                                            className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={moveToNextStatus}
                                            className="bg-green-500 text-black px-4 py-2 rounded font-bold"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
            {view === "contact" && (
                <div>
                    <h1 className="text-3xl font-bold">Contact Requests</h1>
                    {contactRequests.length === 0 ? (
                        <p className="text-gray-400 mt-4">No contact submissions yet.</p>
                    ) : (
                        <table className="w-full text-sm border border-gray-600 mt-4">
                            <thead className="bg-gray-800 text-left">
                                <tr>
                                    <th className="p-2 border-b">Name</th>
                                    <th className="p-2 border-b">Email</th>
                                    <th className="p-2 border-b">Message</th>
                                    <th className="p-2 border-b">Submitted</th>
                                    <th className="p-2 border-b">Responded</th>
                                    <th className="p-2 border-b">Responded Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contactRequests.map((c) => (
                                    <tr key={c.id} className="border-t border-gray-700">
                                        <td className="p-2">{c.firstName} {c.lastName}</td>
                                        <td className="p-2">{c.email}</td>
                                        <td className="p-2">{c.message}</td>
                                        <td className="p-2">
                                            {c.timestamp?.toDate?.().toLocaleString?.() ||
                                                new Date(c.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-2">
                                            {c.responded === "Yes" ? (
                                                <span className="text-green-400 font-bold">Yes</span>
                                            ) : (
                                                <Button
                                                    onClick={() => handleRespond(c.id)}
                                                    className="bg-blue-500 px-3 py-1 text-white rounded"
                                                >
                                                    Not yet
                                                </Button>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {c.respondedAt?.toDate?.().toLocaleString?.() || (c.respondedAt && new Date(c.respondedAt).toLocaleString()) || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {view === "help" && (
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Help Requests</h2>
                    {loading ? (
                        <p>Loading help requests...</p>
                    ) : helpRequests.length === 0 ? (
                        <p>No help requests found.</p>
                    ) : (
                        <table className="w-full text-sm border border-gray-600">
                            <thead className="bg-gray-800 text-left">
                                <tr>
                                    <th className="p-2 border-b">Name</th>
                                    <th className="p-2 border-b">Email</th>
                                    <th className="p-2 border-b">Message</th>
                                    <th className="p-2 border-b">Date</th>
                                    <th className="p-2 border-b">Responded</th>
                                    <th className="p-2 border-b">Responded Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {helpRequests.map((r) => (
                                    <tr key={r.id} className="border-t border-gray-700">
                                        <td className="p-2">{r.firstName} {r.lastName}</td>
                                        <td className="p-2">{r.email}</td>
                                        <td className="p-2">{r.message}</td>
                                        <td className="p-2">{r.timestamp?.toDate?.().toLocaleString?.() || new Date(r.timestamp).toLocaleString()}</td>
                                        <td className="p-2">
                                            {r.responded === "Yes" ? (
                                                <span className="text-green-400 font-bold">Yes</span>
                                            ) : (
                                                <Button
                                                    onClick={() => handleHelpResponse(r.id)}
                                                    className="bg-blue-500 px-3 py-1 text-white rounded"
                                                >
                                                    Not yet
                                                </Button>
                                            )}
                                        </td>
                                        <td className="p-2">
                                            {r.respondedAt?.toDate?.().toLocaleString?.() || (r.respondedAt && new Date(r.respondedAt).toLocaleString()) || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

// return (
//     <div className="min-h-screen bg-black text-white p-6">
//         <header className="absolute top-6 left-6">
//             <div className="flex items-center gap-2 text-pink-500 font-bold text-2xl">
//                 <div className="w-6 h-6 border-[2.5px] border-pink-500 rounded-full" />
//                 <Link href="/">WedDesigner</Link>
//             </div>
//         </header>
//         <div>
//             <div className="pt-16 pb-4">
//                 <h1 className="text-3xl font-bold">App Submission Requests</h1>
//                 <div className="mt-4">
//                     <label className="mr-2">Filter by Status:</label>
//                     <select
//                         value={filter}
//                         onChange={(e) => setFilter(e.target.value)}
//                         className="bg-gray-900 text-white border border-gray-600 rounded px-2 py-1"
//                     >
//                         <option value="All">All</option>
//                         {Object.values(WorkStatus).map((status) => (
//                             <option key={status} value={status}>
//                                 {status}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <table className="w-full text-sm border border-gray-600">
//                     <thead className="bg-gray-800 text-left">
//                         <tr>
//                             <th className="p-2 border-b">ID</th>
//                             <th className="p-2 border-b">Couple</th>
//                             <th className="p-2 border-b">View Wedding Form</th>
//                             <th className="p-2 border-b">Zip URL</th>
//                             <th className="p-2 border-b">Auth Status</th>
//                             <th className="p-2 border-b">Date Created</th>
//                             <th className="p-2 border-b">Last Updated</th>
//                             <th className="p-2 border-b">Actions</th>
//                             <th className="p-2 border-b">Assignee</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredRequests.map((r) => (
//                             <tr key={r.id} className="border-t border-gray-700">
//                                 <td className="p-2">{r.id}</td>
//                                 <td className="p-2">{r.coupleName}</td>
//                                 <td className="p-2">
//                                     <button
//                                         className="text-blue-400 underline"
//                                         onClick={() => handleViewDetails(r.userId)}
//                                     >
//                                         View Details
//                                     </button>
//                                 </td>
//                                 <td className="p-2">
//                                     <a
//                                         href={r.zipFileUrl}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-blue-400 underline"
//                                     >
//                                         Download
//                                     </a>
//                                 </td>
//                                 <td className="p-2">
//                                     <span
//                                         className={`px-2 py-1 rounded text-xs font-bold ${statusColors[r.authStatus] || "bg-gray-500"}`}
//                                     >
//                                         {r.authStatus}
//                                     </span>
//                                 </td>
//                                 <td className="p-2">
//                                     {r.dateCreated?.toDate?.().toLocaleString() || "-"}
//                                 </td>
//                                 <td className="p-2">
//                                     {r.lastUpdated?.toDate?.().toLocaleString() || "-"}
//                                 </td>
//                                 <td className="p-2">
//                                     <button
//                                         onClick={() => handlePrimaryAction(r)}
//                                         className="bg-pink-500 text-white font-bold px-3 py-1 rounded"
//                                     >
//                                         {getActionLabel(r.authStatus)}
//                                     </button>
//                                 </td>
//                                 <td className="p-2">{r.assignee}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}

//             {showModal && selectedRequest && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                     <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
//                         <h2 className="text-xl font-bold mb-4">Task Update</h2>
//                         <p className="text-sm mb-2">Couple: {selectedRequest.coupleName}</p>
//                         <textarea
//                             value={modalInput}
//                             onChange={(e) => setModalInput(e.target.value)}
//                             placeholder="Describe what was done or any notes..."
//                             className="w-full p-2 h-24 bg-gray-800 border border-gray-600 rounded text-white mb-4"
//                         />
//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={() => setShowModal(false)}
//                                 className="bg-gray-700 text-white px-4 py-2 rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={moveBack}
//                                 className="bg-red-500 text-white px-4 py-2 rounded font-bold"
//                             >
//                                 Reject
//                             </button>
//                             <button
//                                 onClick={moveToNextStatus}
//                                 className="bg-green-500 text-black px-4 py-2 rounded font-bold"
//                             >
//                                 Approve
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//         <div className="pt-6">
//             <h1 className="text-3xl font-bold">Contact Requests</h1>
//             {contactRequests.length === 0 ? (
//                 <p className="text-gray-400 mt-4">No contact submissions yet.</p>
//             ) : (
//                 <table className="w-full text-sm border border-gray-600 mt-4">
//                     <thead className="bg-gray-800 text-left">
//                         <tr>
//                             <th className="p-2 border-b">Name</th>
//                             <th className="p-2 border-b">Email</th>
//                             <th className="p-2 border-b">Message</th>
//                             <th className="p-2 border-b">Submitted</th>
//                             <th className="p-2 border-b">Responded</th>
//                             <th className="p-2 border-b">Responded Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {contactRequests.map((c) => (
//                             <tr key={c.id} className="border-t border-gray-700">
//                                 <td className="p-2">{c.firstName} {c.lastName}</td>
//                                 <td className="p-2">{c.email}</td>
//                                 <td className="p-2">{c.message}</td>
//                                 <td className="p-2">
//                                     {c.timestamp?.toDate?.().toLocaleString?.() ||
//                                         new Date(c.timestamp).toLocaleString()}
//                                 </td>
//                                 <td className="p-2">
//                                     {c.responded === "Yes" ? (
//                                         <span className="text-green-400 font-bold">Yes</span>
//                                     ) : (
//                                         <Button
//                                             onClick={() => handleRespond(c.id)}
//                                             className="bg-blue-500 px-3 py-1 text-white rounded"
//                                         >
//                                             Not yet
//                                         </Button>
//                                     )}
//                                 </td>
//                                 <td className="p-2">
//                                     {c.respondedAt?.toDate?.().toLocaleString?.() || (c.respondedAt && new Date(c.respondedAt).toLocaleString()) || "-"}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     </div>
// );