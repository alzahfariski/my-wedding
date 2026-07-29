"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Copy, Check, AlertCircle } from "lucide-react";
import { submitConfirmation } from "@/services/confirmationService";

interface WeddingGiftSectionProps {
    isMobile?: boolean;
}

export default function WeddingGiftSection({ isMobile = false }: WeddingGiftSectionProps) {
    const [copiedCard, setCopiedCard] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        bank: "",
        amount: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        let storedId = localStorage.getItem("wedding_user_id");
        if (!storedId) {
            storedId = "user_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem("wedding_user_id", storedId);
        }
        setUserId(storedId);
    }, []);

    const handleCopy = async (accountNumber: string, cardId: string) => {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                await navigator.clipboard.writeText(accountNumber);
            } else {
                // Fallback for non-HTTPS (HTTP) mobile browsers and webviews
                const textArea = document.createElement("textarea");
                textArea.value = accountNumber;
                textArea.style.position = "fixed";
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.width = "2em";
                textArea.style.height = "2em";
                textArea.style.padding = "0";
                textArea.style.border = "none";
                textArea.style.outline = "none";
                textArea.style.boxShadow = "none";
                textArea.style.background = "transparent";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopiedCard(cardId);
            setTimeout(() => setCopiedCard(null), 2000);
        } catch (err) {
            console.error("Failed to copy account number:", err);
            // Still show check mark feedback to user
            setCopiedCard(cardId);
            setTimeout(() => setCopiedCard(null), 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.amount.trim()) return;

        setSubmitting(true);
        setError(null);

        try {
            await submitConfirmation({
                name: formData.name,
                amount: formData.amount,
                bank: formData.bank,
                message: formData.message,
                creatorId: userId,
            });

            setSubmitted(true);
            setFormData({ name: "", bank: "", amount: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error("Error submitting confirmation to Firebase:", err);
            setError("Gagal mengirim konfirmasi. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isMobile) {
        return (
            <section id="section-5" className="w-full flex flex-col items-center py-8 px-4 text-center select-none">
                <h2 className="font-alex text-5xl font-normal text-[#737373] mb-2">Wedding Gift</h2>
                <p className="font-kalam text-xs text-stone-600 max-w-xs leading-relaxed mb-6">
                    our blessing and coming to our wedding are enough for us. However, if you want to give a gift we provide a Digital Envelope to make it easier for you. thank you
                </p>

                {/* Bank Account Cards Container */}
                <div className="w-full max-w-xs flex flex-col gap-4 mb-6">
                    {/* Seabank */}
                    <div className="flex flex-col text-left font-kalam text-[#743951]">
                        <span className="text-xs italic">a.n Effri Dwiyana Saputri</span>
                        <div className="relative w-full h-[72px] mt-1">
                            <Image
                                src="/assets/cover/tagname.png"
                                alt="Tag Card"
                                fill
                                className="object-stretch z-0"
                                unoptimized
                            />
                            <div className="relative z-10 w-full h-full flex items-center pl-3 pr-4 gap-3">
                                <button
                                    onClick={() => handleCopy("901127794450", "seabank")}
                                    className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer transition-transform active:scale-90 select-none"
                                >
                                    {copiedCard === "seabank" ? (
                                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-4.5 h-4.5 text-[#3b82f6]" />
                                    )}
                                </button>
                                <div className="flex flex-col text-left font-kalam text-[#743951] leading-tight select-all">
                                    <span className="text-[14px] font-bold italic">Seabank</span>
                                    <span className="text-[18px] font-normal italic mt-1 tracking-wide">901127794450</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BCA */}
                    <div className="flex flex-col text-left font-kalam text-[#743951]">
                        <span className="text-xs italic">a.n Alzah Fariski</span>
                        <div className="relative w-full h-[72px] mt-1">
                            <Image
                                src="/assets/cover/tagname.png"
                                alt="Tag Card"
                                fill
                                className="object-stretch z-0"
                                unoptimized
                            />
                            <div className="relative z-10 w-full h-full flex items-center pl-3 pr-4 gap-3">
                                <button
                                    onClick={() => handleCopy("6555500134", "bca")}
                                    className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer transition-transform active:scale-90 select-none"
                                >
                                    {copiedCard === "bca" ? (
                                        <Check className="w-4.5 h-4.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-4.5 h-4.5 text-[#3b82f6]" />
                                    )}
                                </button>
                                <div className="flex flex-col text-left font-kalam text-[#743951] leading-tight select-all">
                                    <span className="text-[14px] font-bold italic">BCA</span>
                                    <span className="text-[18px] font-normal italic mt-1 tracking-wide">6555500134</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Note & Car Decor */}
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <div className="relative w-[168px] h-[197px] flex flex-col items-center justify-center p-4 text-center">
                            <Image
                                src="/assets/cover/stiky.png"
                                alt="Sticky Address Note"
                                fill
                                className="object-stretch z-0"
                                unoptimized
                            />
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-1 font-kalam text-[#743951]">
                                <span className="text-xs font-bold italic">Gift Box Address</span>
                                <p className="text-[10px] leading-tight select-text">
                                    JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi
                                </p>
                                <button
                                    onClick={() => handleCopy("JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi", "address")}
                                    className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#743951]"
                                >
                                    {copiedCard === "address" ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-emerald-500">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5 text-[#3b82f6]" />
                                            <span>Copy Address</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="relative w-[100px] h-[100px]">
                            <Image
                                src="/assets/images/mobil.png"
                                alt="car decor"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>

                {/* Confirmation Form */}
                <div className="w-full max-w-xs p-2 font-kalam text-left text-[#743951]">
                    <div className="text-xl font-alex mb-3 border-b border-[#743951]/10 pb-1 text-center">
                        Confirmations Form
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-2 mb-3 bg-red-50 text-red-600 rounded border border-red-200 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                            <Check className="w-10 h-10 text-emerald-500" />
                            <span className="text-base font-bold">Terima Kasih!</span>
                            <p className="text-xs text-stone-600">
                                Konfirmasi Anda telah terkirim. Semoga kebaikan Anda dibalas dengan berkah melimpah.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Nama Pengirim</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="cth: Effri Dwi"
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Nominal</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="cth: Rp 100.000"
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Bank Asal (Opsional)</label>
                                <input
                                    type="text"
                                    value={formData.bank}
                                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                                    placeholder="cth: Bank BCA / Mandiri / E-Wallet"
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951]"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold">Ucapan / Doa untuk Mempelai</label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tulis ucapan selamat & doa restu Anda di sini..."
                                    className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50 text-xs text-stone-800 focus:outline-none focus:border-[#743951] resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-2 bg-[#743951] text-white font-semibold rounded shadow active:scale-95 transition-transform text-xs cursor-pointer mt-1"
                            >
                                {submitting ? "Mengirim Konfirmasi..." : "Kirim Konfirmasi"}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        );
    }

    return (
        <>
            <div
                style={{
                    position: "absolute",
                }}
                className="left-[2401px] top-[524px] font-alex text-[48px] font-normal text-[#737373] leading-relaxed select-none"
            >
                Wedding Gift
            </div>

            <div
                style={{
                    position: "absolute",
                }}
                className="left-[2402px] top-[600px] w-[470px] font-kalam text-[12px] font-normal text-stone-600 leading-relaxed select-none"
            >
                our blessing and coming to our wedding are enough for us. However, if you want to give a gift we provide a Digital Envelope to make it easier for you. thank you
            </div>

            {/* Account Owner 1: a.n Effri Dwiyana Saputri */}
            <div
                style={{
                    position: "absolute",
                }}
                className="left-[2396px] top-[672px] font-kalam text-[16px] font-normal italic text-[#743951] leading-relaxed select-none"
            >
                a.n Effri Dwiyana Saputri
            </div>

            {/* Bank Card 1: Seabank */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "708px",
                }}
                className="w-[280px] h-[72px] transition-transform duration-300 hover:scale-105 flex items-center relative"
            >
                <Image
                    src="/assets/cover/tagname.png"
                    alt="Tag Card"
                    fill
                    className="object-stretch z-0"
                    priority
                    unoptimized
                />

                {/* Card Overlay Content */}
                <div className="relative z-10 w-full h-full flex items-center pl-3 pr-4 gap-3">
                    {/* Copy Button */}
                    <button
                        onClick={() => handleCopy("901127794450", "seabank")}
                        className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer transition-transform active:scale-90 select-none"
                        title="Copy Seabank account number"
                    >
                        {copiedCard === "seabank" ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500 animate-image-pop" />
                        ) : (
                            <Copy className="w-4.5 h-4.5 text-[#3b82f6]" />
                        )}
                    </button>

                    {/* Seabank Text & Account Number */}
                    <div className="flex flex-col text-left font-kalam text-[#743951] leading-tight select-all">
                        <span className="text-[14px] font-bold italic leading-none">
                            Seabank
                        </span>
                        <span className="text-[20px] font-normal italic leading-none mt-1.5 tracking-wide">
                            901127794450
                        </span>
                    </div>
                </div>
            </div>

            {/* Account Owner 2: a.n Alzah Fariski */}
            <div
                style={{
                    position: "absolute",
                }}
                className="left-[2390px] top-[812px] font-kalam text-[16px] font-normal italic text-[#743951] leading-relaxed select-none"
            >
                a.n Alzah Fariski
            </div>

            {/* Bank Card 2: BCA */}
            <div
                style={{
                    position: "absolute",
                    left: "2390px",
                    top: "848px",
                }}
                className="w-[280px] h-[72px] transition-transform duration-300 hover:scale-105 flex items-center relative"
            >
                <Image
                    src="/assets/cover/tagname.png"
                    alt="Tag Card"
                    fill
                    className="object-stretch z-0"
                    priority
                    unoptimized
                />

                {/* Card Overlay Content */}
                <div className="relative z-10 w-full h-full flex items-center pl-3 pr-4 gap-3">
                    {/* Copy Button */}
                    <button
                        onClick={() => handleCopy("6555500134", "bca")}
                        className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer transition-transform active:scale-90 select-none"
                        title="Copy BCA account number"
                    >
                        {copiedCard === "bca" ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500 animate-image-pop" />
                        ) : (
                            <Copy className="w-4.5 h-4.5 text-[#3b82f6]" />
                        )}
                    </button>

                    {/* BCA Text & Account Number */}
                    <div className="flex flex-col text-left font-kalam text-[#743951] leading-tight select-all">
                        <span className="text-[14px] font-bold italic leading-none">
                            BCA
                        </span>
                        <span className="text-[20px] font-normal italic leading-none mt-1.5 tracking-wide">
                            6555500134
                        </span>
                    </div>
                </div>
            </div>

            {/* Offline Gift Address Card (Sticky Note) at the side (left: 1900px, top: 696px) */}
            <div
                style={{
                    position: "absolute",
                    left: "2720px",
                    top: "666px",
                }}
                className="w-[168px] h-[197px] transition-transform duration-300 hover:scale-105 flex flex-col items-center justify-center relative p-6 text-center select-none"
            >
                <Image
                    src="/assets/cover/stiky.png"
                    alt="Sticky Address Note"
                    fill
                    className="object-stretch z-0"
                    priority
                    unoptimized
                />

                {/* Card Overlay Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2 font-kalam text-[#743951]">
                    <span className="text-[12px] font-bold italic leading-none">
                        Gift Box Address
                    </span>
                    <p className="text-[10px] font-normal leading-tight max-w-[140px] select-text mt-1">
                        JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi
                    </p>

                    {/* Copy Address Button */}
                    <button
                        onClick={() => handleCopy("JI. Poros, Rt. 015, Desa Mekar Jaya (SPG) Merangin, Jambi", "address")}
                        className="mt-2.5 flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95 text-[11px] font-semibold text-[#743951]"
                    >
                        {copiedCard === "address" ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5 text-[#3b82f6]" />
                                <span>Copy Address</span>
                            </>
                        )}
                    </button>
                </div>


            </div>

            <div
                style={{
                    position: "absolute",
                    left: "2840px",
                    top: "802px",
                }}
                className="w-[214px] h-[214px] transition-transform duration-300 hover:scale-105"
            >
                <Image
                    src="/assets/images/mobil.png"
                    alt="baloon"
                    width={108}
                    height={108}
                    className="object-cover"
                    priority
                    unoptimized
                />
            </div>

            {/* Confirmation Form Card (positioned below all elements at left: 1590px, top: 940px, width: 550px) */}
            <div
                style={{
                    position: "absolute",
                    left: "2360px",
                    top: "940px",
                    width: "550px",
                }}
                className="p-6 font-kalam text-[#743951] select-none"
            >
                <div className="text-[20px] font-alex font-normal mb-4 border-b border-[#743951]/10 pb-1 text-start">
                    Confirmations Form
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-2 mb-3 bg-red-50 text-red-600 rounded border border-red-200 text-[12px]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {submitted ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                        <Check className="w-12 h-12 text-emerald-500 animate-image-pop" />
                        <span className="text-[18px] font-bold">Terima Kasih!</span>
                        <p className="text-[13px] text-stone-600 max-w-[320px]">
                            Konfirmasi Anda telah terkirim. Semoga kebaikan Anda dibalas dengan berkah melimpah.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 items-stretch">
                            {/* Left Column: Name, Nominal, Bank */}
                            <div className="flex flex-col gap-2.5 justify-between">
                                <div className="flex flex-col gap-0.5">
                                    <label className="text-[13px] font-semibold">Nama Pengirim</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="cth: Effri Dwi"
                                        className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[13px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <label className="text-[13px] font-semibold">Nominal</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="cth: Rp 100.000"
                                        className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[13px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <label className="text-[13px] font-semibold">Bank Asal (Opsional)</label>
                                    <input
                                        type="text"
                                        value={formData.bank}
                                        onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                                        placeholder="cth: Bank BCA / Mandiri / E-Wallet"
                                        className="px-3 py-1.5 rounded border border-[#743951]/20 bg-stone-50/50 text-[13px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Wishes (full height) & Submit Button */}
                            <div className="flex flex-col gap-2.5 justify-between h-full">
                                <div className="flex flex-col gap-0.5 flex-1">
                                    <label className="text-[13px] font-semibold">Ucapan / Doa untuk Mempelai</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tulis ucapan selamat & doa restu Anda di sini..."
                                        className="px-3 py-2 rounded border border-[#743951]/20 bg-stone-50/50 text-[13px] text-stone-800 focus:outline-none focus:border-[#743951] transition-colors resize-none flex-1 min-h-[96px]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 w-full py-1.5 bg-[#743951] text-white font-semibold rounded shadow-md cursor-pointer transition-all hover:bg-[#5c2d40] active:scale-[0.98] text-[13px] disabled:opacity-50 select-none h-[32px]"
                                >
                                    {submitting ? "Mengirim Konfirmasi..." : "Kirim Konfirmasi"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}