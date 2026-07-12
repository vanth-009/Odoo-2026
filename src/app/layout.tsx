import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoSphere | Premium ESG Dashboard",
  description: "Monitor carbon emissions, promote employee well-being, and maintain governance compliance with real-time insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <body className="flex min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <Sidebar />
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col relative z-0">
              <Topbar />
              <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
                {children}
              </div>
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
