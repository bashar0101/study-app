"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#0f172a",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
