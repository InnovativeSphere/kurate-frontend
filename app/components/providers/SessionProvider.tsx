"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { getProfile } from "../../redux/slices/userSlice";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Only attempt to restore session if the flag exists
    const hasActiveSession = localStorage.getItem("session_active") === "true";
    if (hasActiveSession && !isAuthenticated && !user && !loading) {
      dispatch(getProfile());
    }
  }, [dispatch]);  // runs only once on mount

  return <>{children}</>;
}