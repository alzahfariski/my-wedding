'use client';

import React, { useState, useEffect } from 'react';
import { submitConfirmation } from '@/services/confirmationService';
import { formatRupiahInput } from '@/lib/formatRupiah';

export const GiftConfirmationSection: React.FC = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [bank, setBank] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let storedId = localStorage.getItem('wedding_user_id');
            if (!storedId) {
                storedId = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
                localStorage.setItem('wedding_user_id', storedId);
            }
            setUserId(storedId);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!name.trim()) {
            setErrorMsg('Nama pengirim wajib diisi.');
            return;
        }

        const numericAmount = amount.replace(/[^0-9]/g, '');
        if (!numericAmount || parseInt(numericAmount, 10) <= 0) {
            setErrorMsg('Nominal hadiah harus berupa angka yang valid (contoh: 100.000).');
            return;
        }

        setSubmitting(true);
        try {
            await submitConfirmation({
                name: name.trim(),
                amount: amount.trim(),
                bank: bank.trim(),
                message: message.trim(),
                creatorId: userId,
            });

            setName('');
            setAmount('');
            setBank('');
            setMessage('');
            setSuccessMsg(true);
            setTimeout(() => setSuccessMsg(false), 5000);
        } catch (err) {
            console.error('Error submitting gift confirmation:', err);
            setErrorMsg('Gagal mengirim konfirmasi. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="wedding-wish-wrap py-10 px-4 relative">
            <div className="orn-wish-1 right">
                <div className="image-wrap">
                    <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
                </div>
            </div>
            <div className="orn-wish-1 left">
                <div className="image-wrap">
                    <img src="/assets/v1/ornaments/Orn-46.png" alt="" />
                </div>
            </div>

            <div className="wedding-wish-inner max-w-lg mx-auto">
                <div className="wedding-wish-head text-center pt-2 pb-6 px-4">
                    <h1 className="wedding-wish-title text-4xl sm:text-5xl font-normal text-amber-950 pb-2">
                        Gift Confirmation
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-600 font-light pt-1">
                        Konfirmasi pengiriman amplop digital &amp; hadiah untuk kedua mempelai
                    </p>
                </div>

                <div className="wedding-wish-body">
                    {/* Form Container matching v1 WeddingWishSection style */}
                    <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-2xl shadow-xs">
                        {errorMsg && (
                            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl text-center font-medium flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 fill-rose-600 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-medium flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 fill-emerald-600 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                <span>Konfirmasi hadiah Anda berhasil dikirim. Terima kasih banyak!</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Field 1: Name */}
                            <div className="form-group text-left mb-4">
                                <label className="block text-xs font-semibold text-amber-950 tracking-wide mb-2">
                                    Nama Pengirim <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-stone-50/50 text-xs sm:text-sm text-amber-950 focus:outline-none focus:bg-white focus:border-[#784d2b] transition-all placeholder:text-stone-400 font-sans"
                                    placeholder="Tuliskan nama Anda..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Field 2: Amount (Rupiah Formatted) */}
                            <div className="form-group text-left mb-4">
                                <label className="block text-xs font-semibold text-amber-950 tracking-wide mb-2">
                                    Nominal Hadiah (Rp) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="amount"
                                    inputMode="numeric"
                                    pattern="[0-9.]*"
                                    className="form-control w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-stone-50/50 text-xs sm:text-sm text-amber-950 font-mono font-bold focus:outline-none focus:bg-white focus:border-[#784d2b] transition-all placeholder:text-stone-400"
                                    placeholder="cth: 100.000"
                                    value={amount}
                                    onChange={(e) => setAmount(formatRupiahInput(e.target.value))}
                                    required
                                />
                            </div>

                            {/* Field 3: Bank (Optional) */}
                            <div className="form-group text-left mb-4">
                                <label className="block text-xs font-semibold text-amber-950 tracking-wide mb-2">
                                    Bank Asal / Metode Transfer <span className="text-stone-400 font-normal">(Opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="bank"
                                    className="form-control w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-stone-50/50 text-xs sm:text-sm text-amber-950 focus:outline-none focus:bg-white focus:border-[#784d2b] transition-all placeholder:text-stone-400 font-sans"
                                    placeholder="cth: Bank BCA / Mandiri / Seabank / QRIS"
                                    value={bank}
                                    onChange={(e) => setBank(e.target.value)}
                                />
                            </div>

                            {/* Field 4: Message (Optional) */}
                            <div className="form-group text-left mb-4">
                                <label className="block text-xs font-semibold text-amber-950 tracking-wide mb-2">
                                    Pesan / Catatan Tambahan <span className="text-stone-400 font-normal">(Opsional)</span>
                                </label>
                                <textarea
                                    className="form-control w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-stone-50/50 text-xs sm:text-sm text-amber-950 focus:outline-none focus:bg-white focus:border-[#784d2b] transition-all resize-none placeholder:text-stone-400 font-sans"
                                    name="message"
                                    rows={3}
                                    placeholder="Berikan pesan atau catatan untuk mempelai..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 text-center">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="submit submit-comment w-full py-3.5 px-8 bg-[#784d2b] hover:bg-[#5f3c21] text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin fill-white" viewBox="0 0 24 24">
                                                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                                            </svg>
                                            <span>Mengirim Konfirmasi...</span>
                                        </>
                                    ) : (
                                        <span>Kirim Konfirmasi Hadiah</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
