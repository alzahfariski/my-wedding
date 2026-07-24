export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 selection:bg-amber-100 selection:text-amber-900 transition-colors duration-300">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 md:py-24 w-full">
        {/* Header */}
        <header className="border-b border-stone-200 dark:border-stone-800 pb-8 mb-16 text-center md:text-left">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">Design System</span>
          <h1 className="text-4xl font-bold mt-2 tracking-tight text-stone-900 dark:text-stone-50">
            Typography & Font Pairing
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2 max-w-xl">
            A wedding-themed typography system featuring the elegant <strong className="font-semibold text-stone-800 dark:text-stone-200">Alex Brush</strong> script font and the warm, casual <strong className="font-semibold text-stone-800 dark:text-stone-200">Kalam</strong> handwritten font.
          </p>
        </header>

        {/* Mock Invitation Card Showcase */}
        <section className="mb-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-6">
            Live Preview / Font Pairing Demo
          </h2>
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 md:p-16 shadow-xl shadow-stone-100/50 dark:shadow-none flex flex-col items-center justify-center text-center">
            {/* Elegant Background Accent */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#854d0e_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            
            <div className="relative z-10 max-w-xl flex flex-col items-center">
              <span className="text-script-accent text-amber-700 dark:text-amber-400 mb-2">
                Save the Date
              </span>
              
              <h3 className="text-script-display text-stone-800 dark:text-stone-100 my-4 py-2">
                Romeo & Juliet
              </h3>
              
              <p className="text-handwritten-title text-stone-700 dark:text-stone-300 mt-4 max-w-sm">
                Are getting married!
              </p>
              
              <div className="w-12 h-[1px] bg-amber-500/50 my-6" />
              
              <p className="text-handwritten-body text-stone-600 dark:text-stone-400 max-w-md">
                We invite you to join us in celebrating our union, sharing laughter, and creating beautiful memories together.
              </p>
              
              <div className="mt-8 text-handwritten-caption text-amber-800/80 dark:text-amber-400/80">
                Saturday, October 24th, 2026 • The Grand Pavilion
              </div>
            </div>
          </div>
        </section>

        {/* Style Guide Dictionary */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-8">
            Text Styles & Utility Classes Reference
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Alex Brush Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                  Alex Brush Font
                </span>
                <span className="text-xs text-stone-400 font-mono">--font-alex</span>
              </div>

              {/* Display Script */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    .text-script-display
                  </span>
                  <span className="text-xs text-stone-400">Calligraphy Hero</span>
                </div>
                <div className="text-script-display text-stone-800 dark:text-stone-100 py-1">
                  Wedding Ceremony
                </div>
              </div>

              {/* Title Script */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    .text-script-title
                  </span>
                  <span className="text-xs text-stone-400">Calligraphy Header</span>
                </div>
                <div className="text-script-title text-stone-800 dark:text-stone-100">
                  Special Invitation
                </div>
              </div>

              {/* Accent Script */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    .text-script-accent
                  </span>
                  <span className="text-xs text-stone-400">Decorative Accent</span>
                </div>
                <div className="text-script-accent text-stone-800 dark:text-stone-100">
                  and the celebration continues...
                </div>
              </div>

            </div>

            {/* Kalam Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                  Kalam Font
                </span>
                <span className="text-xs text-stone-400 font-mono">--font-kalam</span>
              </div>

              {/* Handwritten Title */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                    .text-handwritten-title
                  </span>
                  <span className="text-xs text-stone-400">Casual Header</span>
                </div>
                <div className="text-handwritten-title text-stone-800 dark:text-stone-100">
                  Our Love Story
                </div>
              </div>

              {/* Handwritten Body */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                    .text-handwritten-body
                  </span>
                  <span className="text-xs text-stone-400">Casual Body Text</span>
                </div>
                <div className="text-handwritten-body text-stone-800 dark:text-stone-100">
                  It all started with a simple hello. Years later, we decided to make it forever.
                </div>
              </div>

              {/* Handwritten Caption */}
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-900/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
                    .text-handwritten-caption
                  </span>
                  <span className="text-xs text-stone-400">Light Details / Notes</span>
                </div>
                <div className="text-handwritten-caption text-stone-800 dark:text-stone-100">
                  * Please RSVP before September 15th
                </div>
              </div>

            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

