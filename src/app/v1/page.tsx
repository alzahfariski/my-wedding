export default function Home() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <h1 className="text-xl font-bold">Logo</h1>

                    <nav className="hidden gap-6 md:flex">
                        <a href="#" className="hover:text-blue-600">
                            Home
                        </a>
                        <a href="#" className="hover:text-blue-600">
                            About
                        </a>
                        <a href="#" className="hover:text-blue-600">
                            Services
                        </a>
                        <a href="#" className="hover:text-blue-600">
                            Contact
                        </a>
                    </nav>

                    <button className="rounded-lg bg-black px-4 py-2 text-white">
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-bold leading-tight">
                        Modern Landing Page
                    </h1>

                    <p className="mt-6 text-lg text-gray-600">
                        Mulai dari layout sederhana, lalu tambahkan section sesuai kebutuhan.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button className="rounded-lg bg-black px-6 py-3 text-white">
                            Get Started
                        </button>

                        <button className="rounded-lg border px-6 py-3">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <h2 className="mb-10 text-3xl font-bold">Features</h2>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold">Feature 1</h3>
                        <p className="mt-2 text-gray-600">
                            Penjelasan singkat mengenai fitur.
                        </p>
                    </div>

                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold">Feature 2</h3>
                        <p className="mt-2 text-gray-600">
                            Penjelasan singkat mengenai fitur.
                        </p>
                    </div>

                    <div className="rounded-xl border p-6">
                        <h3 className="font-semibold">Feature 3</h3>
                        <p className="mt-2 text-gray-600">
                            Penjelasan singkat mengenai fitur.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-y bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-20 text-center">
                    <h2 className="text-3xl font-bold">
                        Ready to get started?
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Tambahkan call-to-action di sini.
                    </p>

                    <button className="mt-8 rounded-lg bg-black px-6 py-3 text-white">
                        Start Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Your Company
            </footer>
        </main>
    );
}