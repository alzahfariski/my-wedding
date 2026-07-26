"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, Check, RefreshCw, Pencil, Trash2 } from "lucide-react";
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
    {
        id: "photo-5",
        guestName: "Budi Santoso",
        imageSrc: "/assets/images/img_5.png",
        caption: "Congrats bro!",
        date: "26.07.2026",
    },
    {
        id: "photo-6",
        guestName: "Siti Lestari",
        imageSrc: "/assets/images/img_6.png",
        caption: "Happy wedding!",
        date: "26.07.2026",
    },
    {
        id: "photo-7",
        guestName: "Dewi & Hendra",
        imageSrc: "/assets/images/img_1.png",
        caption: "Sangat seru!",
        date: "26.07.2026",
    },
    {
        id: "photo-8",
        guestName: "Adi Nugroho",
        imageSrc: "/assets/images/img_2.png",
        caption: "Selamat ya!",
        date: "26.07.2026",
    },
];

export default function PhotoBoothSection() {
    const [photos, setPhotos] = useState<PinnedPhoto[]>([]);
    const [guestName, setGuestName] = useState("");
    const [caption, setCaption] = useState("");
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [userId, setUserId] = useState("");
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [editingPhotoOldFileId, setEditingPhotoOldFileId] = useState<string | undefined>(undefined);
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);

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
                // Create Photo: Must have a selected file
                if (!selectedFile) {
                    alert("Silakan pilih foto terlebih dahulu.");
                    setSubmitting(false);
                    return;
                }

                const formData = new FormData();
                formData.append("file", selectedFile);
                const driveRes = await uploadToDrive(formData);

                if (!driveRes.success) {
                    throw new Error(driveRes.error || "Gagal mengunggah foto ke Google Drive.");
                }

                await addDoc(collection(db, "photos"), {
                    guestName: guestName.trim(),
                    caption: caption.trim() || "Momen bahagia!",
                    imageSrc: driveRes.imageUrl,
                    fileId: driveRes.fileId,
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
        } catch (error) {
            console.error("Error submitting photo:", error);
            alert("Terjadi kesalahan saat memproses foto. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePhoto = async (id: string, fileId?: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
        try {
            if (fileId) {
                await deleteFromDrive(fileId);
            }
            await deleteDoc(doc(db, "photos", id));
        } catch (error) {
            console.error("Error deleting photo:", error);
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
            {/* Photo Booth Form (Landscape Paper Card Layout) - Width 480px, left: 2190px */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "1120px",
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

            {/* Pinned Real-time Photos (Polaroids Grid) - Width 480px, ends at 2670px */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "1320px",
                    width: "480px",
                }}
                className="grid grid-cols-4 gap-2.5"
            >
                {activePhotos.map((photo, index) => {
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
                })}
            </div>

            {/* View All Photos Button */}
            <div
                style={{
                    position: "absolute",
                    left: "2190px",
                    top: "1760px",
                    width: "480px",
                }}
                className="flex justify-center"
            >
                <button
                    type="button"
                    onClick={() => setIsViewAllOpen(true)}
                    className="px-5 py-1 bg-white/90 border border-[#743951]/20 hover:bg-white text-[#743951] font-kalam font-bold text-[11px] rounded-full shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95 animate-image-pop"
                >
                    View All Photos ({photos.length})
                </button>
            </div>

            {/* View All Photos Modal */}
            {isViewAllOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#FAF9F6] border-2 border-[#743951]/30 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col p-6 shadow-2xl relative font-kalam text-[#743951]">
                        {/* Close button */}
                        <button
                            onClick={() => setIsViewAllOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-[#743951] transition-colors p-1 cursor-pointer rounded-full hover:bg-stone-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <h3 className="text-2xl font-bold text-center border-b border-[#743951]/25 pb-3 mb-6 italic">
                            All Polaroid Photos ({photos.length})
                        </h3>
                        
                        <div className="overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-[#743951]/20">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4">
                                {photos.map((photo, index) => {
                                    const rotClass = rotations[index % rotations.length];
                                    return (
                                        <div
                                            key={photo.id}
                                            className={`w-full ${rotClass} bg-[#fafaf9] rounded shadow-md border border-stone-200 p-2 pb-3.5 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:rotate-0 select-none relative`}
                                        >
                                            {/* Tape decoration */}
                                            <div className="absolute -top-1.5 w-6 h-2 bg-amber-100/60 rotate-[-8deg] rounded-sm shadow-sm" />

                                            {/* Polaroid Image */}
                                            <div className="relative w-full aspect-square bg-stone-100 border border-stone-200/50 rounded-sm overflow-hidden">
                                                <Image
                                                    src={photo.imageSrc}
                                                    alt="Polaroid View"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>

                                            {/* Polaroid details */}
                                            <div className="w-full flex flex-col mt-2 font-kalam text-center leading-tight gap-y-0.5">
                                                <span className="text-[10px] font-bold text-[#743951] truncate">
                                                    {photo.guestName}
                                                </span>
                                                <span className="text-[8.5px] text-stone-600 truncate italic">
                                                    "{photo.caption}"
                                                </span>
                                                <div className="flex justify-between items-center mt-1 pt-1 border-t border-stone-200/60">
                                                    <div className="flex gap-1.5 z-20">
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
                                                                        setIsViewAllOpen(false); // Close to focus on form
                                                                    }}
                                                                    className="p-1 hover:bg-[#743951]/15 rounded text-[#743951] cursor-pointer transition-colors"
                                                                    title="Edit foto"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeletePhoto(photo.id, photo.fileId);
                                                                    }}
                                                                    className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer transition-colors"
                                                                    title="Hapus foto"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <span className="text-[7.5px] text-stone-400 font-sans font-semibold ml-auto">
                                                        {photo.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
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
