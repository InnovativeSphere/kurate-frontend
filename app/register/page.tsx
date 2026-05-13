// app/register/page.tsx
'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Phone,
  Store,
  ShoppingBag,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { register, clearError } from '../redux/slices/userSlice';
import type { RootState } from '../redux/store';
import type { User } from '@/app/types/user'; // 👈 added

// ─────────────────────────────────────────────────────────────
// Theme & scroll hooks (reused)
// ─────────────────────────────────────────────────────────────
function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';
  const isLattie = mounted && resolvedTheme === 'lattie';
  return {
    isDark,
    isLattie,
    textPrimary: isDark ? '#F0EEFF' : isLattie ? '#1A1814' : '#0D0F1A',
    textSecondary: isDark ? '#A89EC8' : isLattie ? '#5C5851' : '#4B5170',
    textMuted: isDark ? '#6B6088' : isLattie ? '#9C9890' : '#9299B8',
    border: isDark
      ? 'rgba(255,255,255,0.08)'
      : isLattie
      ? 'rgba(0,0,0,0.06)'
      : 'rgba(0,0,0,0.06)',
    accent: isDark ? '#7B5FFF' : isLattie ? '#A0998F' : '#4F9EFF',
    bgSurface: isDark
      ? 'rgba(14,14,24,0.85)'
      : isLattie
      ? 'rgba(250,248,245,0.85)'
      : 'rgba(255,255,255,0.85)',
    bgSubtle: isDark ? '#0F0F1A' : isLattie ? '#F4F2EE' : '#F8F9FF',
    error: '#EF4444',
    success: '#00B86E',
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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return { ref, inView };
}

// ─────────────────────────────────────────────────────────────
// Animated Card
// ─────────────────────────────────────────────────────────────
function AnimatedCard({
  children,
  className = '',
  accentColor,
  isActive = false,
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
  isActive?: boolean;
}) {
  const { isDark, isLattie, accent: defaultAccent, border, bgSurface } = useThemeColors();
  const finalAccent = accentColor || defaultAccent;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${className}`}
      style={{
        background: bgSurface,
        border: `1px solid ${isActive ? finalAccent + '80' : hovered ? finalAccent + '60' : border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: isActive
          ? `0 30px 60px -20px ${finalAccent}, 0 0 0 1px ${finalAccent}30`
          : hovered
          ? `0 20px 40px -12px ${finalAccent}40`
          : isDark
          ? '0 2px 12px rgba(0,0,0,0.35)'
          : '0 2px 12px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${finalAccent}, ${finalAccent}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'slideBorder 1.5s linear infinite',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '2px',
          }}
        />
      </div>
      {isActive && (
        <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-md" style={{ background: finalAccent }} />
      )}
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

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const role = roleParam === 'seller' ? 'SELLER' : 'BUYER';
  const dispatch = useAppDispatch();
  const { loading, error: reduxError } = useAppSelector((state: RootState) => state.user);
  const { textPrimary, textSecondary, textMuted, border, accent, bgSubtle, error: errorColor, success: successColor } = useThemeColors();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { ref: cardRef, inView: cardInView } = useInView(0.2);

  const emailError = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordError = password.length > 0 && password.length < 8;
  const confirmPasswordError = confirmPassword.length > 0 && password !== confirmPassword;
  const phoneError = phone.length > 0 && !/^\+?[0-9]{10,15}$/.test(phone);

  useEffect(() => {
    if (reduxError) dispatch(clearError());
    setLocalError(null);
  }, [email, password, phone, confirmPassword, reduxError, dispatch]);

  // ❌ Removed the faulty useEffect that pushed to /dashboard

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!email || !password || !confirmPassword || !phone) {
      setLocalError('All fields are required.');
      return;
    }
    if (emailError) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (passwordError) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (confirmPasswordError) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (phoneError) {
      setLocalError('Enter a valid phone number (digits only, optional +).');
      return;
    }

    const result = await dispatch(register({ email, password, phone, role }));
    if (register.fulfilled.match(result)) {
      const user = result.payload as User; // now contains shopId (null for new sellers)
      setSuccess(true);
      // ✅ Route based on role and shop existence
      if (user.role === 'SELLER' && !user.shopId) {
        router.push('/my-shop');
      } else {
        router.push('/dashboard');
      }
    }
    // If rejected, error handled by Redux
  };

  const displayError = localError || reduxError;

  return (
    <main className="relative min-h-screen flex items-center justify-center py-16 overflow-hidden" style={{ background: bgSubtle }}>
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: 'absolute',
            width: 'clamp(350px, 45vw, 550px)',
            height: 'clamp(350px, 45vw, 550px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.08,
            filter: 'blur(100px)',
            top: '-20%',
            left: '-15%',
            animation: 'floatOrb1 25s ease-in-out infinite',
          }}
        />
        <div
          className="orb-2"
          style={{
            position: 'absolute',
            width: 'clamp(300px, 40vw, 500px)',
            height: 'clamp(300px, 40vw, 500px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.06,
            filter: 'blur(90px)',
            bottom: '-15%',
            right: '-10%',
            animation: 'floatOrb2 30s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
      </div>

      <div className="container max-w-md relative z-10 px-4 sm:px-6">
        <div
          className="transition-all duration-700 mb-6"
          style={{ opacity: cardInView ? 1 : 0, transform: cardInView ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <Link
            href="/register/role"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all group"
            style={{ color: textSecondary }}
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="group-hover:text-primary transition-colors">Back to role selection</span>
          </Link>
        </div>

        <div
          ref={cardRef}
          className="transition-all duration-700"
          style={{ opacity: cardInView ? 1 : 0, transform: cardInView ? 'translateY(0)' : 'translateY(30px)' }}
        >
          <AnimatedCard accentColor={accent}>
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-subtle mb-2">
                  {role === 'SELLER' ? <Store size={28} className="text-primary" /> : <ShoppingBag size={28} className="text-primary" />}
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: textPrimary }}>Create account</h1>
                <p className="text-sm" style={{ color: textSecondary }}>
                  Join as a <span className="font-semibold" style={{ color: accent }}>{role === 'SELLER' ? 'Seller' : 'Buyer'}</span>
                </p>
                <div className="flex justify-center gap-1">
                  <Sparkles size={12} style={{ color: accent }} />
                  <Sparkles size={12} style={{ color: accent }} />
                  <Sparkles size={12} style={{ color: accent }} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textPrimary }}>Email *</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover/input:text-primary" style={{ color: textMuted }}>
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: emailError ? errorColor : email && !emailError ? successColor : border,
                        color: textPrimary,
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: errorColor }}>
                      <AlertCircle size={10} /> Invalid email
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textPrimary }}>Phone number *</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover/input:text-primary" style={{ color: textMuted }}>
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: phoneError ? errorColor : phone && !phoneError ? successColor : border,
                        color: textPrimary,
                      }}
                      placeholder="+2348012345678"
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: errorColor }}>
                      <AlertCircle size={10} /> Invalid phone number
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textPrimary }}>Password *</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover/input:text-primary" style={{ color: textMuted }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-surface border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: passwordError ? errorColor : password.length >= 8 && !passwordError ? successColor : border,
                        color: textPrimary,
                      }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                      style={{ color: textMuted }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: errorColor }}>
                      <AlertCircle size={10} /> At least 8 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: textPrimary }}>Confirm password *</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover/input:text-primary" style={{ color: textMuted }}>
                      <Lock size={16} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-surface border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: confirmPasswordError ? errorColor : confirmPassword && !confirmPasswordError ? successColor : border,
                        color: textPrimary,
                      }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                      style={{ color: textMuted }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-xs flex items-center gap-1" style={{ color: errorColor }}>
                      <AlertCircle size={10} /> Passwords do not match
                    </p>
                  )}
                </div>

                {displayError && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg text-sm animate-shake"
                    style={{ background: `${errorColor}10`, color: errorColor, borderLeft: `3px solid ${errorColor}` }}
                  >
                    <AlertCircle size={14} />
                    <span>{displayError}</span>
                  </div>
                )}
                {success && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg text-sm"
                    style={{ background: `${successColor}10`, color: successColor, borderLeft: `3px solid ${successColor}` }}
                  >
                    <CheckCircle size={14} />
                    <span>Registration successful! Redirecting...</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl py-3 text-base transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:opacity-50 mt-4"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account…
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus size={15} />
                      Sign Up
                    </div>
                  )}
                </button>
              </form>

              <p className="text-center text-xs" style={{ color: textMuted }}>
                Already have an account?{' '}
                <Link href="/login" className="font-medium transition-all hover:underline" style={{ color: accent }}>
                  Sign in
                </Link>
              </p>
            </div>
          </AnimatedCard>
        </div>

        <div className="relative w-full h-px overflow-hidden mt-10">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      <style jsx>{`
        .moving-gradient-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4f9eff, #7b5fff, #c4b5fd, #7b5fff, #4f9eff, transparent);
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.98); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 25px) scale(1.04); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line { animation: none; background: linear-gradient(90deg, #4f9eff, #7b5fff, #c4b5fd); }
          .orb-1, .orb-2 { animation: none !important; }
          .animate-shake { animation: none; }
        }
      `}</style>
    </main>
  );
}