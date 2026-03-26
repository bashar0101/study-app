import "./globals.css";
import ToastProvider from "@/components/ui/Toast";

export const metadata = {
  title: "StudyAI - AI-Powered Learning Platform",
  description: "Learn smarter with AI-generated questions, instant feedback, and performance analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
