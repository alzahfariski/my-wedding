"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  DollarSign,
  Landmark,
  MessageCircle,
} from "lucide-react";
import { AdminConfirmation } from "@/domain/admin";
import {
  subscribeAdminConfirmations,
  createAdminConfirmation,
  updateAdminConfirmation,
  deleteAdminConfirmation,
} from "@/services/adminService";
import { formatRupiahInput, formatRupiahDisplay } from "@/lib/formatRupiah";

export default function ConfirmationsManager() {
  const [confirmations, setConfirmations] = useState<AdminConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfirmation, setEditingConfirmation] = useState<AdminConfirmation | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAdminConfirmations(
      (data) => {
        setConfirmations(data);
        setLoading(false);
      },
      (err) => {
        console.error("Confirmations fetch error:", err);
        setError("Gagal memuat data konfirmasi hadiah dari Firebase.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingConfirmation(null);
    setName("");
    setAmount("");
    setBank("");
    setMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminConfirmation) => {
    setEditingConfirmation(item);
    setName(item.name);
    setAmount(formatRupiahInput(item.amount));
    setBank(item.bank || "");
    setMessage(item.message || "");
    setIsModalOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRupiahInput(e.target.value);
    setAmount(formatted);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount.trim()) return;

    setSubmitting(true);
    try {
      const cleanAmount = amount.trim();
      if (editingConfirmation) {
        await updateAdminConfirmation(editingConfirmation.id, {
          name: name.trim(),
          amount: cleanAmount,
          bank: bank.trim(),
          message: message.trim(),
        });
      } else {
        await createAdminConfirmation({
          name: name.trim(),
          amount: cleanAmount,
          bank: bank.trim(),
          message: message.trim(),
          date: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          creatorId: "admin",
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save confirmation error:", err);
      alert("Gagal menyimpan data konfirmasi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data konfirmasi hadiah ini?")) return;
    setDeletingId(id);
    try {
      await deleteAdminConfirmation(id);
    } catch (err) {
      console.error("Delete confirmation error:", err);
      alert("Gagal menghapus data konfirmasi.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredConfirmations = confirmations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.bank && c.bank.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.message && c.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.amount.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate sum total of amounts
  const totalSum = confirmations.reduce((sum, item) => {
    const rawNum = parseInt(item.amount.replace(/[^0-9]/g, "") || "0", 10);
    return sum + (isNaN(rawNum) ? 0 : rawNum);
  }, 0);

  const formattedTotalSum = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(totalSum);

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Top Header & Summary Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#743951]" />
            <h2 className="text-xl font-bold text-stone-800">Manajemen Konfirmasi Hadiah (Amplop Digital)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Total {confirmations.length} konfirmasi pengiriman hadiah & angpao
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-[#743951]/5 border border-[#743951]/20 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
              Total Nominal Terkonfirmasi
            </span>
            <span className="text-sm font-bold text-[#743951]">
              {formattedTotalSum}
            </span>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative flex items-center max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, nominal, bank, atau ucapan..."
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

      {/* Data Table */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-stone-400 text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#743951]" />
          <span>Memuat data konfirmasi...</span>
        </div>
      ) : filteredConfirmations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
          {searchQuery ? "Tidak ada konfirmasi yang cocok dengan pencarian." : "Belum ada data konfirmasi hadiah."}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Nama Pengirim</th>
                  <th className="py-3.5 px-4">Nominal Hadiah</th>
                  <th className="py-3.5 px-4">Bank / Metode</th>
                  <th className="py-3.5 px-4">Pesan / Catatan</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredConfirmations.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-[#743951] font-bold font-mono">
                      {formatRupiahDisplay(item.amount)}
                    </td>
                    <td className="py-3 px-4">
                      {item.bank ? (
                        <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          <Landmark className="w-3 h-3 text-stone-500" />
                          {item.bank}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate italic text-stone-600">
                      {item.message || "-"}
                    </td>
                    <td className="py-3 px-4 text-stone-400 font-medium whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                          title="Edit Konfirmasi"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Konfirmasi"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-3 mb-4">
              {editingConfirmation ? "Edit Konfirmasi Hadiah" : "Tambah Konfirmasi Baru"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nama Tamu / Pengirim</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengirim..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nominal Hadiah (Rp)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-stone-500">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9.]*"
                    required
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="500.000"
                    className="w-full pl-9 pr-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs font-mono font-bold focus:outline-none focus:border-[#743951]"
                  />
                </div>
                <span className="text-[10px] text-stone-400">Otomatis terformat Rupiah saat diketik.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Bank / Metode Transfer</label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  placeholder="cth: BCA / Mandiri / QRIS"
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Pesan / Catatan Tambahan</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Catatan..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951] resize-none"
                />
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
                  <span>{editingConfirmation ? "Simpan Perubahan" : "Tambah Data"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
