"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Pencil, Trash2, Heart, AlertCircle } from "lucide-react";
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

const NOTE_COLORS = [
    { name: "Kuning Pastel", value: "#fef08a", border: "ring-yellow-300" },
    { name: "Hijau Mint", value: "#bbf7d0", border: "ring-green-300" },
    { name: "Biru Muda", value: "#bfdbfe", border: "ring-blue-300" },
    { name: "Pink Soft", value: "#fbcfe8", border: "ring-pink-300" },
    { name: "Krem Warm", value: "#fed7aa", border: "ring-orange-300" },
];

interface WeddingWishSectionProps {
    isMobile?: boolean;
}

export default function WeddingWishSection({ isMobile = false }: WeddingWishSectionProps) {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [wishText, setWishText] = useState("");
    const [selectedColor, setSelectedColor] = useState("#fef08a");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userId, setUserId] = useState<string>("");
    const [editingWishId, setEditingWishId] = useState<string | null>(null);

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
        setLoading(true);
        setError(null);

        const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
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
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching wishes from Firestore:", err);
                setError("Gagal memuat ucapan. Silakan periksa koneksi internet Anda.");
                setWishes([]);
                setLoading(false);
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
        } catch (err) {
            console.error("Error submitting wish:", err);
            alert("Gagal mengirim ucapan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteWish = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;
        try {
            await deleteDoc(doc(db, "wishes", id));
        } catch (err) {
            console.error("Error deleting wish:", err);
            alert("Gagal menghapus ucapan.");
        }
    };

    const activeWishes = wishes.slice(0, 8);
    const rotations = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1deg]", "rotate-[3deg]", "rotate-[-2deg]"];

    if (isMobile) {
        return (
            <section id="section-6" className="w-full flex flex-col items-center py-8 px-4 text-center select-none">
                <h2 className="font-alex text-5xl font-normal text-[#737373] mb-4">Wedding Wish</h2>

                {/* Form */}
                <div className="w-full max-w-xs p-2 font-kalam text-left text-[#743951] mb-6">
                    <h3 className="text-lg font-bold border-b border-[#743951]/10 pb-1 mb-3 text-center">
                        {editingWishId ? "Edit Your Wish" : "Give Your Wish"}
                    </h3>
                    {submitted ? (
                        <div className="flex flex-col items-center py-4 gap-1 text-center">
                            <Check className="w-8 h-8 text-emerald-500" />
                            <span className="text-sm font-bold">{editingWishId ? "Tersimpan!" : "Terkirim!"}</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Nama</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Tulis nama Anda..."
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Ucapan / Doa</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={wishText}
                                    onChange={(e) => setWishText(e.target.value)}
                                    placeholder="Berikan ucapan selamat & doa restu..."
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951] resize-none"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Pilih Warna Note:</label>
                                <div className="flex gap-2 mt-1">
                                    {NOTE_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setSelectedColor(color.value)}
                                            style={{ backgroundColor: color.value }}
                                            className={`w-6 h-6 rounded-full border border-stone-300 shadow-sm ${selectedColor === color.value ? "ring-2 ring-offset-1 ring-[#743951]" : ""}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 bg-[#743951] text-white font-semibold rounded shadow text-xs mt-1 cursor-pointer"
                            >
                                {submitting ? "Memproses..." : (editingWishId ? "Simpan Perubahan" : "Pasang Ucapan")}
                            </button>
                        </form>
                    )}
                </div>

                {/* Sticky Notes Feed Grid */}
                <div className="w-full max-w-xs grid grid-cols-2 gap-3 mb-5">
                    {error ? (
                        <div className="col-span-2 p-4 bg-amber-50/90 border border-amber-200/80 rounded-lg text-center font-kalam text-[#743951] flex flex-col items-center gap-1 shadow-sm">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <span className="text-xs font-bold">{error}</span>
                        </div>
                    ) : loading ? (
                        <div className="col-span-2 p-4 text-center font-kalam text-stone-500 text-xs italic">
                            Memuat ucapan...
                        </div>
                    ) : activeWishes.length === 0 ? (
                        <div className="col-span-2 p-4 bg-white/80 border border-dashed border-[#743951]/30 rounded-xl text-center font-kalam text-[#743951] flex flex-col items-center gap-1 shadow-sm">
                            <span className="text-xs font-bold">Belum Ada Ucapan</span>
                            <p className="text-[10px] text-stone-500 italic">Jadilah yang pertama memberikan doa restu di atas!</p>
                        </div>
                    ) : (
                        activeWishes.map((wish, index) => {
                            const rotClass = rotations[index % rotations.length];
                            return (
                                <div
                                    key={wish.id}
                                    style={{ backgroundColor: wish.color }}
                                    className={`p-3 rounded shadow-sm border border-stone-200/50 font-kalam text-[#743951] flex flex-col justify-between text-left min-h-[120px] relative ${rotClass}`}
                                >
                                    {/* Red push-pin top center */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 border border-white/60 shadow shadow-red-950/20" />
                                        <div className="w-0.5 h-0.5 bg-stone-500 mx-auto -mt-0.5 rounded-b-sm" />
                                    </div>

                                    <div>
                                        <span className="text-xs font-bold block border-b border-[#743951]/10 pb-0.5 truncate text-center mt-1">{wish.name}</span>
                                        <p className="text-[11px] text-stone-800 mt-1 line-clamp-3 italic">"{wish.text}"</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#743951]/10 text-[9px] text-stone-500 font-sans">
                                        <span>{wish.date}</span>
                                        {wish.creatorId === userId && (
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingWishId(wish.id); setName(wish.name); setWishText(wish.text); setSelectedColor(wish.color); }} className="p-0.5" title="Edit ucapan"><Pencil className="w-3 h-3" /></button>
                                                <button onClick={() => handleDeleteWish(wish.id)} className="p-0.5 text-red-600" title="Hapus ucapan"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {wishes.length > 8 && (
                    <Link
                        href="/wishes"
                        className="px-5 py-2 bg-white border border-[#743951]/20 text-[#743951] font-kalam text-xs font-bold rounded-full shadow-sm"
                    >
                        View All Wishes ({wishes.length})
                    </Link>
                )}
            </section>
        );
    }

    return (
        <>
            {/* Wishes Input Form (Landscape Paper Card Layout) - Width 480px */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "1320px",
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

            {/* Pinned Real-time Wishes Feed (CSS Styled Sticky Notes Grid) - Width 480px */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "1530px",
                    width: "480px",
                }}
                className="grid grid-cols-4 gap-2.5"
            >
                {error ? (
                    <div className="col-span-4 p-3 bg-amber-50/90 border border-amber-200/80 rounded-lg text-center font-kalam text-[#743951] flex flex-col items-center gap-1 shadow-sm">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-[11px] font-bold">{error}</span>
                    </div>
                ) : loading ? (
                    <div className="col-span-4 p-4 text-center font-kalam text-stone-400 text-xs italic">
                        Memuat ucapan...
                    </div>
                ) : activeWishes.length === 0 ? (
                    <div className="col-span-4 p-3 bg-white/70 border border-dashed border-[#743951]/30 rounded-lg text-center font-kalam text-[#743951] flex flex-col items-center gap-0.5 shadow-sm">

                        <span className="text-[11px] font-bold">Belum Ada Ucapan</span>
                        <p className="text-[9px] text-stone-500 italic">Jadilah yang pertama memberikan doa restu di atas!</p>
                    </div>
                ) : (
                    activeWishes.map((wish, index) => {
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
                    })
                )}
            </div>

            {/* View All Wishes Link Button (Navigates to /wishes page) */}
            {wishes.length > 8 && (
                <div
                    style={{
                        position: "absolute",
                        left: "2390px",
                        top: "1810px",
                        width: "480px",
                    }}
                    className="flex justify-center"
                >
                    <Link
                        href="/wishes"
                        className="px-5 py-1 bg-white/90 border border-[#743951]/20 hover:bg-white text-[#743951] font-kalam font-bold text-[11px] rounded-full shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-image-pop"
                    >
                        View All Wishes ({wishes.length})
                    </Link>
                </div>
            )}
        </>
    );
}
