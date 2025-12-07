import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import AiChatBot from "@/components/ui/AiChatBot";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/UserContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | PassKeeper",
    default: "Welcome | PassKeeper",
  },
  description:
    "PassKeeper is your all-in-one secure vault for storing passwords, payment cards, notes, and personal identities. Keep your data safe, organized, and accessible anytime with advanced encryption and a simple interface",
  keywords: [
    "password manager",
    "secure vault",
    "password storage",
    "data security",
    "online protection",
    "PassKeeper app",
  ],
  authors: [{ name: "syamjir" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/welcome"
      signInFallbackRedirectUrl="/demo-home"
      signUpFallbackRedirectUrl="/demo-home"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
        </head>
        <UserProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased p-1 md:p-0  `}
          >
            {/* For display alert */}
            <Toaster richColors theme="system" position="top-right" />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="fixed top-4 right-4 z-100">
                <ModeToggle />
              </div>
              <div className="fixed bottom-5 right-5 z-50">
                <AiChatBot />
              </div>
              {children}
            </ThemeProvider>
          </body>
        </UserProvider>
      </html>
    </ClerkProvider>
  );
}
