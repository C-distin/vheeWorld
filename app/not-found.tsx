import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-white overflow-hidden flex items-center justify-center px-4">
      {/* Atmospheric background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-80" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-6">
        {/* 404 Display */}
        <div className="relative select-none">
          <span
            className="text-[10rem] sm:text-[13rem] font-black leading-none tracking-tighter text-transparent block"
            style={{ WebkitTextStroke: "2px #dbeafe" }}>
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-blue-500 text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full shadow-lg shadow-blue-200">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3 -mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Looks like you&apos;ve wandered off.
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back on
            track.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-[200px]">
          <span className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-300 text-xs">✦</span>
          <span className="flex-1 h-px bg-gray-100" />
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all duration-200">
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>

        <p className="text-xs text-gray-300 tracking-wide mt-2">Vhee World Foundation</p>
      </div>
    </main>
  )
}
