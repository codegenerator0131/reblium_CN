'use client'

import { UserProvider } from "@/provider/UserContext";
import { CartProvider } from "@/provider/CartContext";
import { ClientLayoutContent } from "@/components/ClientLayoutContent";
import { ThemeProvider } from "@/provider/ThemeContext";

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <CartProvider>
        <ClientLayoutContent>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClientLayoutContent>
      </CartProvider>
    </UserProvider>
  );
}