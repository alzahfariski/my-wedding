"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
  Copy,
} from "lucide-react";
import { WATemplate } from "@/domain/guest";
import {
  subscribeAdminWATemplates,
  createAdminWATemplate,
  updateAdminWATemplate,
  deleteAdminWATemplate,
} from "@/services/adminService";

export const DEFAULT_WA_TEMPLATE_CONTENT = `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *{nama}* untuk menghadiri acara pernikahan kami:

*Alzah & Effri*

Berikut link undangan digital Anda:
{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.`;

interface WATemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: WATemplate) => void;
}

export default function WATemplateManager({
  isOpen,
  onClose,
  onSelectTemplate,
}: WATemplateManagerProps) {
  const [templates, setTemplates] = useState<WATemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WATemplate | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const unsubscribe = subscribeAdminWATemplates(
      (data) => {
        setTemplates(data);
        setLoading(false);
      },
      (err) => {
        console.error("Templates fetch error:", err);
        setError("Gagal memuat template dari Firebase.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  const handleSeedDefault = async () => {
    setSubmitting(true);
    try {
      await createAdminWATemplate({
        title: "Template Resmi (Default)",
        content: DEFAULT_WA_TEMPLATE_CONTENT,
        isDefault: true,
      });
    } catch (err) {
      console.error("Seed template error:", err);
      alert("Gagal membuat template bawaan.");
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateForm = () => {
    setEditingTemplate(null);
    setTitle("");
    setContent(DEFAULT_WA_TEMPLATE_CONTENT);
    setIsFormOpen(true);
  };

  const openEditForm = (tpl: WATemplate) => {
    setEditingTemplate(tpl);
    setTitle(tpl.title);
    setContent(tpl.content);
    setIsFormOpen(true);
  };

  const insertPlaceholder = (tag: string) => {
    setContent((prev) => prev + tag);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      if (editingTemplate) {
        await updateAdminWATemplate(editingTemplate.id, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await createAdminWATemplate({
          title: title.trim(),
          content: content.trim(),
          isDefault: templates.length === 0,
        });
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Save template error:", err);
      alert("Gagal menyimpan template pesan WA.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus template pesan ini?")) return;
    setDeletingId(id);
    try {
      await deleteAdminWATemplate(id);
    } catch (err) {
      console.error("Delete template error:", err);
      alert("Gagal menghapus template.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#743951]" />
            <h3 className="text-lg font-bold text-stone-800">
              Manajemen Template Pesan WhatsApp
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          {isFormOpen ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <span className="text-xs font-bold text-stone-800">
                  {editingTemplate ? "Edit Template Pesan" : "Buat Template Baru"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-stone-500 hover:underline"
                >
                  Batal
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Judul Template</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="cth: Template Formal Pasangan"
                  className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Isi Pesan Template</label>
                  <span className="text-[10px] text-stone-500">Klik tag di bawah untuk menambahkan placeholder</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-1">
                  <button
                    type="button"
                    onClick={() => insertPlaceholder(" {nama} ")}
                    className="px-2.5 py-1 bg-[#743951]/10 hover:bg-[#743951]/20 text-[#743951] rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    + {"{nama}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPlaceholder("\n{link}\n")}
                    className="px-2.5 py-1 bg-[#743951]/10 hover:bg-[#743951]/20 text-[#743951] rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    + {"{link}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertPlaceholder(" Alzah & Effri ")}
                    className="px-2.5 py-1 bg-[#743951]/10 hover:bg-[#743951]/20 text-[#743951] rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    + {"{acara}"}
                  </button>
                </div>

                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-stone-800 text-xs font-sans focus:outline-none focus:border-[#743951] resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Template</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Daftar Template Tersedia ({templates.length})
                </span>
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="px-3 py-1.5 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Template</span>
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8 text-stone-400 text-xs gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#743951]" />
                  <span>Memuat template...</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 flex flex-col items-center gap-3">
                  <p className="text-xs text-stone-500">
                    Belum ada template pesan WA tersimpan.
                  </p>
                  <button
                    type="button"
                    onClick={handleSeedDefault}
                    disabled={submitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gunakan Template Bawaan (Default)</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col justify-between gap-2 shadow-2xs hover:border-[#743951]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-stone-800">
                            {tpl.title}
                          </span>
                          {tpl.isDefault && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[9px] rounded-full border border-emerald-200">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {onSelectTemplate && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTemplate(tpl);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-[#743951] hover:bg-[#5c2d40] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              Gunakan
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditForm(tpl)}
                            className="p-1 bg-white hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-200 cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tpl.id)}
                            disabled={deletingId === tpl.id}
                            className="p-1 bg-white hover:bg-red-50 text-red-600 rounded-lg border border-stone-200 cursor-pointer disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed font-sans bg-white p-3 rounded-xl border border-stone-100 max-h-40 overflow-y-auto">
                        {tpl.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
