"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  RefreshCw,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { AdminPhoto } from "@/domain/admin";
import {
  subscribeAdminPhotos,
  createAdminPhoto,
  updateAdminPhoto,
  deleteAdminPhoto,
} from "@/services/adminService";
import { uploadToDrive } from "@/app/actions/uploadDrive";
import { generateFramedImage } from "@/lib/frameHelper";

export default function PhotoboothManager() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<AdminPhoto | null>(null);
  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAdminPhotos(
      (data) => {
        setPhotos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Photos fetch error:", err);
        setError("Gagal memuat data photo booth dari Firebase.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingPhoto(null);
    setGuestName("");
    setCaption("");
    setTempImage(null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (photo: AdminPhoto) => {
    setEditingPhoto(photo);
    setGuestName(photo.guestName);
    setCaption(photo.caption);
    setTempImage(photo.imageSrc);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        try {
          const { dataUrl, file: framedFile } = await generateFramedImage(rawDataUrl);
          setTempImage(dataUrl);
          setSelectedFile(framedFile);
        } catch (err) {
          console.error("Framing error:", err);
          alert("Gagal memasang frame pada foto.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !tempImage) return;

    setSubmitting(true);
    try {
      if (editingPhoto) {
        let imageUrl = tempImage;
        let fileId = editingPhoto.fileId;

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const driveRes = await uploadToDrive(formData);
          if (!driveRes.success || !driveRes.imageUrl) {
            throw new Error(driveRes.error || "Gagal mengunggah foto baru ke Google Drive.");
          }
          imageUrl = driveRes.imageUrl;
          fileId = driveRes.fileId;
        }

        await updateAdminPhoto(editingPhoto.id, {
          guestName: guestName.trim(),
          caption: caption.trim() || "Momen bahagia!",
          imageSrc: imageUrl,
          fileId: fileId || "",
        });
      } else {
        if (!selectedFile) {
          alert("Silakan pilih file foto terlebih dahulu.");
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        const driveRes = await uploadToDrive(formData);

        if (!driveRes.success || !driveRes.imageUrl) {
          throw new Error(driveRes.error || "Gagal mengunggah foto ke Google Drive.");
        }

        await createAdminPhoto({
          guestName: guestName.trim(),
          caption: caption.trim() || "Momen bahagia!",
          imageSrc: driveRes.imageUrl,
          fileId: driveRes.fileId || "",
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
    } catch (err: any) {
      console.error("Save photo error:", err);
      alert(err.message || "Gagal menyimpan data foto.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, fileId?: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus foto ini? File juga akan dihapus dari Google Drive."
      )
    )
      return;

    setDeletingId(id);
    try {
      await deleteAdminPhoto(id, fileId);
    } catch (err) {
      console.error("Delete photo error:", err);
      alert("Gagal menghapus foto.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPhotos = photos.filter(
    (p) =>
      p.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#743951]" />
            <h2 className="text-xl font-bold text-stone-800">Manajemen Photobooth (Foto Memories)</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Total {photos.length} foto memori yang telah diunggah
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari berdasarkan nama tamu atau caption..."
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

      {/* Content Grid */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center p-12 text-stone-400 text-sm gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#743951]" />
          <span>Memuat foto-foto memories...</span>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
          {searchQuery ? "Tidak ada foto yang cocok dengan pencarian." : "Belum ada data foto photobooth."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl border border-stone-200 p-3 flex flex-col justify-between shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative w-full aspect-square bg-stone-100 rounded-xl overflow-hidden mb-2 border border-stone-100">
                <Image
                  src={photo.imageSrc}
                  alt={photo.guestName}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-stone-800 truncate">
                  {photo.guestName}
                </span>
                <span className="text-[11px] text-stone-500 italic truncate">
                  "{photo.caption}"
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  {photo.date}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                {photo.imageSrc ? (
                  <a
                    href={photo.imageSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#743951] hover:underline flex items-center gap-0.5"
                    title="Buka Gambar Asli"
                  >
                    <span>View</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(photo)}
                    className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                    title="Edit Foto"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id, photo.fileId)}
                    disabled={deletingId === photo.id}
                    className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Hapus Foto"
                  >
                    {deletingId === photo.id ? (
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

      {/* Modal Add / Edit Photo */}
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
              {editingPhoto ? "Edit Data Foto" : "Unggah Foto Photobooth Baru"}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Nama Tamu</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nama pemilik foto..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-stone-700">Caption / Pesan Foto</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="cth: Kondangan vibes!"
                  className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-xs focus:outline-none focus:border-[#743951]"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-700">Preview Foto Frame</label>
                <div className="relative w-full max-w-[200px] aspect-[1080/1350] bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center overflow-hidden mx-auto">
                  {tempImage ? (
                    <>
                      <img
                        src={tempImage}
                        alt="Preview"
                        className="w-full h-full object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer shadow-md"
                        title="Ganti Foto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center gap-2 p-4 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-[#743951]" />
                      <span className="text-[11px] font-bold text-[#743951]">Pilih Foto File</span>
                      <span className="text-[9px] text-stone-400 text-center">Auto-framing otomatis</span>
                    </button>
                  )}
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
                  disabled={submitting || !tempImage}
                  className="px-5 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingPhoto ? "Simpan Perubahan" : "Unggah & Simpan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
