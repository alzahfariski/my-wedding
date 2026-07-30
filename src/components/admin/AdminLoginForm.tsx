"use client";

import { useState } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { loginAdmin } from "@/app/actions/adminAuth";

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Silakan isi username dan password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "Gagal masuk. Username atau password salah.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan sistem saat mencoba masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-[#743951]/20 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Header Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#743951] via-[#8c4b66] to-[#5c2d40]" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#743951]/10 border border-[#743951]/20 flex items-center justify-center text-[#743951] mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-alex text-4xl font-bold text-[#743951] mb-1">
            Admin Panel
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Manajemen Data Pernikahan Alzah & Effri
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Username Admin
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:border-[#743951] focus:ring-2 focus:ring-[#743951]/10 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Password Admin
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:border-[#743951] focus:ring-2 focus:ring-[#743951]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-stone-600 transition-colors p-1"
                title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#743951] hover:bg-[#5c2d40] text-white text-sm font-bold rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk Admin Panel</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
