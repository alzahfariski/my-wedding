"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera, Upload, Check, RefreshCw, Pencil, Trash2, X } from "lucide-react";
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

interface PinnedPhoto {
  id: string;
  guestName: string;
  imageSrc: string;
  fileId?: string;
  caption: string;
  date: string;
  creatorId?: string;
}

const DEFAULT_PHOTOS: PinnedPhoto[] = [
  {
    id: "photo-1",
    guestName: "Alza & Keluarga",
    imageSrc: "/assets/images/img_1.png",
    caption: "Abadikan momen bahagia!",
    date: "26.07.2026",
  },
  {
    id: "photo-2",
    guestName: "Rian Ardiansyah",
    imageSrc: "/assets/images/img_2.png",
    caption: "Kondangan vibes!",
    date: "26.07.2026",
  },
  {
    id: "photo-3",
    guestName: "Keluarga Sukardi",
    imageSrc: "/assets/images/img_3.png",
    caption: "Samawa ya!",
    date: "26.07.2026",
  },
  {
    id: "photo-4",
    guestName: "Amanda & Friends",
    imageSrc: "/assets/images/img_4.png",
    caption: "Best day ever!",
    date: "26.07.2026",
  },
];

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PinnedPhoto[]>([]);
  const [userId, setUserId] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<PinnedPhoto | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setPhotos(DEFAULT_PHOTOS);
        } else {
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
        }
      },
      (error) => {
        console.error("Error fetching photos from Firestore:", error);
        setPhotos(DEFAULT_PHOTOS);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          alert("Silakan pilih file gambar dari perangkat Anda.");
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
    } catch (error: any) {
      console.error("Error submitting photo:", error);
      alert(error.message || "Gagal menempelkan foto. Silakan coba lagi.");
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
    } catch (error) {
      console.error("Error deleting photo:", error);
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold">Pilih Foto:</label>
              <div className="relative w-full h-40 bg-stone-100 border-2 border-dashed border-[#743951]/30 rounded-xl flex items-center justify-center overflow-hidden">
                {tempImage ? (
                  <>
                    <img
                      src={tempImage}
                      alt="Preview Upload"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTempImage(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white cursor-pointer shadow-md"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 gap-2 text-stone-400">
                    <Camera className="w-8 h-8 text-[#743951]" />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="px-4 py-1.5 bg-[#743951] text-white rounded-lg text-xs font-bold cursor-pointer shadow-md hover:bg-[#5c2d40]"
                    >
                      Pilih Foto Perangkat
                    </button>
                  </div>
                )}
              </div>
            </div>

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

      {/* Grid of Polaroid Photo Cards */}
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
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                className="object-contain"
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
