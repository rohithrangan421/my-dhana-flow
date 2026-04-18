import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060a] text-foreground">
      {/* Museum hall ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.10),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
        <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          BudgetBuddy
        </span>
        <Link
          to="/login"
          className="text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          Sign in →
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-8 pb-32 md:pt-16">
        {/* Floating acrylic panel */}
        <div className="relative w-full max-w-4xl perspective-[1500px]">
          <div className="relative animate-[float_6s_ease-in-out_infinite]">
            {/* Glowing borders */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-400/60 via-transparent to-purple-500/60 opacity-80 blur-[1px]" />
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-600/20 blur-2xl" />

            {/* Acrylic panel */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Inner sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-white/[0.02] pointer-events-none" />

              {/* Holographic dashboard preview */}
              <div className="relative p-6 md:p-8 blur-[1.5px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-3 w-32 rounded bg-gradient-to-r from-blue-400 to-emerald-400 opacity-70" />
                    <div className="mt-2 h-2 w-20 rounded bg-white/20" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-6 rounded-full bg-cyan-400/40" />
                    <div className="h-6 w-6 rounded-full bg-purple-400/40" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    "from-blue-500/30 to-cyan-500/20",
                    "from-emerald-500/30 to-teal-500/20",
                    "from-purple-500/30 to-pink-500/20",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`h-20 rounded-xl bg-gradient-to-br ${g} border border-white/10 p-3`}
                    >
                      <div className="h-1.5 w-12 rounded bg-white/30" />
                      <div className="mt-3 h-3 w-16 rounded bg-white/50" />
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/10 bg-black/30 p-4 h-40 relative overflow-hidden">
                  <svg viewBox="0 0 400 120" className="w-full h-full">
                    <defs>
                      <linearGradient id="ln" x1="0" x2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,90 C50,70 100,100 150,60 S250,20 300,40 S380,80 400,30"
                      fill="none"
                      stroke="url(#ln)"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Floor reflection */}
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 w-[80%] h-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.35), rgba(139,92,246,0.25), transparent 70%)",
              filter: "blur(40px)",
              transform: "translateX(-50%) scaleY(-1)",
            }}
          />
        </div>

        {/* Branding */}
        <div className="relative z-10 mt-32 md:mt-40 text-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
            BudgetBuddy
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/60 leading-relaxed">
            A holographic view of your finances. Track every rupee across every device — beautifully.
          </p>
          <div className="mt-10">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.7)] transition-all hover:scale-[1.03]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
