import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import { LangProvider, AlertProvider } from "../lib/context";
import { AlertContainer } from "@/components/alerts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LangProvider>
      <AlertProvider>
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
          <Component {...pageProps} />
          <AlertContainer />
        </div>
      </AlertProvider>
    </LangProvider>
  );
}
