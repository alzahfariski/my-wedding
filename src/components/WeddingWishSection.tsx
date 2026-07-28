"use client";

import { useState, useEffect } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Wish {
    id: string;
    name: string;
    text: string;
    date: string;
    color: string;
    creatorId?: string;
}

const DEFAULT_WISHES: Wish[] = [
    {
        id: "wish-1",
        name: "Keluarga Sukardi",
        text: "Selamat menempuh hidup baru Putra & Putri! Semoga menjadi keluarga sakinah, mawaddah, warahmah.",
        date: "26.07.2026",
        color: "#fef08a", // Yellow
    },
    {
        id: "wish-2",
        name: "Rian Ardiansyah",
        text: "Happy wedding bro! Lancar sampai hari H ya, bahagia selalu dengan istri tercinta!",
        date: "26.07.2026",
        color: "#fbcfe8", // Pink
    },
    {
        id: "wish-3",
        name: "Siti Lestari",
        text: "Barakallah, selamat menempuh lembaran baru. Semoga cinta kalian abadi selamanya.",
        date: "26.07.2026",
        color: "#bbf7d0", // Green
    },
    {
        id: "wish-4",
        name: "Budi Santoso",
        text: "Selamat menempuh hidup baru! Semoga dilimpahi rezeki dan kebahagiaan.",
        date: "26.07.2026",
        color: "#bfdbfe", // Blue
    },
    {
        id: "wish-5",
        name: "Siti Rahma",
        text: "Selamat ya untuk kedua mempelai! Sakinah mawaddah warahmah selalu.",
        date: "26.07.2026",
        color: "#fed7aa", // Orange
    },
    {
        id: "wish-6",
        name: "Adi Nugroho",
        text: "Selamat menempuh bahtera rumah tangga, semoga selalu harmonis dan bahagia.",
        date: "26.07.2026",
        color: "#fef08a", // Yellow
    },
    {
        id: "wish-7",
        name: "Dewi Lestari",
        text: "Happy wedding! Sangat bahagia melihat kalian bersatu. Doa terbaik untuk kalian berdua.",
        date: "26.07.2026",
        color: "#fbcfe8", // Pink
    },
    {
        id: "wish-8",
        name: "Hendra Wijaya",
        text: "Selamat menempuh hidup baru! Semoga rukun selalu sampai kakek nenek.",
        date: "26.07.2026",
        color: "#bbf7d0", // Green
    },
];

const NOTE_COLORS = [
    { name: "Yellow", value: "#fef08a", border: "ring-yellow-300" },
    { name: "Pink", value: "#fbcfe8", border: "ring-pink-300" },
    { name: "Green", value: "#bbf7d0", border: "ring-green-300" },
    { name: "Blue", value: "#bfdbfe", border: "ring-blue-300" },
    { name: "Orange", value: "#fed7aa", border: "ring-orange-300" },
];

export default function WeddingWishSection() {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [name, setName] = useState("");
    const [wishText, setWishText] = useState("");
    const [selectedColor, setSelectedColor] = useState("#fef08a");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [editingWishId, setEditingWishId] = useState<string | null>(null);
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);

    // Initialize/Get User ID from localStorage
    useEffect(() => {
        let storedId = localStorage.getItem("wedding_user_id");
        if (!storedId) {
            storedId = "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem("wedding_user_id", storedId);
        }
        setUserId(storedId);
    }, []);

    // Subscribe to wishes from Firestore
    useEffect(() => {
        const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (snapshot.empty) {
                    setWishes(DEFAULT_WISHES);
                } else {
                    const list: Wish[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        list.push({
                            id: doc.id,
                            name: data.name,
                            text: data.text,
                            color: data.color,
                            date: data.date,
                            creatorId: data.creatorId,
                        });
                    });
                    setWishes(list);
                }
            },
            (error) => {
                console.error("Error fetching wishes from Firestore:", error);
                setWishes(DEFAULT_WISHES);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !wishText.trim()) return;

        setSubmitting(true);
        try {
            const formattedDate = new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).replace(/\//g, ".");

            if (editingWishId) {
                // Update existing wish
                const wishDocRef = doc(db, "wishes", editingWishId);
                await updateDoc(wishDocRef, {
                    name: name.trim(),
                    text: wishText.trim(),
                    color: selectedColor,
                    date: formattedDate,
                });
                setEditingWishId(null);
            } else {
                // Create new wish
                await addDoc(collection(db, "wishes"), {
                    name: name.trim(),
                    text: wishText.trim(),
                    color: selectedColor,
                    date: formattedDate,
                    creatorId: userId,
                    createdAt: serverTimestamp(),
                });
            }

            setSubmitted(true);
            setName("");
            setWishText("");
            setSelectedColor("#fef08a");

            setTimeout(() => setSubmitted(false), 3000);
        } catch (error) {
            console.error("Error submitting wish:", error);
            alert("Gagal mengirim ucapan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteWish = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;
        try {
            await deleteDoc(doc(db, "wishes", id));
        } catch (error) {
            console.error("Error deleting wish:", error);
            alert("Gagal menghapus ucapan.");
        }
    };

    const activeWishes = wishes.slice(0, 8);
    const rotations = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1deg]", "rotate-[3deg]", "rotate-[-2deg]"];

    return (
        <>
            {/* Wishes Input Form (Landscape Paper Card Layout) - Width 480px, ends at 2670px */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "550px",
                    width: "480px",
                    minHeight: "175px",
                }}
                className="p-4 font-kalam text-[#743951] select-none flex flex-col justify-between"
            >
                <div className="text-[15px] font-bold italic pb-4 w-full text-start leading-none">
                    {editingWishId ? "Edit Your Wish" : "Give Your Wish"}
                </div>

                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-2 gap-1 text-center flex-1">
                        <Check className="w-7 h-7 text-emerald-500 animate-image-pop" />
                        <span className="text-[13px] font-bold">{editingWishId ? "Tersimpan!" : "Terkirim!"}</span>
                        <p className="text-[10px] text-stone-600 leading-tight">
                            {editingWishId ? "Perubahan berhasil disimpan!" : "Ucapan doa restu Anda berhasil terpasang!"}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-4 w-full text-left mt-1.5 flex-1 items-stretch">
                        {/* Left Column: Name & Wishes */}
                        <div className="flex-[1.3] flex flex-col justify-between">
                            <div className="flex flex-col gap-0.5">
                                <label className="text-[10px] font-semibold">Nama</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tulis nama Anda..."
                                    className="px-2 py-0.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[11px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-0.5 mt-1">
                                <label className="text-[10px] font-semibold">Ucapan / Doa</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={wishText}
                                    onChange={(e) => setWishText(e.target.value)}
                                    placeholder="Berikan ucapan selamat..."
                                    className="px-2 py-0.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[11px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Right Column: Color Selector & Submit */}
                        <div className="flex-1 flex flex-col justify-between pl-3.5">
                            {/* Sticky Note Color Picker */}
                            <div className="flex flex-col gap-0.5">
                                <label className="text-[10px] font-semibold">Pilih Warna Note:</label>
                                <div className="flex gap-1.5 mt-0.5">
                                    {NOTE_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setSelectedColor(color.value)}
                                            style={{ backgroundColor: color.value }}
                                            className={`w-5.5 h-5.5 rounded-full cursor-pointer transition-transform duration-205 hover:scale-110 shadow-sm border border-stone-300/40 focus:outline-none ${selectedColor === color.value ? `ring-2 ring-offset-1 ring-[#743951] scale-110` : ""}`}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 w-full mt-auto">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-1.5 bg-[#743951] text-white font-semibold rounded shadow-sm hover:bg-[#5c2d40] active:scale-[0.98] text-[11px] cursor-pointer disabled:opacity-50 select-none mt-auto transition-colors"
                                >
                                    {submitting 
                                        ? (editingWishId ? "Menyimpan..." : "Memasang...") 
                                        : (editingWishId ? "Simpan Perubahan" : "Pasang Ucapan")}
                                </button>
                                {editingWishId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingWishId(null);
                                            setName("");
                                            setWishText("");
                                            setSelectedColor("#fef08a");
                                        }}
                                        className="w-full py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded text-[10px] cursor-pointer transition-colors"
                                    >
                                        Batal Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Pinned Real-time Wishes Feed (CSS Styled Sticky Notes Grid) - Width 480px, ends at 2670px */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "760px",
                    width: "480px",
                }}
                className="grid grid-cols-4 gap-2.5"
            >
                {activeWishes.map((wish, index) => {
                    const rotClass = rotations[index % rotations.length];

                    return (
                        <div
                            key={wish.id}
                            style={{
                                backgroundColor: wish.color,
                                height: "115px",
                            }}
                            className={`w-full ${rotClass} transition-all duration-300 hover:scale-105 hover:rotate-0 flex flex-col justify-between p-2 shadow-sm shadow-stone-850/10 border border-stone-350/5 font-kalam text-[#743951] select-none relative`}
                        >
                            {/* Red push-pin top center */}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 border border-white/60 shadow shadow-red-950/20" />
                                <div className="w-0.5 h-0.5 bg-stone-500 mx-auto -mt-0.5 rounded-b-sm" />
                            </div>

                            {/* Note Content */}
                            <div className="w-full flex flex-col h-full justify-between pt-0.5">
                                <div>
                                    <span className="text-[10px] font-bold italic leading-none border-b border-[#743951]/10 pb-0.5 block w-full text-center truncate">
                                        {wish.name}
                                    </span>
                                    <p className="text-[9px] font-normal leading-tight mt-1 text-stone-850 max-h-[55px] overflow-y-auto scrollbar-hide text-left italic pr-0.5">
                                        "{wish.text}"
                                    </p>
                                </div>
                                <div className="flex justify-between items-center mt-0.5 pt-0.5 border-t border-[#743951]/5">
                                    <div className="flex gap-1 z-20">
                                        {wish.creatorId === userId && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingWishId(wish.id);
                                                        setName(wish.name);
                                                        setWishText(wish.text);
                                                        setSelectedColor(wish.color);
                                                    }}
                                                    className="p-0.5 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                                                    title="Edit ucapan"
                                                >
                                                    <Pencil className="w-2.5 h-2.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteWish(wish.id);
                                                    }}
                                                    className="p-0.5 hover:bg-red-105 rounded text-red-600 cursor-pointer transition-colors"
                                                    title="Hapus ucapan"
                                                >
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-[7px] font-semibold text-stone-500/80 text-right font-sans">
                                        {wish.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View All Button */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "1040px",
                    width: "480px",
                }}
                className="flex justify-center"
            >
                <button
                    type="button"
                    onClick={() => setIsViewAllOpen(true)}
                    className="px-5 py-1 bg-white/90 border border-[#743951]/20 hover:bg-white text-[#743951] font-kalam font-bold text-[11px] rounded-full shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-image-pop"
                >
                    View All Wishes ({wishes.length})
                </button>
            </div>

            {/* View All Wishes Modal */}
            {isViewAllOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#FAF9F6] border-2 border-[#743951]/30 rounded-2xl w-11/12 md:w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col p-4 sm:p-8 shadow-2xl relative font-kalam text-[#743951]">
                        {/* Close button */}
                        <button
                            onClick={() => setIsViewAllOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-[#743951] transition-colors p-1 cursor-pointer rounded-full hover:bg-stone-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 className="text-2xl font-bold text-center border-b border-[#743951]/25 pb-3 mb-6 italic">
                            All Wedding Wishes ({wishes.length})
                        </h3>
                        
                        <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#743951]/20">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                                {wishes.map((wish, index) => {
                                    const rotClass = rotations[index % rotations.length];
                                    return (
                                        <div
                                            key={wish.id}
                                            style={{
                                                backgroundColor: wish.color,
                                                minHeight: "130px",
                                            }}
                                            className={`w-full ${rotClass} transition-all duration-300 hover:scale-105 hover:rotate-0 flex flex-col justify-between p-3.5 shadow-md border border-stone-300/40 relative rounded-sm`}
                                        >
                                            {/* Red push-pin */}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 border border-white/60 shadow" />
                                                <div className="w-0.5 h-0.5 bg-stone-500 mx-auto -mt-0.5 rounded-b-sm" />
                                            </div>

                                            {/* Content */}
                                            <div className="w-full flex flex-col h-full justify-between pt-1">
                                                <div>
                                                    <span className="text-xs font-bold italic leading-none border-b border-[#743951]/10 pb-0.5 block w-full text-center truncate">
                                                        {wish.name}
                                                    </span>
                                                    <p className="text-[10px] font-normal leading-relaxed mt-2 text-stone-850 italic text-left max-h-[80px] overflow-y-auto scrollbar-hide">
                                                        "{wish.text}"
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#743951]/5">
                                                    <div className="flex gap-2">
                                                        {wish.creatorId === userId && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingWishId(wish.id);
                                                                        setName(wish.name);
                                                                        setWishText(wish.text);
                                                                        setSelectedColor(wish.color);
                                                                        setIsViewAllOpen(false); // Close modal to focus on edit form
                                                                    }}
                                                                    className="p-1 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                                                                    title="Edit ucapan"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteWish(wish.id);
                                                                    }}
                                                                    className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer transition-colors"
                                                                    title="Hapus ucapan"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <span className="text-[8px] font-semibold text-stone-500/80 text-right font-sans">
                                                        {wish.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
