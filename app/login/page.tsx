// app/login/page.tsx
"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearError, login } from "../redux/slices/userSlice";
import type { RootState } from "../redux/store";
import type { User } from "@/app/types/user";
import { TechLoader } from "../components/TechLoader"; // 👈 added

// ─────────────────────────────────────────────────────────────
// Theme & scroll hooks (unchanged)
// ─────────────────────────────────────────────────────────────
function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const isLattie = mounted && resolvedTheme === "lattie";
  return {
    isDark,
    isLattie,
    textPrimary: isDark ? "#F0EEFF" : isLattie ? "#1A1814" : "#0D0F1A",
    textSecondary: isDark ? "#A89EC8" : isLattie ? "#5C5851" : "#4B5170",
    textMuted: isDark ? "#6B6088" : isLattie ? "#9C9890" : "#9299B8",
    border: isDark
      ? "rgba(255,255,255,0.08)"
      : isLattie
      ? "rgba(0,0,0,0.06)"
      : "rgba(0,0,0,0.06)",
    accent: isDark ? "#7B5FFF" : isLattie ? "#A0998F" : "#4F9EFF",
    bgSurface: isDark
      ? "rgba(14,14,24,0.85)"
      : isLattie
      ? "rgba(250,248,245,0.85)"
      : "rgba(255,255,255,0.85)",
    bgSubtle: isDark ? "#0F0F1A" : isLattie ? "#F4F2EE" : "#F8F9FF",
    error: "#EF4444",
    success: "#00B86E",
  };
}

function useInView(threshold = 0.15, triggerOnce = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) obs.disconnect();
        } else if (!triggerOnce) setInView(false);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return { ref, inView };
}

// ─────────────────────────────────────────────────────────────
// Animated Card (unchanged)
// ─────────────────────────────────────────────────────────────
function AnimatedCard({
  children,
  className = "",
  accentColor,
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  const {
    isDark,
    isLattie,
    accent: defaultAccent,
    border,
    bgSurface,
  } = useThemeColors();
  const finalAccent = accentColor || defaultAccent;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${className}`}
      style={{
        background: bgSurface,
        border: `1px solid ${hovered ? finalAccent + "60" : border}`,
        backdropFilter: "blur(16px)",
        boxShadow: hovered
          ? `0 20px 40px -12px ${finalAccent}40`
          : isDark
          ? "0 2px 12px rgba(0,0,0,0.35)"
          : "0 2px 12px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${finalAccent}, ${finalAccent}, transparent)`,
            backgroundSize: "200% 100%",
            animation: "slideBorder 1.5s linear infinite",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "2px",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes slideBorder {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-border { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error: reduxError } = useAppSelector(
    (state: RootState) => state.user
  );
  const {
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    bgSubtle,
    error: errorColor,
  } = useThemeColors();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false); // 👈 new
  const { ref: cardRef, inView: cardInView } = useInView(0.2);

  const emailError =
    email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordError = password.length > 0 && password.length < 8;

  useEffect(() => {
    if (reduxError) dispatch(clearError());
    setLocalError(null);
  }, [email, password, dispatch, reduxError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Please fill in both fields.");
      return;
    }
    if (emailError) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (passwordError) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const user = result.payload as User;
      setRedirecting(true); // 👈 show loader

      // brief pause to let the loader appear
      setTimeout(() => {
        if (user.role === "SELLER" && !user.shopId) {
          router.push("/my-shop");
        } else {
          router.push("/dashboard");
        }
      }, 600);
    }
  };

  const displayError = localError || reduxError;

  return (
    <main
      className="relative min-h-screen flex items-center justify-center py-16 overflow-hidden"
      style={{ background: bgSubtle }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-float1"
          style={{
            position: "absolute",
            width: "clamp(300px, 40vw, 500px)",
            height: "clamp(300px, 40vw, 500px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            filter: "blur(80px)",
            top: "-15%",
            left: "-10%",
          }}
        />
        <div
          className="animate-float2"
          style={{
            position: "absolute",
            width: "clamp(250px, 35vw, 450px)",
            height: "clamp(250px, 35vw, 450px)",
            borderRadius: "50%",
            background: accent,
            opacity: 0.06,
            filter: "blur(70px)",
            bottom: "-10%",
            right: "-5%",
            animationDelay: "-5s",
          }}
        />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px moving-gradient-line" />

      <div className="container max-w-md relative z-10 px-4 sm:px-6">
        <div
          className="transition-all duration-700 mb-6"
          style={{
            opacity: cardInView ? 1 : 0,
            transform: cardInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all group"
            style={{ color: textSecondary }}
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="group-hover:text-primary transition-colors">
              Back to home
            </span>
          </Link>
        </div>

        <div
          ref={cardRef}
          className="transition-all duration-700"
          style={{
            opacity: cardInView ? 1 : 0,
            transform: cardInView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <AnimatedCard accentColor={accent}>
            {redirecting ? (
              /* 🔄 Redirecting state */
              <div className="p-10 flex flex-col items-center justify-center">
                <TechLoader text="Setting up your session…" />
              </div>
            ) : (
              <>
                <div className="p-8 sm:p-10 space-y-8">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-subtle mb-2">
                      <LogIn size={28} className="text-primary" />
                    </div>
                    <h1
                      className="font-display font-bold text-3xl sm:text-4xl"
                      style={{ color: textPrimary }}
                    >
                      Welcome back
                    </h1>
                    <p className="text-base" style={{ color: textSecondary }}>
                      Enter your credentials to access your account.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Sparkles size={14} style={{ color: accent }} />
                      <Sparkles size={14} style={{ color: accent }} />
                      <Sparkles size={14} style={{ color: accent }} />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email field unchanged */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textPrimary }}
                      >
                        Email address *
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          style={{ color: textMuted }}
                        />
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-surface border rounded-xl pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: emailError
                              ? errorColor
                              : email && !emailError
                              ? "#00B86E"
                              : border,
                            color: textPrimary,
                          }}
                        />
                      </div>
                      {emailError && (
                        <p
                          className="mt-2 text-sm flex items-center gap-1"
                          style={{ color: errorColor }}
                        >
                          <AlertCircle size={14} /> Invalid email address
                        </p>
                      )}
                    </div>

                    {/* Password field unchanged */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2"
                        style={{ color: textPrimary }}
                      >
                        Password *
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          style={{ color: textMuted }}
                        />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-surface border rounded-xl pl-10 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          style={{
                            background: "var(--bg-surface)",
                            borderColor: passwordError
                              ? errorColor
                              : password.length >= 8 && !passwordError
                              ? "#00B86E"
                              : border,
                            color: textPrimary,
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                          style={{ color: textMuted }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordError && (
                        <p
                          className="mt-2 text-sm flex items-center gap-1"
                          style={{ color: errorColor }}
                        >
                          <AlertCircle size={14} /> At least 8 characters
                        </p>
                      )}
                    </div>

                    {displayError && (
                      <div
                        className="flex items-center gap-3 p-4 rounded-xl text-sm animate-shake"
                        style={{
                          background: `${errorColor}10`,
                          color: errorColor,
                          borderLeft: `4px solid ${errorColor}`,
                        }}
                      >
                        <AlertCircle size={18} />
                        <span>{displayError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl py-3.5 text-base transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Signing in…
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <LogIn size={18} />
                          Sign In
                        </div>
                      )}
                    </button>
                  </form>

                  <p
                    className="text-center text-sm"
                    style={{ color: textMuted }}
                  >
                    Don’t have an account?{" "}
                    <Link
                      href="/register/role"
                      className="font-medium transition-all hover:underline"
                      style={{ color: accent }}
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </AnimatedCard>
        </div>

        <div className="relative w-full h-px overflow-hidden mt-10">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      <style jsx>{`
        .moving-gradient-line {
          background: linear-gradient(90deg, transparent, #4f9eff, #7b5fff, #c4b5fd, #7b5fff, #4f9eff, transparent);
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes float1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-30px) scale(1.05); }
          66% { transform: translate(-20px,20px) scale(0.98); }
        }
        @keyframes float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-40px,25px) scale(1.04); }
        }
        .animate-float1 { animation: float1 25s ease-in-out infinite; }
        .animate-float2 { animation: float2 30s ease-in-out infinite; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          10%,30%,50%,70%,90% { transform: translateX(-3px); }
          20%,40%,60%,80% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line, .animate-float1, .animate-float2, .animate-shake { animation: none; }
          .moving-gradient-line { background: linear-gradient(90deg, #4f9eff, #7b5fff, #c4b5fd); }
        }
      `}</style>
    </main>
  );
}