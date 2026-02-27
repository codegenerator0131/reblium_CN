"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/provider/UserContext";
import Sidebar from "@/components/Sidebar";

const ROUTES = {
  FULL_SCREEN: [] as const,
  AUTH: [
    "/signup",
    "/login",
  ] as const,
  PUBLIC: [
    "/",
  ] as const,
  PROTECTED: [
    "/general",
    "/projects",
    "/credits",
    "/licenses",
    "/tutorial",
    "/store",
    "/orders",
    "/checkout",
    "/invoice",
    "/payment",
  ] as const,
  PUBLIC_WITH_SUBROUTES: ["/projects"] as const,
} as const;

interface ClientLayoutContentProps {
  children: React.ReactNode;
}

export function ClientLayoutContent({ children }: ClientLayoutContentProps) {
  const { isAuthenticated, loading } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isShowSidebar, setIsShowSidebar] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(200);

  // Load initial width from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-width");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) setSidebarWidth(parsed);
    }
  }, []);

  // Listen for sidebar width changes
  useEffect(() => {
    const handleWidthChange = (e: CustomEvent) => {
      setSidebarWidth(e.detail.width);
    };

    window.addEventListener(
      "sidebar-width-change",
      handleWidthChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "sidebar-width-change",
        handleWidthChange as EventListener
      );
    };
  }, []);

  const routeChecks = useMemo(() => {
    const checkRoute = (routes: readonly string[]) =>
      routes.some((route) =>
        route === "/" ? pathname === "/" : pathname.startsWith(route)
      );

    const checkProtectedRoute = () => {
      const isPublicSubroute = ROUTES.PUBLIC_WITH_SUBROUTES.some((route) =>
        pathname.startsWith(route + "/")
      );
      if (isPublicSubroute) return false;
      return ROUTES.PROTECTED.some((route) => pathname.startsWith(route));
    };

    return {
      isFullScreenRoute: checkRoute(ROUTES.FULL_SCREEN),
      isAuthRoute: checkRoute(ROUTES.AUTH),
      isPublicRoute: checkRoute(ROUTES.PUBLIC),
      isProtectedRoute: checkProtectedRoute(),
    };
  }, [pathname]);

  const { isFullScreenRoute, isAuthRoute, isPublicRoute, isProtectedRoute } =
    routeChecks;

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated && isProtectedRoute) router.push("/");
  }, [isAuthenticated, isProtectedRoute, router, loading]);

  useEffect(() => {
    if (!loading) setIsShowSidebar(isAuthenticated);
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
          <p className="text-white text-sm opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && isProtectedRoute) return null;

  if (isAuthRoute || isPublicRoute) {
    return (
      <div className="min-h-screen bg-background backdrop-blur-xs">
        {children}
      </div>
    );
  }

  const contentStyle: React.CSSProperties = {
    marginLeft: isShowSidebar ? `${sidebarWidth}px` : "0px",
    width: isShowSidebar ? `calc(100vw - ${sidebarWidth}px)` : "100vw",
  };

  const padding = isFullScreenRoute ? "p-0" : "py-5 px-6";

  return (
    <>
      {isShowSidebar && <Sidebar />}
      <div
        className={`overflow-x-hidden overflow-y-auto min-h-screen bg-background backdrop-blur-xs relative ${padding}`}
        style={contentStyle}
        data-theme=""
      >
        {children}
      </div>
    </>
  );
}
