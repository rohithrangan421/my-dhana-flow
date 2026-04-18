import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-foreground">
      {/* Museum hall ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        {/* Spotlights from top corners */}
        <div className="absolute -top-20 left-0 w-[40rem] h-[40rem] bg-[radial-gradient(ellipse_at_top_left,rgba(180,200,255,0.18),transparent_60%)]" />
        <div className="absolute -top-20 right-0 w-[40rem] h-[40rem] bg-[radial-gradient(ellipse_at_top_right,rgba(180,200,255,0.18),transparent_60%)]" />
        {/* Side wall shadows */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/80 to-transparent" />
      </div>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-20 pb-24 md:pt-24">
        {/* Floating neon-framed display */}
        <div className="relative w-full max-w-3xl">
          <div className="relative animate-[float_6s_ease-in-out_infinite]">
            {/* Outer neon glow */}
            <div className="absolute -inset-3 rounded-[14px] bg-gradient-to-r from-cyan-400/40 via-transparent to-purple-500/40 blur-2xl" />

            {/* Neon border frame */}
            <div
              className="relative rounded-[10px] p-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, #22d3ee 0%, #14b8a6 35%, #6366f1 65%, #a855f7 100%)",
                boxShadow:
                  "0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(168,85,247,0.4)",
              }}
            >
              {/* Inner dashboard preview */}
              <div className="relative rounded-[8px] bg-[#0a0d18] overflow-hidden aspect-[16/9]">
                <div className="absolute inset-0 blur-[1.5px] p-4 flex gap-3">
                  {/* Sidebar */}
                  <div className="w-1/6 flex flex-col gap-2 pt-2">
                    <div className="h-2 rounded bg-white/30" />
                    <div className="h-2 rounded bg-blue-400/60" />
                    <div className="h-2 rounded bg-white/15" />
                    <div className="h-2 rounded bg-white/15" />
                    <div className="h-2 rounded bg-white/15" />
                    <div className="h-2 rounded bg-white/15" />
                  </div>
                  {/* Main content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {/* Donut card */}
                      <div className="rounded-md bg-white/[0.04] border border-white/10 p-3 flex items-center justify-center">
                        <div className="relative w-16 h-16 rounded-full border-[5px] border-cyan-400/60" style={{ borderRightColor: "rgba(168,85,247,0.6)", borderBottomColor: "rgba(16,185,129,0.6)" }} />
                      </div>
                      {/* Stats card */}
                      <div className="rounded-md bg-white/[0.04] border border-white/10 p-3 flex flex-col gap-2">
                        <div className="h-2 w-3/4 rounded bg-white/30" />
                        <div className="h-2 w-1/2 rounded bg-white/20" />
                        <div className="h-2 w-2/3 rounded bg-white/20" />
                      </div>
                    </div>
                    {/* Chart card */}
                    <div className="rounded-md bg-white/[0.04] border border-white/10 p-3 flex-1">
                      <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="ln" x1="0" x2="1">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                          <linearGradient id="fl" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,60 C40,50 80,65 120,40 S200,20 240,35 S320,55 400,25 L400,80 L0,80 Z" fill="url(#fl)" />
                        <path d="M0,60 C40,50 80,65 120,40 S200,20 240,35 S320,55 400,25" fill="none" stroke="url(#ln)" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom edge highlight (pedestal lip) */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-gradient-to-r from-cyan-400/0 via-cyan-300/80 to-purple-400/0 blur-sm" />
          </div>

          {/* Floor reflection glow */}
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 mt-2 w-[90%] h-48 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center top, rgba(34,211,238,0.35), rgba(139,92,246,0.25) 40%, transparent 75%)",
              filter: "blur(35px)",
            }}
          />
        </div>

        {/* Branding */}
        <div className="relative z-10 mt-24 md:mt-28 text-center max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            BudgetBuddy
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/60">
            Your Personal Finance Companion
          </p>
          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 px-12 py-3 text-base font-semibold text-white shadow-[0_10px_40px_-5px_rgba(139,92,246,0.8)] transition-all hover:scale-[1.03]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
