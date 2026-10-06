import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WateringProvider } from "@/context/WateringContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Irrigation Monitoring & Control System",
  description: "Realtime smart irrigation system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <WateringProvider>{children}</WateringProvider>
      </body>
    </html>
  );
}

