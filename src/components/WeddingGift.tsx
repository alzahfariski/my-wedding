"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

export default function WeddingGiftSection() {
    const [copiedCard, setCopiedCard] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        bank: "",
        amount: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleCopy = (accountNumber: string, cardId: string) => {
        navigator.clipboard.writeText(accountNumber);
        setCopiedCard(cardId);
        setTimeout(() => setCopiedCard(null), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            setFormData({ name: "", bank: "", amount: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

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