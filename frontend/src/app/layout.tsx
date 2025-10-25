import './globals.css'
import { FaBug } from "react-icons/fa"; // 🪲 simple "issue tracker" icon
import { Poppins } from "next/font/google";
import { Orbitron } from "next/font/google";
const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] });



const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

export const metadata = { title: 'Issue Tracker Lite' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${poppins.className} bg-[#0b121a] text-[#e5e7eb] min-h-screen flex flex-col`}>
        {/* Center content */}
        <main className="flex flex-col items-center justify-center flex-1">
            {/* Fancy header */}
            <header className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <FaBug size={40} className="text-[#61affe]" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#61affe]">
                        Issue Tracker Lite
                    </h1>
                </div>
                <p className="text-gray-400 text-sm font-light">
                    Simple. Minimal. Swagger-inspired.
                </p>
            </header>

            {/* Main content (your app) */}
            <section className="w-full max-w-3xl p-6">
                {children}
            </section>
        </main>
        </body>
        </html>
    )
}
