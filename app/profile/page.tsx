// app/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  User,
  Mail,
  Phone,
  Save,
  X,
  LogOut,
  Trash2,
  Shield,
  Key,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { deleteProfile, logout, updateProfile } from '../redux/slices/userSlice';
import { ThemeSwitcher } from '../components/ui/ThemeSwitcher';

// ─────────────────────────────────────────────────────────────
// Custom Hooks (reused from WhyKurate)
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
// Animated Card (with moving gradient border)
// ─────────────────────────────────────────────────────────────
function AnimatedCard({
  children,
  className = '',
  accentColor,
}: {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}) {
  const { isDark, isLattie, accent: defaultAccent, border, bgSurface } = useThemeColors();
  const finalAccent = accentColor || defaultAccent;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl transition-all duration-500 ${className}`}
      style={{
        background: bgSurface,
        border: `1px solid ${hovered ? finalAccent + '60' : border}`,
        backdropFilter: 'blur(16px)',
        boxShadow: hovered
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

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.user);
  const {
    textPrimary,
    textSecondary,
    textMuted,
    border,
    accent,
    bgSubtle,
    bgSurface,
    error: errorColor,
  } = useThemeColors();

  // Local form state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordSection, setPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [localError, setLocalError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Scroll reveal
  const { ref: headerRef, inView: headerInView } = useInView(0.2);
  const { ref: mainRef, inView: mainInView } = useInView(0.1);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setLocalError('');
    if (email === user?.email && phone === (user?.phone || '')) {
      setIsEditing(false);
      return;
    }
    const result = await dispatch(updateProfile({ email, phone }));
    if (updateProfile.fulfilled.match(result)) {
      setIsEditing(false);
    } else {
      setLocalError(result.payload as string);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Both fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordError('');
    const result = await dispatch(updateProfile({ password: newPassword }));
    if (updateProfile.fulfilled.match(result)) {
      setPasswordSection(false);
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.payload as string);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    await dispatch(deleteProfile());
    setDeleteLoading(false);
    setDeleteConfirmOpen(false);
    router.push('/');
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  if (!user) return null;

  return (
    <main className="relative min-h-screen py-16 md:py-24 overflow-hidden" style={{ background: bgSubtle }}>
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-1"
          style={{
            position: 'absolute',
            width: 'clamp(300px, 40vw, 500px)',
            height: 'clamp(300px, 40vw, 500px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.08,
            filter: 'blur(80px)',
            top: '-15%',
            left: '-10%',
            animation: 'floatOrb1 25s ease-in-out infinite',
          }}
        />
        <div
          className="orb-2"
          style={{
            position: 'absolute',
            width: 'clamp(250px, 35vw, 450px)',
            height: 'clamp(250px, 35vw, 450px)',
            borderRadius: '50%',
            background: accent,
            opacity: 0.06,
            filter: 'blur(70px)',
            bottom: '-10%',
            right: '-5%',
            animation: 'floatOrb2 30s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-subtle mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: textPrimary }}>
            My Profile
          </h1>
          <p className="text-sm mt-2" style={{ color: textSecondary }}>
            Manage your account details and preferences
          </p>
        </div>

        {/* Main cards container – increased vertical spacing */}
        <div
          ref={mainRef}
          className="space-y-10 transition-all duration-700"
          style={{
            opacity: mainInView ? 1 : 0,
            transform: mainInView ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          {/* Personal Information Card */}
          <AnimatedCard accentColor={accent}>
            <div className="p-6 sm:p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Mail size={20} style={{ color: accent }} />
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textPrimary }}>
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Mail size={16} style={{ color: textMuted }} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border text-sm transition-all focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: border,
                        color: textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textPrimary }}>
                    Phone number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Phone size={16} style={{ color: textMuted }} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface border text-sm transition-all focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: border,
                        color: textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textPrimary }}>
                    Account role
                  </label>
                  <div className="flex items-center gap-2">
                    <Shield size={16} style={{ color: accent }} />
                    <span className="text-sm font-medium" style={{ color: textPrimary }}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              {localError && (
                <div className="text-sm flex items-center gap-2" style={{ color: errorColor }}>
                  <AlertCircle size={14} />
                  {localError}
                </div>
              )}
            </div>
          </AnimatedCard>

          {/* Theme Card */}
          <AnimatedCard accentColor={accent}>
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
                <Sparkles size={20} style={{ color: accent }} />
                Theme Preference
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: textSecondary }}>Choose your interface theme</span>
                <ThemeSwitcher />
              </div>
            </div>
          </AnimatedCard>

          {/* Security Card */}
          <AnimatedCard accentColor={accent}>
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Key size={20} style={{ color: accent }} />
                  Security
                </h2>
                <button
                  onClick={() => setPasswordSection(!passwordSection)}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  style={{ color: accent }}
                >
                  {passwordSection ? 'Cancel' : 'Change password'}
                </button>
              </div>

              {passwordSection && (
                <div className="space-y-5 pt-2 border-t" style={{ borderColor: border }}>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textPrimary }}>
                      New password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface border text-sm"
                      style={{ background: 'var(--bg-surface)', borderColor: border, color: textPrimary }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textPrimary }}>
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface border text-sm"
                      style={{ background: 'var(--bg-surface)', borderColor: border, color: textPrimary }}
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs flex items-center gap-1" style={{ color: errorColor }}>
                      <AlertCircle size={12} /> {passwordError}
                    </p>
                  )}
                  <button
                    onClick={handleChangePassword}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </AnimatedCard>

          {/* Danger Zone Card */}
          <AnimatedCard accentColor={accent}>
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: '#EF4444' }}>
                <Trash2 size={20} />
                Danger Zone
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:bg-white/5"
                  style={{ borderColor: border, color: textPrimary }}
                >
                  <LogOut size={16} />
                  Log out
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                >
                  <Trash2 size={16} />
                  Delete account
                </button>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Moving gradient line */}
        <div className="relative w-full h-px overflow-hidden mt-16">
          <div className="moving-gradient-line absolute inset-0" />
        </div>
      </div>

      {/* Delete confirmation modal – premium glass + pulse animation */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmOpen(false)} />
          {/* Modal */}
          <div
            className="relative max-w-md w-full rounded-2xl p-6 shadow-2xl animate-scale-up"
            style={{
              background: bgSurface,
              border: `1px solid ${border}`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Pulse icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                <div className="relative w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={28} className="text-red-500" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center mb-2" style={{ color: textPrimary }}>
              Delete your account?
            </h3>
            <p className="text-sm text-center mb-6" style={{ color: textSecondary }}>
              This action is <strong className="text-red-500">irreversible</strong>. All your data, products, and listings will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: border, color: textPrimary }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Yes, delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.25s cubic-bezier(0.21, 1.11, 0.35, 1.1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line { animation: none; }
          .animate-fade-in, .animate-scale-up { animation: none; }
          .orb-1, .orb-2 { animation: none; }
        }
      `}</style>
    </main>
  );
}