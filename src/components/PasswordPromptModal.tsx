"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, KeyRound, AlertCircle } from "lucide-react";
import { verifyPhotoPassword } from "@/app/actions/verifyPassword";

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordPromptModal({
  isOpen,
  onClose,
  onSuccess,
}: PasswordPromptModalProps) {
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isWeddingDay, setIsWeddingDay] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setErrorMsg(null);
    } else {
      const weddingDate = new Date("2026-08-05T00:00:00+07:00");
      const todayIsWeddingDay = new Date() >= weddingDate;
      setIsWeddingDay(todayIsWeddingDay);
      if (todayIsWeddingDay) {
        setPassword("alzahdaneffri");
      } else {
        setPassword("");
      }
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setVerifying(true);
    setErrorMsg(null);
    try {
      const res = await verifyPhotoPassword(password);
      if (res.success) {
        setPassword("");
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || "Password salah. Silakan tanyakan kepada panitia.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setVerifying(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-kalam"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FAF9F6] border-2 border-[#743951]/30 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative flex flex-col items-center animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-stone-400 hover:text-[#743951] rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-[#743951]/10 rounded-full flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6 text-[#743951]" />
        </div>

        <h3 className="text-lg font-bold text-[#743951] text-center">
          Masukkan Password Photo Booth
        </h3>
        {isWeddingDay ? (
          <div className="w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl mt-1 mb-4 text-center text-xs font-bold text-emerald-800 flex flex-col items-center justify-center gap-0.5 shadow-xs">
            <span>🎉 Hari H Pernikahan (5 Agustus 2026)!</span>
            <span className="font-sans text-[11px] font-normal text-emerald-700">
              Password otomatis diisi: <strong className="font-mono font-bold text-[#743951]">alzahdaneffri</strong>
            </span>
          </div>
        ) : (
          <p className="text-xs text-stone-600 italic text-center mt-1 mb-4">
            Password diumumkan pada acara resepsi pernikahan.
          </p>
        )}

        {errorMsg && (
          <div className="w-full p-2.5 bg-red-50 border border-red-200 rounded-xl mb-3 text-center text-xs font-bold text-red-700 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type={isWeddingDay ? "text" : "password"}
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ketik password di sini..."
            className="w-full px-3.5 py-2 rounded-xl border border-[#743951]/30 bg-stone-50 text-stone-800 focus:outline-none focus:border-[#743951] text-sm text-center font-sans tracking-widest"
          />

          <button
            type="submit"
            disabled={verifying || !password.trim()}
            className="w-full py-2.5 bg-[#743951] hover:bg-[#5c2d40] text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 text-sm cursor-pointer disabled:opacity-50"
          >
            {verifying ? "Verifikasi..." : "Lanjutkan"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
