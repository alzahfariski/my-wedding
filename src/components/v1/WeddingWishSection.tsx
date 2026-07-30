'use client';

import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Wish {
  id: string;
  name: string;
  text: string;
  color: string;
  date: string;
  creatorId?: string;
}

const DEFAULT_COLOR = '#fbcfe8'; // Soft Pink Default saved to database

export const WeddingWishSection: React.FC = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [userId, setUserId] = useState<string>('');

  // Initialize unique device user ID
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

  // Real-time Firestore Listener from 'wishes' collection
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Wish[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            name: data.name || 'Hamba Allah',
            text: data.text || data.comment || '',
            color: data.color || DEFAULT_COLOR,
            date: data.date || 'Terbaru',
            creatorId: data.creatorId,
          });
        });
        setWishes(list);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore snapshot error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const formattedDate = new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.');

      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        text: comment.trim(),
        comment: comment.trim(),
        color: DEFAULT_COLOR, // Always save default color #fbcfe8 to DB
        date: formattedDate,
        creatorId: userId,
        createdAt: serverTimestamp(),
      });

      setName('');
      setComment('');
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Error adding wish to Firestore:', err);
      alert('Gagal mengirim ucapan. Silakan periksa koneksi internet Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) {
      try {
        await deleteDoc(doc(db, 'wishes', id));
      } catch (err) {
        console.error('Error deleting wish:', err);
        alert('Gagal menghapus ucapan.');
      }
    }
  };

  return (
    <section className="wedding-wish-wrap py-12 px-4 relative">
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
        <div className="wedding-wish-head text-center pt-4 pb-6 px-4">
          <h1 className="wedding-wish-title text-4xl sm:text-5xl font-normal text-amber-950 pb-2">
            Wedding Wish
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light pt-1">
            Berikan ucapan selamat &amp; doa restu untuk kedua mempelai
          </p>
        </div>

        <div className="wedding-wish-body">
          {/* Elegant Form Container */}
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 mb-7">
            {successMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4 fill-emerald-600 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Ucapan &amp; doa restu Anda berhasil dikirim. Terima kasih!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field 1: Name */}
              <div className="form-group text-left mb-6">
                <label
                  className="block text-xs font-semibold text-amber-950 tracking-wide mb-3"
                  style={{ display: 'block', marginBottom: '12px' }}
                >
                  Nama <span className="text-rose-500">*</span>
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

              {/* Field 2: Text / Comment */}
              <div className="form-group text-left mb-6">
                <label
                  className="block text-xs font-semibold text-amber-950 tracking-wide mb-3"
                  style={{ display: 'block', marginBottom: '12px' }}
                >
                  Ucapan &amp; Doa Restu <span className="text-rose-500">*</span>
                </label>
                <textarea
                  className="form-control w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-stone-50/50 text-xs sm:text-sm text-amber-950 focus:outline-none focus:bg-white focus:border-[#784d2b] transition-all resize-none placeholder:text-stone-400 font-sans"
                  name="comment"
                  rows={3}
                  placeholder="Berikan ucapan selamat &amp; doa restu..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 text-center">
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
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Ucapan</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real-time Wishes Feed Header Below Form */}
          <div className="wishes-feed-header text-left mt-8 pt-4 mb-4 flex items-center justify-between px-1">
            <span className="text-sm sm:text-base font-semibold text-amber-950 tracking-wide">
              Ucapan ({wishes.length})
            </span>
            {loading && (
              <span className="text-xs text-amber-800/60 animate-pulse font-light">Memuat...</span>
            )}
          </div>

          {/* Real-time Wishes Feed List: Completely Transparent Background for Cards in v1 */}
          <div className="comment-wrap space-y-4 max-h-[480px] overflow-y-auto pr-1 text-left">
            {wishes.length === 0 && !loading ? (
              <div className="p-6 bg-transparent rounded-xl border border-dashed border-amber-900/20 text-center text-xs text-stone-500 italic">
                Belum ada ucapan. Jadilah yang pertama memberikan ucapan!
              </div>
            ) : (
              wishes.map((item) => (
                <div
                  key={item.id}
                  className="v1-wish-card p-5 sm:p-6 bg-transparent rounded-xl border border-amber-900/20 text-left relative transition-all"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-amber-900/15 pb-2.5 mb-2.5">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{item.name}</span>

                    {item.creatorId === userId && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1.5"
                        title="Hapus Ucapan"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal whitespace-pre-wrap px-1 py-1.5">
                    "{item.text}"
                  </p>

                  <div className="mt-3 text-[10px] text-stone-500/80 text-right font-sans">
                    {item.date}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
