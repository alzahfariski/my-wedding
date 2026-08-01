"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Share2,
  Copy,
  ExternalLink,
  Send,
  MessageSquareCode,
  Globe,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { GuestDraft, WATemplate, InvitationTheme } from "@/domain/guest";
import {
  subscribeAdminGuests,
  createAdminGuest,
  updateAdminGuest,
  updateAdminGuestStatus,
  deleteAdminGuest,
  subscribeAdminWATemplates,
} from "@/services/adminService";
import WATemplateManager, {
  DEFAULT_WA_TEMPLATE_CONTENT,
} from "@/components/admin/WATemplateManager";

export default function GuestsManager() {
  const [guests, setGuests] = useState<GuestDraft[]>([]);
  const [templates, setTemplates] = useState<WATemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "sent">("all");
  const [themeFilter, setThemeFilter] = useState<"all" | InvitationTheme>("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestDraft | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [theme, setTheme] = useState<InvitationTheme>("global");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Base Origin for links
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Subscribe to Guests
  useEffect(() => {
    setLoading(true);
    const unsubscribeGuests = subscribeAdminGuests(
      (data) => {
        setGuests(data);
        setLoading(false);
      },
      (err) => {
        console.error("Guests fetch error:", err);
        setError("Gagal memuat data tamu undangan.");
        setLoading(false);
      }
    );
    const unsubscribeTemplates = subscribeAdminWATemplates(
      (tpls) => {
        setTemplates(tpls);
      },
      (err) => console.error("Templates subscribe error:", err)
    );

    return () => {
      unsubscribeGuests();
      unsubscribeTemplates();
    };
  }, []);

  const openCreateModal = () => {
    setEditingGuest(null);
    setName("");
    setPhone("");
    setTheme("global");
    setSelectedTemplateId(templates.find((t) => t.isDefault)?.id || templates[0]?.id || "");
    setCustomMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestDraft) => {
    setEditingGuest(guest);
    setName(guest.name);
    setPhone(guest.phone);
    setTheme(guest.theme || "global");
    setSelectedTemplateId(guest.templateId || "");
    setCustomMessage(guest.customMessage || "");
    setIsModalOpen(true);
  };

  // Helper to format phone to international wa format (0812... -> 62812...)
  const normalizePhone = (num: string): string => {
    let clean = num.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    return clean;
  };

  // Generate invitation link for a guest
  const getInvitationLink = (guestName: string, selectedTheme?: InvitationTheme): string => {
    const baseUrl = origin || "http://localhost:3000";
    const encodedName = encodeURIComponent(guestName.trim());
    return `${baseUrl}/?to=${encodedName}`;
  };

  const handleCopyLink = (guest: GuestDraft) => {
    const link = getInvitationLink(guest.name, guest.theme);
    navigator.clipboard.writeText(link);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Build final WA message text with placeholders replaced
  const buildWAMessage = (guest: GuestDraft): string => {
    const link = getInvitationLink(guest.name, guest.theme);
    let templateText = DEFAULT_WA_TEMPLATE_CONTENT;

    if (guest.customMessage) {
      templateText = guest.customMessage;
    } else if (guest.templateId) {
      const found = templates.find((t) => t.id === guest.templateId);
      if (found) templateText = found.content;
    } else if (templates.length > 0) {
      const defaultTpl = templates.find((t) => t.isDefault) || templates[0];
      templateText = defaultTpl.content;
    }

    return templateText
      .replace(/\{nama\}/gi, guest.name)
      .replace(/\{link\}/gi, link)
      .replace(/\{acara\}/gi, "Alzah & Effri")
      .replace(/\{tema\}/gi, "Tema Global");
  };

  const handleSendWA = async (guest: GuestDraft) => {
    const waNumber = normalizePhone(guest.phone);
    if (!waNumber) {
      alert("Nomor WhatsApp tidak valid.");
      return;
    }

    const messageText = buildWAMessage(guest);
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${encodeURIComponent(
      messageText
    )}`;

    window.open(waUrl, "_blank");

    // Automatically update status to 'sent'
    if (guest.status !== "sent") {
      try {
        await updateAdminGuestStatus(guest.id, "sent");
      } catch (err) {
        console.error("Error updating guest status:", err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (editingGuest) {
        await updateAdminGuest(editingGuest.id, {
          name: name.trim(),
          phone: phone.trim(),
          theme,
          templateId: selectedTemplateId,
          customMessage: customMessage.trim(),
        });
      } else {
        await createAdminGuest({
          name: name.trim(),
          phone: phone.trim(),
          theme,
          status: "pending",
          templateId: selectedTemplateId,
          customMessage: customMessage.trim(),
          date: new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Save guest error:", err);
      alert("Gagal menyimpan data tamu.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data draft tamu ini?")) return;
    setDeletingId(id);
    try {
      await deleteAdminGuest(id);
    } catch (err) {
      console.error("Delete guest error:", err);
      alert("Gagal menghapus draft tamu.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    const matchesTheme = themeFilter === "all" || g.theme === themeFilter;
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const totalGuests = guests.length;
  const sentCount = guests.filter((g) => g.status === "sent").length;
  const pendingCount = totalGuests - sentCount;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Template Manager Modal */}
      <WATemplateManager
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(tpl) => setSelectedTemplateId(tpl.id)}
      />

      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#743951]" />
            <h2 className="text-xl font-bold text-stone-800">
              Draft Tamu Undangan & Share WhatsApp
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Total {totalGuests} tamu ({sentCount} terkirim, {pendingCount} belum terkirim)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer border border-stone-200 transition-colors"
          >
            <MessageSquareCode className="w-4 h-4 text-[#743951]" />
            <span>Kelola Template WA</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex items-center max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama tamu atau nomor WA..."
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#743951] shadow-sm cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Belum Terkirim</option>
            <option value="sent">Sudah Terkirim</option>
          </select>

          {/* Theme Filter */}
          <select
            value={themeFilter}
            onChange={(e) => setThemeFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#743951] shadow-sm cursor-pointer"
          >
            <option value="all">Semua Tema</option>
            <option value="global">Tema Global (/)</option>
          </select>
        </div>
      </div>

      {/* Main Table / Data Display */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-stone-400 text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#743951]" />
          <span>Memuat data tamu undangan...</span>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
          {searchQuery
            ? "Tidak ada tamu yang cocok dengan kata kunci pencarian."
            : "Belum ada draft tamu undangan. Klik tombol 'Tambah Tamu' di atas."}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Nama Tamu</th>
                  <th className="py-3.5 px-4">Nomor WA</th>
                  <th className="py-3.5 px-4">Tema Link</th>
                  <th className="py-3.5 px-4">Generated Link</th>
                  <th className="py-3.5 px-4">Status Kirim</th>
                  <th className="py-3.5 px-4 text-right">Aksi & Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((guest) => {
                  const generatedLink = getInvitationLink(guest.name, guest.theme);
                  const isSent = guest.status === "sent";

                  return (
                    <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {guest.name}
                      </td>

                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {guest.phone ? (
                          <span className="font-mono text-xs">{guest.phone}</span>
                        ) : (
                          <span className="text-stone-400 italic">Tanpa WA</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          <Globe className="w-3 h-3 text-blue-500" />
                          Tema Global (/)
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 max-w-[240px]">
                          <span className="truncate text-[10px] text-stone-600 font-mono">
                            {generatedLink}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(guest)}
                            className="p-1 hover:bg-stone-200 rounded text-stone-500 cursor-pointer shrink-0"
                            title="Salin Link Undangan"
                          >
                            {copiedId === guest.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <a
                            href={generatedLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 hover:bg-stone-200 rounded text-stone-500 shrink-0"
                            title="Preview Link"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={async () => {
                            const newStatus = isSent ? "pending" : "sent";
                            await updateAdminGuestStatus(guest.id, newStatus);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${isSent
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            }`}
                        >
                          {isSent ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Sudah Terkirim</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Belum Terkirim</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendWA(guest)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                            title="Kirim Pesan via WA"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Kirim WA</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(guest)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data Tamu"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(guest.id)}
                            disabled={deletingId === guest.id}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Hapus Draft Tamu"
                          >
                            {deletingId === guest.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Guest */}
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
              {editingGuest ? "Edit Draft Tamu Undangan" : "Tambah Draft Tamu Baru"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nama Tamu Undangan</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth: Budi Santoso / Keluarga Bpk. Ahmad"
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nomor WhatsApp (WA)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="cth: 08123456789 atau 628123456789"
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
                <span className="text-[10px] text-stone-400">
                  Otomatis diubah ke format internasional (628...) saat kirim WA.
                </span>
              </div>

              {/* Theme Picker (Global Theme) */}
              <div>
                <label className="text-xs font-bold text-stone-700">Tema Link Undangan</label>
                <div className="p-3 rounded-xl border border-[#743951] bg-[#743951]/5 text-[#743951] font-bold text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Tema Global</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">/?to=Nama</span>
                </div>
              </div>

              {/* Generated Link Preview */}
              {name && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Preview Link Tergenerate:
                  </span>
                  <span className="text-xs font-mono text-[#743951] break-all">
                    {getInvitationLink(name, theme)}
                  </span>
                </div>
              )}

              {/* Template Selector */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Template Pesan WA</label>
                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="text-[10px] text-[#743951] font-bold hover:underline"
                  >
                    Kelola Template
                  </button>
                </div>

                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                >
                  <option value="">Gunakan Template Default</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.title} {tpl.isDefault ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
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
                  <span>{editingGuest ? "Simpan Perubahan" : "Simpan Draft Tamu"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
