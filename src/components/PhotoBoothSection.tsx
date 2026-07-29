"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Upload, Check, RefreshCw, Pencil, Trash2, CameraOff, AlertCircle } from "lucide-react";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
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

export default function PhotoBoothSection() {
    const [photos, setPhotos] = useState<PinnedPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [guestName, setGuestName] = useState("");
    const [caption, setCaption] = useState("");
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userId, setUserId] = useState("");
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [editingPhotoOldFileId, setEditingPhotoOldFileId] = useState<string | undefined>(undefined);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize/Get User ID from localStorage
    useEffect(() => {
        let storedId = localStorage.getItem("wedding_user_id");
        if (!storedId) {
            storedId = "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
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
            const formattedDate = new Date().toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).replace(/\//g, ".");

            if (editingPhotoId) {
                // Update Photo
                let newImageUrl: string = tempImage || "";
                let newFileId: string | undefined = editingPhotoOldFileId;

                // Check if user uploaded a replacement image file
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append("file", selectedFile);
                    const driveRes = await uploadToDrive(formData);

                    if (!driveRes.success || !driveRes.imageUrl) {
                        throw new Error(driveRes.error || "Gagal mengunggah foto baru ke Google Drive.");
                    }

                    newImageUrl = driveRes.imageUrl;
                    newFileId = driveRes.fileId;

                    // Delete old Google Drive photo
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
                    throw new Error(driveRes.error || "Gagal mengunggah foto ke Google Drive.");
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
            alert("Gagal menghapus foto dari database.");
        }
    };

    const handleResetImage = () => {
        setTempImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const activePhotos = photos.slice(0, 12);
    const rotations = ["rotate-[-3deg]", "rotate-[2deg]", "rotate-[-1deg]", "rotate-[3deg]", "rotate-[-2deg]"];

    return (
        <>
            {/* Photo Booth Form (Landscape Paper Card Layout) - Width 480px */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "1860px",
                    width: "480px",
                    minHeight: "180px",
                }}
                className="p-4 font-kalam text-[#743951] select-none flex flex-col justify-between"
            >
                <div className="text-[15px] font-bold italic pb-1 w-full text-start leading-none">
                    {editingPhotoId ? "Edit Momen Anda" : "Abadikan Momen"}
                </div>

                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-2 gap-1 text-center flex-1">
                        <Check className="w-7 h-7 text-emerald-500 animate-image-pop" />
                        <span className="text-[13px] font-bold">{editingPhotoId ? "Tersimpan!" : "Terpasang!"}</span>
                        <p className="text-[10px] text-stone-600 leading-tight">
                            {editingPhotoId ? "Perubahan foto berhasil disimpan!" : "Foto Anda telah berhasil ditempel di dinding foto!"}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-4 w-full text-left mt-1.5 flex-1 items-stretch">
                        {/* Left Column: Name & Caption */}
                        <div className="flex-[1.2] flex flex-col justify-between">
                            <div className="flex flex-col gap-0.5">
                                <label className="text-[10px] font-semibold">Nama Anda</label>
                                <input
                                    type="text"
                                    required
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder="Tulis nama Anda..."
                                    className="px-2 py-0.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[11px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-0.5 mt-1 flex-1">
                                <label className="text-[10px] font-semibold">Keterangan</label>
                                <textarea
                                    rows={2}
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="cth: Kondangan vibes!"
                                    className="px-2 py-1 rounded border border-[#743951]/20 bg-stone-50/50 text-[10px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors resize-none flex-1 min-h-[52px]"
                                />
                            </div>
                        </div>

                        {/* Right Column: Image Uploader & Submit */}
                        <div className="flex-1 flex flex-col justify-between pl-3.5 ">
                            <div className="relative w-full h-[72px] bg-stone-100 border border-stone-200 rounded flex items-center justify-center overflow-hidden">
                                {tempImage ? (
                                    <>
                                        <img
                                            src={tempImage}
                                            alt="Temp Upload"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleResetImage}
                                            className="absolute top-1 right-1 w-5.5 h-5.5 bg-white/90 hover:bg-white rounded-full flex items-center justify-center cursor-pointer shadow-sm text-stone-600 transition-transform active:scale-90"
                                        >
                                            <RefreshCw className="w-2.5 h-2.5" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-2 gap-0.5 text-center text-stone-400">
                                        <Camera className="w-4.5 h-4.5 opacity-60 text-[#743951]" />
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="px-2 py-0.5 bg-[#743951] text-white rounded text-[8px] cursor-pointer shadow-sm mt-0.5 hover:bg-[#5c2d40]"
                                        >
                                            Pilih Foto
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 w-full mt-1.5">
                                <button
                                    type="submit"
                                    disabled={submitting || !tempImage}
                                    className="w-full py-1.5 bg-[#743951] text-white font-semibold rounded shadow-sm hover:bg-[#5c2d40] active:scale-[0.98] text-[11px] cursor-pointer disabled:opacity-50 select-none transition-colors"
                                >
                                    {submitting
                                        ? (editingPhotoId ? "Menyimpan..." : "Menempelkan...")
                                        : (editingPhotoId ? "Simpan Perubahan" : "Tempel Foto")}
                                </button>
                                {editingPhotoId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPhotoId(null);
                                            setEditingPhotoOldFileId(undefined);
                                            setGuestName("");
                                            setCaption("");
                                            setTempImage(null);
                                            setSelectedFile(null);
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

            {/* Pinned Real-time Photos (Polaroids Grid) - Width 480px */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "2060px",
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
                        Memuat galeri foto...
                    </div>
                ) : activePhotos.length === 0 ? (
                    <div className="col-span-4 p-3 bg-white/70 border border-dashed border-[#743951]/30 rounded-lg text-center font-kalam text-[#743951] flex flex-col items-center gap-0.5 shadow-sm">
                        <CameraOff className="w-4 h-4 text-[#743951]/60" />
                        <span className="text-[11px] font-bold">Belum Ada Foto</span>
                        <p className="text-[9px] text-stone-500 italic">Bagikan foto momen bahagiamu di atas!</p>
                    </div>
                ) : (
                    activePhotos.map((photo, index) => {
                        const rotClass = rotations[index % rotations.length];

                        return (
                            <div
                                key={photo.id}
                                style={{
                                    height: "145px",
                                }}
                                className={`w-full ${rotClass} bg-[#fafaf9] rounded shadow-md border border-stone-200 p-1.5 pb-2.5 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:rotate-0 select-none relative`}
                            >
                                {/* Tape decoration on top */}
                                <div className="absolute -top-1.5 w-6 h-2 bg-amber-100/60 rotate-[-8deg] rounded-sm shadow-sm" />

                                {/* Image container inside Polaroid */}
                                <div className="relative w-full aspect-square bg-stone-100 border border-stone-200/50 rounded-sm overflow-hidden">
                                    <Image
                                        src={photo.imageSrc}
                                        alt="Polaroid View"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>

                                {/* Text details inside polaroid bottom margin */}
                                <div className="w-full flex flex-col mt-1 font-kalam text-center leading-tight gap-y-0.5">
                                    <span className="text-[9px] font-bold text-[#743951] truncate">
                                        {photo.guestName}
                                    </span>
                                    <span className="text-[7.5px] text-stone-600 truncate italic">
                                        "{photo.caption}"
                                    </span>
                                    <div className="flex justify-between items-center mt-0.5 pt-0.5 border-t border-stone-200/60">
                                        <div className="flex gap-1 z-20">
                                            {photo.creatorId === userId && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingPhotoId(photo.id);
                                                            setEditingPhotoOldFileId(photo.fileId);
                                                            setGuestName(photo.guestName);
                                                            setCaption(photo.caption);
                                                            setTempImage(photo.imageSrc);
                                                            setSelectedFile(null);
                                                        }}
                                                        className="p-0.5 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                                                        title="Edit foto"
                                                    >
                                                        <Pencil className="w-2.5 h-2.5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeletePhoto(photo.id, photo.fileId);
                                                        }}
                                                        className="p-0.5 hover:bg-red-105 rounded text-red-600 cursor-pointer transition-colors"
                                                        title="Hapus foto"
                                                    >
                                                        <Trash2 className="w-2.5 h-2.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <span className="text-[6.5px] text-stone-400 font-sans font-semibold ml-auto">
                                            {photo.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* View All Photos Link Button (Navigates to /photos page) */}
            {photos.length > 12 && (
                <div
                    style={{
                        position: "absolute",
                        left: "2390px",
                        top: "2360px",
                        width: "480px",
                    }}
                    className="flex justify-center"
                >
                    <Link
                        href="/photos"
                        className="px-5 py-1 bg-white/90 border border-[#743951]/20 hover:bg-white text-[#743951] font-kalam font-bold text-[11px] rounded-full shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-image-pop"
                    >
                        View All Photos ({photos.length})
                    </Link>
                </div>
            )}

            {/* Hidden Input file helper */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </>
    );
}
