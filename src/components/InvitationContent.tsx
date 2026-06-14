"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Wish {
  id: number;
  name: string;
  relation: string;
  message: string;
  timestamp: string;
}

export default function InvitationContent() {
  // --- Countdown Timer States ---
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("August 5, 2026 09:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- RSVP States ---
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpStatus, setRsvpStatus] = useState("Hadir");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
    setTimeout(() => {
      setRsvpSubmitted(false);
      setRsvpName("");
      setRsvpGuests("1");
      alert("Terima kasih! Konfirmasi kehadiran Anda telah dikirim.");
    }, 800);
  };

  // --- Guest Book / Wishes States ---
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: 1,
      name: "Rian Aditya",
      relation: "Teman Kuliah Alzah",
      message: "Selamat ya Alzah & Effri! Semoga dilancarkan sampai hari-H dan menjadi keluarga yang sakinah, mawaddah, warahmah. Amin!",
      timestamp: "1 jam yang lalu",
    },
    {
      id: 2,
      name: "Siti Rahma",
      relation: "Sahabat Effri",
      message: "Terharu banget dapet kabar bahagia ini. Lancar ya kesayanganku Effri, can't wait to see you in your wedding dress!",
      timestamp: "3 jam yang lalu",
    },
    {
      id: 3,
      name: "Keluarga Besar Bpk. Darmawan",
      relation: "Kerabat Keluarga",
      message: "Selamat menempuh hidup baru untuk kedua mempelai. Semoga dipenuhi keberkahan selalu rumah tangganya.",
      timestamp: "5 jam yang lalu",
    },
  ]);
  const [wishName, setWishName] = useState("");
  const [wishRelation, setWishRelation] = useState("");
  const [wishMessage, setWishMessage] = useState("");

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;

    const newWish: Wish = {
      id: Date.now(),
      name: wishName,
      relation: wishRelation || "Teman",
      message: wishMessage,
      timestamp: "Baru saja",
    };

    setWishes([newWish, ...wishes]);
    setWishName("");
    setWishRelation("");
    setWishMessage("");
  };

  // --- Copy Clipboard Helper ---
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-stone-50 text-stone-800 shadow-2xl min-h-screen font-sans relative overflow-x-hidden pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col justify-between items-center py-16 px-6 text-center bg-gradient-to-b from-rose-50/40 via-stone-50 to-stone-50">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-rose-500 font-semibold">
            The Wedding Invitation
          </p>
          <div className="h-[1px] w-12 bg-rose-200 mx-auto"></div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-5xl font-bold tracking-wide text-stone-800 leading-tight">
            Alzah <br />
            <span className="text-3xl font-light font-serif text-rose-400">&</span> <br />
            Effri
          </h2>
          <p className="text-sm tracking-[0.2em] text-stone-500 font-medium">5 AGUSTUS 2026</p>
        </div>

        <div className="max-w-xs space-y-4">
          <p className="text-xs italic text-stone-500 leading-relaxed">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
          </p>
          <p className="text-[10px] font-semibold tracking-wider text-rose-600 uppercase">
            — Q.S. Ar-Rum: 21
          </p>
        </div>
      </section>

      {/* 2. THE COUPLE SECTION */}
      <section className="py-20 px-6 space-y-16 bg-white rounded-t-[40px] shadow-inner">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-3xl font-semibold text-stone-800">Mempelai Bahagia</h3>
          <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
          <p className="text-xs text-stone-400">Kami yang memohon doa restu Anda</p>
        </div>

        {/* Groom Profile */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-rose-100 shadow-md">
            <div className="absolute inset-0 bg-stone-100 flex items-center justify-center text-stone-400">
              {/* Dummy Photo Placeholder */}
              <span className="text-xs">Foto Alzah (Groom)</span>
            </div>
          </div>
          <h4 className="font-serif text-2xl font-bold text-stone-800">Alzah Fariski</h4>
          <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-xs">
            Putra pertama dari pasangan <br />
            <span className="font-semibold text-stone-700">Bpk. Ahmad Fariski</span> <br />
            & <span className="font-semibold text-stone-700">Ibu Siti Aminah</span>
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 text-rose-600 text-xs hover:bg-rose-50 transition-colors"
          >
            <span>Instagram</span>
          </a>
        </div>

        <div className="flex justify-center items-center py-2 text-rose-300 text-2xl">
          ❤️
        </div>

        {/* Bride Profile */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-rose-100 shadow-md">
            <div className="absolute inset-0 bg-stone-100 flex items-center justify-center text-stone-400">
              {/* Dummy Photo Placeholder */}
              <span className="text-xs">Foto Effri (Bride)</span>
            </div>
          </div>
          <h4 className="font-serif text-2xl font-bold text-stone-800">Effri Nuraini</h4>
          <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-xs">
            Putri bungsu dari pasangan <br />
            <span className="font-semibold text-stone-700">Bpk. H. Siswanto</span> <br />
            & <span className="font-semibold text-stone-700">Ibu Hj. Ningsih</span>
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 text-rose-600 text-xs hover:bg-rose-50 transition-colors"
          >
            <span>Instagram</span>
          </a>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="text-center space-y-2 mb-12">
          <h3 className="font-serif text-3xl font-semibold text-stone-800">Kisah Cinta Kami</h3>
          <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
          <p className="text-xs text-stone-400">Bagaimana lembaran cerita kami dimulai</p>
        </div>

        {/* Story Timeline */}
        <div className="relative border-l border-rose-200 ml-4 pl-8 space-y-12">
          {/* Milestone 1 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-1 bg-rose-500 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></div>
            <span className="text-[10px] tracking-wider text-rose-500 font-bold uppercase">2021 — Awal Bertemu</span>
            <h5 className="font-semibold text-stone-800 mt-1">Takdir Mempertemukan</h5>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Pertemuan pertama kami bermula dari kolaborasi project pekerjaan yang sama. Berawal dari diskusi profesional, perlahan kami menemukan kecocokan visi dalam banyak hal.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-1 bg-rose-500 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></div>
            <span className="text-[10px] tracking-wider text-rose-500 font-bold uppercase">2024 — Lamaran</span>
            <h5 className="font-semibold text-stone-800 mt-1">Mengikat Janji Suci</h5>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Setelah mematangkan niat dan restu kedua belah pihak keluarga besar, Alzah meminang Effri secara resmi dalam sebuah prosesi lamaran keluarga hangat.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="relative">
            <div className="absolute -left-[41px] top-1 bg-rose-500 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center"></div>
            <span className="text-[10px] tracking-wider text-rose-500 font-bold uppercase">2026 — Pernikahan</span>
            <h5 className="font-semibold text-stone-800 mt-1">Menempuh Babak Baru</h5>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Hari ini kami menyatukan komitmen kami dalam akad nikah suci, menyongsong petualangan hidup sebagai suami dan istri.
            </p>
          </div>
        </div>
      </section>

      {/* 4. EVENT DETAILS SECTION */}
      <section className="py-20 px-6 bg-white space-y-12">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-3xl font-semibold text-stone-800">Detail Acara</h3>
          <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
          <p className="text-xs text-stone-400">Jadwal & Lokasi Pelaksanaan</p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto text-center">
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-bold text-rose-800 tabular-nums">{timeLeft.days}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Hari</span>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-bold text-rose-800 tabular-nums">{timeLeft.hours}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Jam</span>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-bold text-rose-800 tabular-nums">{timeLeft.minutes}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Menit</span>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-2.5 shadow-sm">
            <span className="block text-2xl font-bold text-rose-800 tabular-nums">{timeLeft.seconds}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-500">Detik</span>
          </div>
        </div>

        {/* Ceremony details cards */}
        <div className="space-y-6">
          {/* Card 1: Akad */}
          <div className="border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4 bg-gradient-to-b from-stone-50/40 to-stone-50">
            <h5 className="font-serif text-xl font-bold text-rose-800 text-center border-b border-rose-100 pb-2">
              Akad Nikah
            </h5>
            <div className="space-y-2 text-center text-xs text-stone-600">
              <p className="font-bold">Rabu, 5 Agustus 2026</p>
              <p>Pukul 09:00 - 11:00 WIB</p>
              <p className="mt-2 font-medium text-stone-800">Masjid Agung Al-Mu'minun</p>
              <p>Jl. Melati Raya No. 45, Jakarta Selatan</p>
              <p className="text-[10px] text-stone-400 mt-2 font-medium">Dresscode: Putih Bersih / Nasional</p>
            </div>
          </div>

          {/* Card 2: Resepsi */}
          <div className="border border-stone-100 rounded-2xl p-6 shadow-sm space-y-4 bg-gradient-to-b from-stone-50/40 to-stone-50">
            <h5 className="font-serif text-xl font-bold text-rose-800 text-center border-b border-rose-100 pb-2">
              Resepsi Pernikahan
            </h5>
            <div className="space-y-2 text-center text-xs text-stone-600">
              <p className="font-bold">Rabu, 5 Agustus 2026</p>
              <p>Pukul 12:00 - 15:00 WIB</p>
              <p className="mt-2 font-medium text-stone-800">Ballroom Grand Palace Hotel</p>
              <p>Jl. Sudirman Kav. 12-14, Jakarta Selatan</p>
              <p className="text-[10px] text-stone-400 mt-2 font-medium">Dresscode: Batik / Semi Formal</p>
            </div>
          </div>
        </div>

        {/* Maps & Streaming Links */}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-stone-800 hover:bg-stone-900 text-white rounded-full flex items-center justify-center gap-2 text-xs font-semibold shadow-md transition-colors"
          >
            <span>Navigasi Google Maps</span>
          </a>
          
          <a
            href="https://zoom.us"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center gap-2 text-xs font-semibold shadow-md transition-colors"
          >
            <span>Live Streaming</span>
          </a>
        </div>
      </section>

      {/* 5. GALLERY SECTION */}
      <section className="py-20 px-6 bg-stone-50 space-y-12">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-3xl font-semibold text-stone-800">Galeri Kebersamaan</h3>
          <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
          <p className="text-xs text-stone-400">Momen indah pra-pernikahan kami</p>
        </div>

        {/* Photo Grid with Lazy Load */}
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="relative aspect-square bg-stone-200 overflow-hidden rounded-xl shadow-sm border border-white"
            >
              <div className="absolute inset-0 flex items-center justify-center text-[10px] text-stone-400 text-center p-2">
                Photo Prewed {item}
              </div>
              <Image
                src={`/images/locked/flower-left.png`} // Fallback asset for safety
                alt={`Prewedding ${item}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 150px, 200px"
                className="object-cover opacity-20 hover:opacity-40 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Video Teaser */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-center text-stone-500">
            Video Cinematic
          </h5>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-stone-800 flex items-center justify-center">
            {/* Embedded mockup placeholder */}
            <div className="text-center space-y-2 text-stone-400 p-4">
              <span className="text-2xl">🎬</span>
              <p className="text-xs">Cinematic Prewedding Video Teaser</p>
              <p className="text-[10px] text-stone-500">YouTube / Vimeo Embed Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE SECTION: RSVP & WISHES */}
      <section className="py-20 px-6 bg-white space-y-16">
        {/* RSVP FORM */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-3xl font-semibold text-stone-800">Konfirmasi Kehadiran</h3>
            <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
            <p className="text-xs text-stone-400">Pastikan kedatangan Anda di hari bahagia kami</p>
          </div>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-sm mx-auto">
            <div className="space-y-1">
              <label htmlFor="rsvp-name" className="text-xs font-semibold text-stone-500">Nama Lengkap</label>
              <input
                id="rsvp-name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                className="w-full h-11 border border-stone-200 rounded-xl px-4 text-sm focus:outline-none focus:border-rose-400 bg-stone-50/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="rsvp-guests" className="text-xs font-semibold text-stone-500">Jumlah Tamu</label>
              <select
                id="rsvp-guests"
                value={rsvpGuests}
                onChange={(e) => setRsvpGuests(e.target.value)}
                className="w-full h-11 border border-stone-200 rounded-xl px-4 text-sm focus:outline-none focus:border-rose-400 bg-stone-50/50"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
                <option value="4">4 Orang</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="block text-xs font-semibold text-stone-500">Konfirmasi</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("Hadir")}
                  className={`h-11 rounded-xl text-xs font-semibold border transition-all ${
                    rsvpStatus === "Hadir"
                      ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-100"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Saya Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus("Tidak Hadir")}
                  className={`h-11 rounded-xl text-xs font-semibold border transition-all ${
                    rsvpStatus === "Tidak Hadir"
                      ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-100"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Berhalangan Hadir
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-sm shadow-md shadow-rose-100 transition-all cursor-pointer mt-4"
            >
              Kirim Konfirmasi
            </button>
          </form>
        </div>

        <div className="h-[1px] w-full bg-stone-100"></div>

        {/* GUEST BOOK / WISH WALL */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-3xl font-semibold text-stone-800">Doa & Ucapan</h3>
            <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
            <p className="text-xs text-stone-400">Berikan doa restu Anda kepada mempelai</p>
          </div>

          {/* Wish Input Form */}
          <form onSubmit={handleWishSubmit} className="space-y-4 max-w-sm mx-auto">
            <div className="space-y-1">
              <label htmlFor="wish-name" className="text-xs font-semibold text-stone-500">Nama Anda</label>
              <input
                id="wish-name"
                type="text"
                placeholder="Nama Anda"
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                className="w-full h-11 border border-stone-200 rounded-xl px-4 text-sm focus:outline-none focus:border-rose-400 bg-stone-50/50"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="wish-relation" className="text-xs font-semibold text-stone-500">Hubungan / Relasi (Opsional)</label>
              <input
                id="wish-relation"
                type="text"
                placeholder="Contoh: Teman Kerja Alzah, Sahabat SMA Effri"
                value={wishRelation}
                onChange={(e) => setWishRelation(e.target.value)}
                className="w-full h-11 border border-stone-200 rounded-xl px-4 text-sm focus:outline-none focus:border-rose-400 bg-stone-50/50"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="wish-message" className="text-xs font-semibold text-stone-500">Doa / Ucapan</label>
              <textarea
                id="wish-message"
                placeholder="Tuliskan ucapan selamat & doa restu terbaik Anda..."
                rows={4}
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                className="w-full border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:border-rose-400 bg-stone-50/50 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-stone-800 hover:bg-stone-900 text-white rounded-full font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Kirim Ucapan
            </button>
          </form>

          {/* Wishes List Feed */}
          <div className="max-w-sm mx-auto space-y-4 max-h-[400px] overflow-y-auto pr-1 border-t border-stone-100 pt-6">
            {wishes.map((w) => (
              <div key={w.id} className="bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-semibold text-stone-800 text-xs">{w.name}</h6>
                    <span className="text-[9px] text-rose-500 font-medium">{w.relation}</span>
                  </div>
                  <span className="text-[9px] text-stone-400">{w.timestamp}</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{w.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIGITAL GIFT SECTION */}
      <section className="py-20 px-6 bg-stone-50 rounded-b-[40px] space-y-12 shadow-inner">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-3xl font-semibold text-stone-800">Kado Digital</h3>
          <div className="h-[2px] w-16 bg-rose-300 mx-auto"></div>
          <p className="text-xs text-stone-400">Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan hadiah</p>
        </div>

        {/* Bank accounts */}
        <div className="space-y-4 max-w-sm mx-auto">
          {/* Bank 1 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600">Bank Transfer</span>
                <h5 className="font-semibold text-stone-800 text-base mt-0.5">Bank Mandiri</h5>
              </div>
              <span className="text-xl">💳</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-stone-400 block">Nomor Rekening</span>
              <div className="flex items-center justify-between bg-stone-50 rounded-lg p-2 border border-stone-100">
                <span className="font-mono text-sm font-semibold tracking-wider text-stone-700">1370012345678</span>
                <button
                  onClick={() => handleCopy("1370012345678", 1)}
                  className="px-3 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {copiedIndex === 1 ? "Salin Berhasil" : "Salin"}
                </button>
              </div>
              <span className="text-[10px] text-stone-500 font-medium block">a.n Alzah Fariski</span>
            </div>
          </div>

          {/* Bank 2 */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600">Bank Transfer</span>
                <h5 className="font-semibold text-stone-800 text-base mt-0.5">Bank BCA</h5>
              </div>
              <span className="text-xl">💳</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] text-stone-400 block">Nomor Rekening</span>
              <div className="flex items-center justify-between bg-stone-50 rounded-lg p-2 border border-stone-100">
                <span className="font-mono text-sm font-semibold tracking-wider text-stone-700">8605123456</span>
                <button
                  onClick={() => handleCopy("8605123456", 2)}
                  className="px-3 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  {copiedIndex === 2 ? "Salin Berhasil" : "Salin"}
                </button>
              </div>
              <span className="text-[10px] text-stone-500 font-medium block">a.n Effri Nuraini</span>
            </div>
          </div>
        </div>

        {/* Physical Gift / Package */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4 max-w-sm mx-auto text-center">
          <span className="text-2xl">🎁</span>
          <div className="space-y-1">
            <h5 className="font-semibold text-stone-800 text-sm">Kirim Hadiah Fisik</h5>
            <p className="text-xs text-stone-500">Anda dapat mengirimkan kado fisik ke alamat pengantin berikut:</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-left relative">
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Perumahan Puri Indah, Blok C4 No. 12, Kembangan, Jakarta Barat, 11610.
            </p>
            <button
              onClick={() => handleCopy("Perumahan Puri Indah, Blok C4 No. 12, Kembangan, Jakarta Barat, 11610", 3)}
              className="mt-3 w-full h-8 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-semibold transition-colors cursor-pointer flex items-center justify-center"
            >
              {copiedIndex === 3 ? "Alamat Berhasil Disalin" : "Salin Alamat Lengkap"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-[10px] text-stone-400 space-y-1">
        <p>© 2026 Alzah & Effri Wedding. All Rights Reserved.</p>
        <p className="font-light">Created with ❤️ for Alzah & Effri</p>
      </footer>

    </div>
  );
}
