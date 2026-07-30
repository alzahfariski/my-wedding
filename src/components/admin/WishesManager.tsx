"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  User,
} from "lucide-react";
import { AdminWish } from "@/domain/admin";
import {
  subscribeAdminWishes,
  createAdminWish,
  updateAdminWish,
  deleteAdminWish,
} from "@/services/adminService";

const NOTE_COLORS = [
  { name: "Kuning Pastel", value: "#fef08a" },
  { name: "Hijau Mint", value: "#bbf7d0" },
  { name: "Biru Muda", value: "#bfdbfe" },
  { name: "Pink Soft", value: "#fbcfe8" },
  { name: "Krem Warm", value: "#fed7aa" },
];

export default function WishesManager() {
  const [wishes, setWishes] = useState<AdminWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<AdminWish | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState("#fef08a");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAdminWishes(
      (data) => {
        setWishes(data);
        setLoading(false);
      },
      (err) => {
        console.error("Wishes fetch error:", err);
        setError("Gagal memuat data ucapan dari Firebase.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingWish(null);
    setName("");
    setText("");
    setColor("#fef08a");
    setIsModalOpen(true);
  };

  const openEditModal = (wish: AdminWish) => {
    setEditingWish(wish);
    setName(wish.name);
    setText(wish.text);
    setColor(wish.color || "#fef08a");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setSubmitting(true);
    try {
      if (editingWish) {
        await updateAdminWish(editingWish.id, {
          name: name.trim(),
          text: text.trim(),
          color,
        });
      } else {
        await createAdminWish({
          name: name.trim(),
          text: text.trim(),
          color,
          date: new Date()
            .toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "."),
          creatorId: "admin",
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save wish error:", err);
      alert("Gagal menyimpan data ucapan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;
    setDeletingId(id);
    try {
      await deleteAdminWish(id);
    } catch (err) {
      console.error("Delete wish error:", err);
      alert("Gagal menghapus ucapan.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredWishes = wishes.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#743951]" />
            <h2 className="text-xl font-bold text-stone-800">Manajemen Wishes (Ucapan)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Total {wishes.length} ucapan & doa restu dari tamu undangan
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Ucapan</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative flex items-center max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama atau isi ucapan..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#743951] shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 text-stone-400 hover:text-stone-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Area */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-stone-400 text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#743951]" />
          <span>Memuat data ucapan...</span>
        </div>
      ) : filteredWishes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
          {searchQuery ? "Tidak ada ucapan yang cocok dengan kata kunci pencarian." : "Belum ada data ucapan."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWishes.map((wish) => (
            <div
              key={wish.id}
              style={{ backgroundColor: wish.color || "#fef08a" }}
              className="p-4 rounded-xl border border-stone-300/60 shadow-sm flex flex-col justify-between min-h-[160px] relative font-kalam transition-transform hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#743951]/15 pb-1.5 mb-2">
                  <span className="font-bold text-xs text-[#743951] truncate">
                    {wish.name}
                  </span>
                  <div className="flex items-center gap-1 font-sans text-[10px] text-stone-600">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{wish.date}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed italic line-clamp-4">
                  "{wish.text}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#743951]/10 font-sans">
                <span className="text-[10px] text-stone-500 truncate">
                  ID: {wish.id.substring(0, 6)}...
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(wish)}
                    className="p-1 bg-white/80 hover:bg-white text-stone-700 rounded-md shadow-xs transition-colors cursor-pointer"
                    title="Edit Wish"
                  >
                    <Pencil className="w-3.5 h-3.5 text-stone-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(wish.id)}
                    disabled={deletingId === wish.id}
                    className="p-1 bg-white/80 hover:bg-red-50 text-red-600 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    title="Hapus Wish"
                  >
                    {deletingId === wish.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-3 mb-4">
              {editingWish ? "Edit Ucapan" : "Tambah Ucapan Baru"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nama Pengirim</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengirim ucapan..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Isi Ucapan & Doa</label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tulis ucapan..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951] resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700">Warna Sticky Note</label>
                <div className="flex gap-2">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      className={`w-7 h-7 rounded-full border border-stone-300 cursor-pointer shadow-xs transition-transform hover:scale-110 ${
                        color === c.value ? "ring-2 ring-offset-2 ring-[#743951]" : ""
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingWish ? "Simpan Perubahan" : "Tambah Ucapan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
