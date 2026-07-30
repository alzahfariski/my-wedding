"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Camera,
  Gift,
  Users,
  LogOut,
  Home,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { verifyAdminSession, logoutAdmin } from "@/app/actions/adminAuth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import WishesManager from "@/components/admin/WishesManager";
import PhotoboothManager from "@/components/admin/PhotoboothManager";
import ConfirmationsManager from "@/components/admin/ConfirmationsManager";
import GuestsManager from "@/components/admin/GuestsManager";

type AdminTab = "wishes" | "photobooth" | "confirmations" | "guests";

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("wishes");
  const [loggingOut, setLoggingOut] = useState(false);

  const checkAuth = async () => {
    setCheckingAuth(true);
    try {
      const valid = await verifyAdminSession();
      setIsAuthenticated(valid);
    } catch (err) {
      console.error("Session verification error:", err);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center items-center p-4">
        <div className="flex items-center gap-3 text-[#743951] font-sans font-bold text-sm bg-white px-6 py-4 rounded-2xl shadow-md border border-[#743951]/10 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Memeriksa hak akses admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans p-4 sm:p-8 md:p-10 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Navbar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md border border-[#743951]/20 rounded-3xl p-4 sm:p-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#743951] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-alex text-3xl font-bold text-[#743951]">
                  Admin Dashboard
                </h1>
                <span className="px-2.5 py-0.5 bg-[#743951]/10 text-[#743951] font-bold text-[10px] rounded-full border border-[#743951]/20 uppercase tracking-wider">
                  Firebase
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Pernikahan Alzah & Effri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href="/"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("wishes")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${activeTab === "wishes"
                ? "bg-[#743951] text-white shadow-md scale-102"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1. Wishes (Ucapan)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("photobooth")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${activeTab === "photobooth"
                ? "bg-[#743951] text-white shadow-md scale-102"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            <Camera className="w-4 h-4" />
            <span>2. Photobooth (Foto Memories)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("confirmations")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${activeTab === "confirmations"
                ? "bg-[#743951] text-white shadow-md scale-102"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            <Gift className="w-4 h-4" />
            <span>3. Confirmations (Konfirmasi Hadiah)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guests")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${activeTab === "guests"
                ? "bg-[#743951] text-white shadow-md scale-102"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Tamu Undangan & WA</span>
          </button>
        </nav>

        {/* Main Panel Content */}
        <section className="min-h-[500px]">
          {activeTab === "wishes" && <WishesManager />}
          {activeTab === "photobooth" && <PhotoboothManager />}
          {activeTab === "confirmations" && <ConfirmationsManager />}
          {activeTab === "guests" && <GuestsManager />}
        </section>
      </div>
    </main>
  );
}
