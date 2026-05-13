// utils/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ─── Create axios instance ────────────────────────────────
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // sends httpOnly cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 10 seconds
});

// ─── Request interceptor (logging) ────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor (error handling only) ───────────
api.interceptors.response.use(
  // Success: just return the response as is (no transformation)
  (response) => response,
  // Error: format and dispatch global event
  (error: AxiosError) => {
    const status = error.response?.status;
    let message = "Something went wrong. Please try again.";
    let errorDetail = null;

    // Network / timeout errors
    if (error.code === "ECONNABORTED") {
      message = "Request timed out. Please check your connection.";
    } else if (!error.response) {
      message = "Network error. Please check your internet connection.";
    } else {
      // Based on HTTP status code
      switch (status) {
        case 400:
          message =
            (error.response?.data as any)?.message ||
            "Bad request. Please check your input.";
          break;
        case 401:
          message =
            (error.response?.data as any)?.message ||
            "Unauthorized. Please log in again.";
          break;
        case 403:
          message =
            (error.response?.data as any)?.message ||
            "You do not have permission to perform this action.";
          break;
        case 404:
          message =
            (error.response?.data as any)?.message || "Resource not found.";
          break;
        case 409:
          message =
            (error.response?.data as any)?.message ||
            "Conflict with existing data.";
          break;
        case 422:
          message =
            (error.response?.data as any)?.message ||
            "Validation failed. Please review your input.";
          break;
        case 429:
          message = "Too many requests. Please slow down.";
          break;
        case 500:
          message = "Server error. Our team has been notified.";
          break;
        default:
          message =
            (error.response?.data as any)?.message ||
            `Error ${status}: ${error.message}`;
      }
      errorDetail = (error.response?.data as any)?.error || error.message;
    }

    const formattedError = {
      status: status || 500,
      message,
      data: errorDetail,
    };

    // Dispatch global error event for toasts
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("api-error", { detail: formattedError }),
      );
    }

    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", formattedError);
    }

    // Reject with the original error (or a simplified one) so thunks can still handle it
    return Promise.reject(formattedError);
  },
);
