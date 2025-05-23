import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import FeedbackButton from "../components/FeedbackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kirami - AI Image Generator",
  description: "Generate stunning AI images instantly with Kirami, powered by DALL-E 3",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const isDarkMode = window.localStorage.getItem('theme') === 'dark' || 
                    (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  
                  document.documentElement.classList.toggle('dark', isDarkMode);
                } catch (e) {}
              })();
            `,
          }}
        ></script>
        {/* Plausible Analytics */}
        <script 
          defer 
          data-domain="kirami.vercel.app" 
          src="https://plausible.io/js/script.file-downloads.outbound-links.js"
        ></script>
        <link rel="preload" href="/images/blue-armor.jpg" as="image" />
      </head>
      <body className={inter.className}>
        {children}
        <FeedbackButton />
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'bg-white dark:bg-slate-800 dark:text-white text-slate-800 shadow-lg',
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
