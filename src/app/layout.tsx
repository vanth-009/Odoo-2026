import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoSphere | Next-Gen ESG ERP",
  description: "Advanced Enterprise ESG Data Architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
      <body className="flex min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/30 antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            <Sidebar />
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col relative z-0">
              <Topbar />
              <div className="flex-1 p-6 md:p-8 max-w-[1600px] w-full animate-fade-in">
                {children}
              </div>
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
