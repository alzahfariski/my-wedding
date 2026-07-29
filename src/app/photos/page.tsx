"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera, Upload, Check, RefreshCw, Pencil, Trash2, X, CameraOff, AlertCircle } from "lucide-react";
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
import { uploadToDrive, deleteFromDrive } from "@/app/actions/uploadDrive";
import { generateFramedImage } from "@/lib/frameHelper";
import CameraModal from "@/components/CameraModal";
import PasswordPromptModal from "@/components/PasswordPromptModal";

interface PinnedPhoto {
  id: string;
  guestName: string;
  imageSrc: string;
  fileId?: string;
  caption: string;
  date: string;
  creatorId?: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PinnedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<PinnedPhoto | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"camera" | "file" | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [caption, setCaption] = useState("");
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingPhotoOldFileId, setEditingPhotoOldFileId] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Subscribe to photos from Firestore
  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: PinnedPhoto[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            guestName: data.guestName,
            imageSrc: data.imageSrc,
            fileId: data.fileId,
            caption: data.caption,
            date: data.date,
            creatorId: data.creatorId,
          });
        });
        setPhotos(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching photos from Firestore:", err);
        setError("Gagal memuat foto. Silakan periksa koneksi internet Anda.");
        setPhotos([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const triggerActionWithPassword = (action: "camera" | "file") => {
    if (isPasswordVerified) {
      if (action === "camera") {
        setIsCameraOpen(true);
      } else {
        fileInputRef.current?.click();
      }
    } else {
      setPendingAction(action);
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsPasswordVerified(true);
    if (pendingAction === "camera") {
      setIsCameraOpen(true);
    } else if (pendingAction === "file") {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
    setPendingAction(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawDataUrl = event.target?.result as string;
        try {
          // Automatically composite frame_photobooth.png overlay
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

  const handleCameraCapture = (framedDataUrl: string, framedFile: File) => {
    setTempImage(framedDataUrl);
    setSelectedFile(framedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !tempImage) return;

    setSubmitting(true);
    try {
      const formattedDate = new Date()
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");

      if (editingPhotoId) {
        let newImageUrl: string = tempImage || "";
        let newFileId: string | undefined = editingPhotoOldFileId;

        if (selectedFile) {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const driveRes = await uploadToDrive(formData);

          if (!driveRes.success || !driveRes.imageUrl) {
            throw new Error(
              driveRes.error || "Gagal mengunggah foto baru ke Google Drive."
            );
          }

          newImageUrl = driveRes.imageUrl;
          newFileId = driveRes.fileId;

          if (editingPhotoOldFileId) {
            await deleteFromDrive(editingPhotoOldFileId);
          }
        }

        const photoDocRef = doc(db, "photos", editingPhotoId);
        await updateDoc(photoDocRef, {
          guestName: guestName.trim(),
          caption: caption.trim() || "Momen bahagia!",
          imageSrc: newImageUrl,
          fileId: newFileId || "",
          date: formattedDate,
        });

        setEditingPhotoId(null);
        setEditingPhotoOldFileId(undefined);
      } else {
        if (!selectedFile) {
          alert("Silakan pilih foto atau ambil gambar melalui kamera.");
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        const driveRes = await uploadToDrive(formData);

        if (!driveRes.success || !driveRes.imageUrl) {
          throw new Error(
            driveRes.error || "Gagal mengunggah foto ke Google Drive."
          );
        }

        await addDoc(collection(db, "photos"), {
          guestName: guestName.trim(),
          caption: caption.trim() || "Momen bahagia!",
          imageSrc: driveRes.imageUrl,
          fileId: driveRes.fileId || "",
          date: formattedDate,
          creatorId: userId,
          createdAt: serverTimestamp(),
        });
      }

      setSubmitted(true);
      setGuestName("");
      setCaption("");
      setTempImage(null);
      setSelectedFile(null);
      setIsFormOpen(false);

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      console.error("Error submitting photo:", err);
      alert(err.message || "Gagal menempelkan foto. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: string, fileId?: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    try {
      await deleteDoc(doc(db, "photos", id));
      if (fileId) {
        await deleteFromDrive(fileId);
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
      alert("Gagal menghapus foto.");
    }
  };

  const handleStartEdit = (photo: PinnedPhoto) => {
    setEditingPhotoId(photo.id);
    setEditingPhotoOldFileId(photo.fileId);
    setGuestName(photo.guestName);
    setCaption(photo.caption);
    setTempImage(photo.imageSrc);
    setSelectedFile(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rotations = [
    "rotate-[-3deg]",
    "rotate-[2deg]",
    "rotate-[-1deg]",
    "rotate-[3deg]",
    "rotate-[-2deg]",
    "rotate-[1deg]",
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#743951] font-kalam p-4 sm:p-8 md:p-12 relative select-none">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Password Verification Modal */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
      />

      {/* Live Web Camera Viewfinder Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Header Navigation */}
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
            setEditingPhotoId(null);
            setGuestName("");
            setCaption("");
            setTempImage(null);
            setSelectedFile(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="flex items-center gap-2 px-5 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white rounded-full shadow-md text-sm font-bold transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{isFormOpen ? "Tutup Form" : "Upload Foto"}</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="font-alex text-5xl sm:text-6xl md:text-7xl font-normal text-[#743951] mb-2">
          Photo Booth Memories
        </h1>
        <p className="text-sm sm:text-base text-stone-600 italic">
          Galeri foto kenangan teman-teman & keluarga ({photos.length} Foto)
        </p>
      </div>

      {/* Toast Notification */}
      {submitted && (
        <div className="max-w-md mx-auto mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex items-center justify-center gap-2 text-emerald-700 font-bold animate-fadeIn shadow-md">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>{editingPhotoId ? "Perubahan foto berhasil disimpan!" : "Foto Anda berhasil ditempel di galeri!"}</span>
        </div>
      )}

      {/* Form Upload / Edit Card */}
      {isFormOpen && (
        <div className="max-w-xl mx-auto bg-white/90 border-2 border-[#743951]/30 rounded-2xl p-6 shadow-xl mb-12 animate-fadeIn">
          <h3 className="text-xl font-bold text-center border-b border-[#743951]/20 pb-3 mb-4 italic">
            {editingPhotoId ? "Edit Foto Anda" : "Unggah Foto Memory"}
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Nama Anda</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Tulis nama Anda..."
                className="px-3.5 py-2 rounded-lg border border-[#743951]/30 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#743951] text-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold">Keterangan / Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="cth: Kondangan vibes!"
                className="px-3.5 py-2 rounded-lg border border-[#743951]/30 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#743951] text-sm"
              />
            </div>

            {/* Photo Preview Container (Portrait 1080x1350 Aspect Ratio) */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-bold text-center">Foto Ter-Frame (1080 x 1350):</label>
              <div className="relative w-full max-w-[240px] aspect-[1080/1350] bg-stone-100 border-2 border-dashed border-[#743951]/30 rounded-xl flex items-center justify-center overflow-hidden shadow-inner mx-auto">
                {tempImage ? (
                  <>
                    <img
                      src={tempImage}
                      alt="Preview Upload"
                      className="w-full h-full object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTempImage(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer shadow-md transition-transform active:scale-90"
                      title="Foto Ulang"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 gap-3 text-stone-400">
                    <div className="flex flex-col gap-2.5 w-full px-2">
                      <button
                        type="button"
                        onClick={() => triggerActionWithPassword("camera")}
                        className="w-full py-2 bg-[#743951] hover:bg-[#5c2d40] text-white rounded-xl text-xs font-bold cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Kamera Web</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerActionWithPassword("file")}
                        className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold cursor-pointer shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Perangkat</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-500 italic">Otomatis memasang frame photo booth</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button placed under form & preview */}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={submitting || !tempImage}
                className="flex-1 py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer text-sm disabled:opacity-50"
              >
                {submitting
                  ? editingPhotoId
                    ? "Menyimpan..."
                    : "Mengunggah..."
                  : editingPhotoId
                    ? "Simpan Perubahan"
                    : "Tempel Foto"}
              </button>

              {editingPhotoId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPhotoId(null);
                    setGuestName("");
                    setCaption("");
                    setTempImage(null);
                    setSelectedFile(null);
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
          Memuat galeri foto memory...
        </div>
      ) : photos.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-white/80 border-2 border-dashed border-[#743951]/30 rounded-3xl text-center flex flex-col items-center gap-3 shadow-lg">
          <CameraOff className="w-10 h-10 text-[#743951]/60" />
          <h3 className="text-xl font-bold text-[#743951]">Belum Ada Foto</h3>
          <p className="text-xs text-stone-600 italic leading-relaxed">
            Jadilah yang pertama membagikan momen bahagia di galeri foto pernikahan ini!
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-2 px-6 py-2 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold text-xs rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            Unggah Foto Sekarang
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {photos.map((photo, index) => {
            const rotClass = rotations[index % rotations.length];
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className={`w-full ${rotClass} bg-[#fafaf9] rounded shadow-md border border-stone-200 p-2.5 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:rotate-0 select-none relative cursor-pointer group`}
              >
                {/* Tape decoration on top */}
                <div className="absolute -top-2 w-8 h-2.5 bg-amber-100/60 rotate-[-8deg] rounded-sm shadow-sm z-10" />

                {/* Polaroid Image */}
                <div className="relative w-full aspect-square bg-stone-100 border border-stone-200/50 rounded-sm overflow-hidden">
                  <Image
                    src={photo.imageSrc}
                    alt={photo.guestName}
                    fill
                    className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                {/* Polaroid Footer */}
                <div className="w-full flex flex-col mt-2 font-kalam text-center leading-tight gap-y-0.5">
                  <span className="text-xs font-bold text-[#743951] truncate">
                    {photo.guestName}
                  </span>
                  <span className="text-[10px] text-stone-600 truncate italic">
                    "{photo.caption}"
                  </span>
                  <div className="flex justify-between items-center mt-1 pt-1 border-t border-stone-200/60">
                    <div className="flex gap-1 z-20">
                      {photo.creatorId === userId && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(photo);
                            }}
                            className="p-1 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                            title="Edit foto"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id, photo.fileId);
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer transition-colors"
                            title="Hapus foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>

                    <span className="text-[8px] text-stone-400 font-sans font-semibold ml-auto">
                      {photo.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Photo Preview Overlay */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative bg-[#FAF9F6] border-2 border-[#743951]/30 rounded-2xl p-4 sm:p-6 max-w-2xl w-full flex flex-col items-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-[#743951] p-1.5 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner border border-stone-200 mb-4 bg-stone-100">
              <Image
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.guestName}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>

            <h3 className="font-alex text-3xl font-bold text-[#743951]">
              {selectedPhoto.guestName}
            </h3>
            <p className="font-kalam text-base text-stone-700 italic mt-1 text-center">
              "{selectedPhoto.caption}"
            </p>
            <span className="font-sans text-xs text-stone-400 mt-2">
              {selectedPhoto.date}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
