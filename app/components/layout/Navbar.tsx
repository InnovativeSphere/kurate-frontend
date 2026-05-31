// components/layout/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Info,
  ArrowRight,
  LayoutDashboard,
  User,
  LogOut,
  Store,
} from "lucide-react";
import { useTheme } from '@/app/lib/theme';
import { ThemeSwitcher } from "../ui/ThemeSwitcher";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { RootState } from "@/app/redux/store";
import { logout } from "@/app/redux/slices/userSlice";

const publicNavItems = [
  { name: "Home",    href: "/",          icon: Home },
  { name: "Browse",  href: "/products",  icon: ShoppingBag },
  { name: "Stores",  href: "/stores",    icon: Store },     // ✅ new
  { name: "About",   href: "/about",     icon: Info },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  const { isAuthenticated } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Sliding underline for desktop
  useEffect(() => {
    if (!mounted) return;
    const activeIndex = publicNavItems.findIndex((item) => item.href === pathname);
    const activeEl = navRefs.current[activeIndex];
    if (activeEl && typeof window !== "undefined") {
      setUnderlineStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [pathname, mounted]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isDark = mounted && resolvedTheme === "dark";
  const isLattie = mounted && resolvedTheme === "lattie";

  const bgColor = scrolled
    ? isDark
      ? "rgba(10,10,15,0.92)"
      : isLattie
      ? "rgba(244,242,238,0.94)"
      : "rgba(248,249,255,0.94)"
    : isDark
    ? "rgba(10,10,15,0.98)"
    : isLattie
    ? "rgba(244,242,238,0.98)"
    : "rgba(248,249,255,0.98)";
  const borderColor = isDark
    ? "rgba(255,255,255,0.06)"
    : isLattie
    ? "rgba(0,0,0,0.06)"
    : "rgba(0,0,0,0.06)";
  const textPrimary = isDark ? "#F0EEFF" : isLattie ? "#1A1814" : "#0D0F1A";
  const textSecondary = isDark ? "#A89EC8" : isLattie ? "#5C5851" : "#4B5170";

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          background: bgColor,
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: scrolled
            ? isDark
              ? "0 4px 20px rgba(0,0,0,0.3)"
              : "0 4px 20px rgba(0,0,0,0.05)"
            : "none",
        }}
      >
        <div className="w-full px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="group shrink-0 transition-transform duration-300 hover:scale-105">
              <div className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all">
                <Image
                  src="/kurate-logo-2.jpg"
                  alt="Kurate"
                  width={48}
                  height={32}
                  className="h-8 w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 relative">
              {publicNavItems.map((item, idx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={(el) => {
                      navRefs.current[idx] = el;
                    }}
                    className="relative flex items-center gap-1.5 py-2 text-sm font-medium transition-colors duration-200"
                    style={{ color: isActive ? textPrimary : textSecondary }}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
              <span
                className="absolute -bottom-[2px] h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
              />
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-5">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    color: textSecondary,
                    background: "transparent",
                    border: `1px solid ${borderColor}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = textPrimary;
                    e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = textSecondary;
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = borderColor;
                  }}
                >
                  Log in
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      color: textSecondary,
                      background: "transparent",
                      border: `1px solid ${borderColor}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = textPrimary;
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.04)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textSecondary;
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    <LayoutDashboard size={16} className="inline mr-1.5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      color: textSecondary,
                      background: "transparent",
                      border: `1px solid ${borderColor}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = textPrimary;
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.04)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textSecondary;
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    <User size={16} className="inline mr-1.5" />
                    Profile
                  </Link>
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
                    style={{
                      color: textSecondary,
                      background: "transparent",
                      border: `1px solid ${borderColor}`,
                    }}
                    title="Log out"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = textPrimary;
                      e.currentTarget.style.background = isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.04)";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textSecondary;
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = borderColor;
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </>
              )}

              {/* START SELLING BUTTON */}
              <Link
                href="/register/role"
                className="group inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)",
                  boxShadow: "0 4px 14px -2px rgba(123,95,255,0.5)",
                }}
              >
                Start selling
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: textPrimary }}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* MOVING GRADIENT LINE */}
        <div className="moving-gradient-line absolute bottom-0 left-0 right-0 h-px" />
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            background: isDark
              ? "rgba(12,12,20,0.98)"
              : isLattie
              ? "rgba(250,248,245,0.98)"
              : "rgba(255,255,255,0.98)",
            borderLeft: `1px solid ${borderColor}`,
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor }}>
            <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0">
              <div className="overflow-hidden rounded-xl shadow-md">
                <Image
                  src="/kurate-logo-2.jpg"
                  alt="Kurate"
                  width={40}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full transition-colors hover:bg-white/10"
              style={{ color: textSecondary }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile nav links */}
          <div className="flex-1 px-5 py-8">
            <div className="space-y-4">
              {publicNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-all hover:scale-[1.02]"
                    style={{
                      color: isActive ? textPrimary : textSecondary,
                      background: isActive
                        ? isDark
                          ? "rgba(123,95,255,0.15)"
                          : isLattie
                          ? "rgba(196,181,253,0.15)"
                          : "rgba(79,158,255,0.08)"
                        : "transparent",
                    }}
                  >
                    <Icon size={20} />
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile bottom actions – increased spacing */}
          <div className="p-6 space-y-4 border-t" style={{ borderColor }}>
             <div className="flex justify-center pt-2">
              <ThemeSwitcher />
            </div>
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  color: textPrimary,
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                }}
              >
                Log in
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex my-2 items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    color: textPrimary,
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                  }}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex my-2 items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    color: textPrimary,
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                  }}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center my-2 justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                  style={{
                    color: "#EF4444",
                    border: `1px solid rgba(239,68,68,0.3)`,
                    background: "rgba(239,68,68,0.05)",
                  }}
                >
                  <LogOut size={18} />
                  Log out
                </button>
              </>
            )}
            <Link
              href="/register/role"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center my-2 justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: "linear-gradient(135deg, #4F9EFF, #7B5FFF, #C4B5FD)",
                boxShadow: "0 4px 14px -2px rgba(123,95,255,0.5)",
              }}
            >
              Start selling
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
           
          </div>
        </div>
      </div>

      <style jsx>{`
        .moving-gradient-line {
          background: linear-gradient(
            90deg,
            transparent,
            #4F9EFF,
            #7B5FFF,
            #C4B5FD,
            #7B5FFF,
            #4F9EFF,
            transparent
          );
          background-size: 200% 100%;
          animation: flowGradient 3s linear infinite;
          pointer-events: none;
          opacity: 0.7;
        }

        @keyframes flowGradient {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .moving-gradient-line {
            animation: none;
            background: linear-gradient(90deg, #4F9EFF, #7B5FFF, #C4B5FD);
          }
        }
      `}</style>
    </>
  );
}