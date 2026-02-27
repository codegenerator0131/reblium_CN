import type { Metadata } from "next";
import { ThemeProvider } from "@/provider/ThemeContext";
import { LanguageProvider } from "@/provider/LanguageContext";
import "../styles/globals.css";
import ClientWrapper from "@/components/ClientWrapper";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export const metadata: Metadata = {
  title: "Reblium",
  description: "Reblium Avatar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
