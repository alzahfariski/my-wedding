"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Check, Plus, Heart, AlertCircle } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
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
  { name: "Kuning Pastel", value: "#fef08a" },
  { name: "Hijau Mint", value: "#bbf7d0" },
  { name: "Biru Muda", value: "#bfdbfe" },
  { name: "Pink Soft", value: "#fbcfe8" },
  { name: "Krem Warm", value: "#fed7aa" },
];

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [wishText, setWishText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#fef08a");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingWishId, setEditingWishId] = useState<string | null>(null);

  // Initialize/Get User ID from localStorage
  useEffect(() => {
    let storedId = localStorage.getItem("wedding_user_id");
    if (!storedId) {
      storedId =
        "user_" +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36);
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
      const formattedDate = new Date()
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");

      if (editingWishId) {
        const wishDocRef = doc(db, "wishes", editingWishId);
        await updateDoc(wishDocRef, {
          name: name.trim(),
          text: wishText.trim(),
          color: selectedColor,
          date: formattedDate,
        });
        setEditingWishId(null);
      } else {
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
      setIsFormOpen(false);

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

  const handleStartEdit = (wish: Wish) => {
    setEditingWishId(wish.id);
    setName(wish.name);
    setWishText(wish.text);
    setSelectedColor(wish.color);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rotations = [
    "rotate-[-2deg]",
    "rotate-[2deg]",
    "rotate-[-1deg]",
    "rotate-[3deg]",
    "rotate-[-3deg]",
    "rotate-[1deg]",
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#743951] font-kalam p-4 sm:p-8 md:p-12 relative select-none">
      {/* Top Header Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-[#743951]/20 pb-4 mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white border border-[#743951]/20 rounded-full shadow-sm text-sm font-bold text-[#743951] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setEditingWishId(null);
            setName("");
            setWishText("");
            setIsFormOpen(!isFormOpen);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white rounded-full shadow-md text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? "Tutup Form" : "Tulis Ucapan"}</span>
        </button>
      </div>

      {/* Page Title & Subtitle */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="font-alex text-5xl sm:text-6xl md:text-7xl font-normal text-[#743951] mb-2">
          Wedding Wishes & Doa Restu
        </h1>
        <p className="text-sm sm:text-base text-stone-600 italic">
          Ungkapan kebahagiaan dan doa restu untuk pernikahan Alzha & Effri ({wishes.length} Ucapan)
        </p>
      </div>

      {/* Toast Notification */}
      {submitted && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex items-center justify-center gap-2 text-emerald-700 font-bold animate-fadeIn shadow-md">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{editingWishId ? "Perubahan ucapan disimpan!" : "Ucapan Anda berhasil terpasang di dinding doa!"}</span>
        </div>
      )}

      {/* Expandable Add / Edit Form Card */}
      {isFormOpen && (
        <div className="max-w-xl mx-auto bg-white/90 border-2 border-[#743951]/30 rounded-2xl p-6 shadow-xl mb-12 animate-fadeIn">
          <h3 className="text-xl font-bold text-center border-b border-[#743951]/20 pb-3 mb-4 italic">
            {editingWishId ? "Edit Ucapan Anda" : "Tulis Ucapan & Doa Restu"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Nama Anda</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tulis nama Anda..."
                className="px-3.5 py-2 rounded-lg border border-[#743951]/30 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#743951] text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Ucapan / Doa Restu</label>
              <textarea
                required
                rows={3}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Tulis doa restu Anda..."
                className="px-3.5 py-2 rounded-lg border border-[#743951]/30 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#743951] text-sm resize-none"
              />
            </div>

            {/* Note Color Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold">Pilih Warna Sticky Note:</label>
              <div className="flex gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    style={{ backgroundColor: color.value }}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-sm border border-stone-300 ${selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-[#743951] scale-110"
                      : ""
                      }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer text-sm"
              >
                {submitting
                  ? editingWishId
                    ? "Menyimpan..."
                    : "Memasang..."
                  : editingWishId
                    ? "Simpan Perubahan"
                    : "Pasang Ucapan"}
              </button>

              {editingWishId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingWishId(null);
                    setName("");
                    setWishText("");
                    setSelectedColor("#fef08a");
                    setIsFormOpen(false);
                  }}
                  className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-lg transition-colors cursor-pointer text-sm"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Grid Display or States */}
      {error ? (
        <div className="max-w-xl mx-auto my-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center flex flex-col items-center gap-3 shadow-md">
          <AlertCircle className="w-8 h-8 text-amber-600" />
          <span className="text-base font-bold text-amber-800">{error}</span>
          <p className="text-xs text-amber-700">Pastikan koneksi internet terhubung dan silakan muat ulang halaman.</p>
        </div>
      ) : loading ? (
        <div className="max-w-xl mx-auto my-16 text-center text-stone-500 font-kalam text-lg animate-pulse">
          Memuat ucapan pernikahan...
        </div>
      ) : wishes.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-white/80 border-2 border-dashed border-[#743951]/30 rounded-3xl text-center flex flex-col items-center gap-3 shadow-lg">

          <h3 className="text-xl font-bold text-[#743951]">Belum Ada Ucapan</h3>
          <p className="text-xs text-stone-600 italic leading-relaxed">
            Jadilah orang pertama yang mengirimkan ucapan doa restu untuk kebahagiaan Alzah & Effri!
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-2 px-6 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold text-xs rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            Tulis Ucapan Sekarang
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishes.map((wish, index) => {
            const rotClass = rotations[index % rotations.length];
            return (
              <div
                key={wish.id}
                style={{
                  backgroundColor: wish.color,
                  minHeight: "160px",
                }}
                className={`w-full ${rotClass} transition-all duration-300 hover:scale-105 hover:rotate-0 flex flex-col justify-between p-4 shadow-md rounded-sm border border-stone-300/40 relative`}
              >
                {/* Red push-pin top center */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 border border-white/60 shadow" />
                  <div className="w-0.5 h-1 bg-stone-500 mx-auto -mt-0.5 rounded-b-sm" />
                </div>

                {/* Wish Note Content */}
                <div className="w-full flex flex-col h-full justify-between pt-1">
                  <div>
                    <span className="text-sm font-bold italic leading-none border-b border-[#743951]/15 pb-1 block w-full text-center truncate">
                      {wish.name}
                    </span>
                    <p className="text-xs font-normal leading-relaxed mt-2.5 text-stone-850 italic text-left max-h-[100px] overflow-y-auto scrollbar-thin">
                      "{wish.text}"
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-1.5 border-t border-[#743951]/10">
                    <div className="flex gap-1.5">
                      {wish.creatorId === userId && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(wish)}
                            className="p-1 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                            title="Edit ucapan"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWish(wish.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer transition-colors"
                            title="Hapus ucapan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] font-semibold text-stone-500 font-sans">
                      {wish.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
