import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, Users, Store, CreditCard, Settings, BookOpen, Palette, Download, ShoppingCart, Package, HelpCircle, Upload, CheckSquare, Trello, Layers, Newspaper, Sun, Moon } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Footer } from './Footer';
import { Button } from "./ui/button";

const getMenuItems = (t: (key: string) => string, userRole?: string) => [
  { icon: LayoutDashboard, label: t('nav.home'), path: "/" },
  { icon: Users, label: t('nav.myAvatars'), path: "/my-avatars" },
  { icon: Package, label: t('nav.myCollection'), path: "/my-collection" },
  { icon: Store, label: t('nav.store'), path: "/store" },
  { icon: ShoppingCart, label: t('nav.cart'), path: "/shopping-cart" },
  { icon: BookOpen, label: t('nav.tutorials'), path: "/tutorials" },
  { icon: Download, label: t('nav.updates'), path: "/updates", badge: true },
  { icon: Newspaper, label: t('nav.blog'), path: "/blog" },
  { icon: HelpCircle, label: t('nav.faq'), path: "/faq" },
  { icon: Palette, label: t('nav.artists'), path: "/artists" },
];

const getBottomMenuItems = (t: (key: string) => string, userRole?: string) => [
  { icon: Upload, label: t('nav.publishingTool'), path: "/publishing-tool" },
  { icon: Layers, label: t('nav.assetManagement'), path: "/asset-management" },
];

// Review Queue removed - functionality integrated into Asset Management Kanban view

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

import { UserProfileDialog } from "./UserProfileDialog";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";


function ThemeToggleButton() {
  const { theme, toggleTheme, switchable } = useTheme();
  if (!switchable || !toggleTheme) return null;
  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();
  const menuItems = getMenuItems(t, user?.role);
  const bottomMenuItems = getBottomMenuItems(t, user?.role);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  // Use mock user for public mockup mode - bypass login requirement
  const displayUser = user || {
    id: "demo-user",
    email: "demo@genji.studio",
    name: "Demo User",
    role: "user" as const,
  };

  if (false && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="relative">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663044718178/pswLrQGbiFtIAmRK.png"
                  alt="Genji Logo"
                  className="h-24 w-24 rounded-lg object-contain"
                />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage your avatar projects
              </p>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              size="lg"
              className="w-full shadow-lg hover:shadow-xl transition-all bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              Sign in with Manus
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full hover:bg-accent transition-colors"
                onClick={() => alert('WeChat login - Coming soon')}
                title="WeChat"
              >
                <span className="text-lg">微信</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full hover:bg-accent transition-colors"
                onClick={() => alert('QQ login - Coming soon')}
                title="QQ"
              >
                <span className="text-lg">QQ</span>
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full hover:bg-accent transition-colors"
                onClick={() => alert('Sina Weibo login - Coming soon')}
                title="Sina Weibo"
              >
                <span className="text-lg">微博</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuItems = getMenuItems(t, user?.role);
  const bottomMenuItems = getBottomMenuItems(t, user?.role);
  const activeMenuItem = menuItems.find((item: any) => item.path === location);
  const isMobile = useIsMobile();
  
  // Use mock user for public mockup mode
  const displayUser = user || {
    id: "demo-user",
    email: "demo@genji.studio",
    name: "Demo User",
    role: "user" as const,
  };

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 pl-2 group-data-[collapsible=icon]:px-0 transition-all w-full">
              {isCollapsed ? (
                <div className="relative h-8 w-8 shrink-0 group">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663044718178/iq22PtDDLnfa9zucwBEcgk/pasted_file_mDyGx8_image_080f602f.png"
                    className="h-8 w-8 rounded-md object-contain dark:invert"
                    alt="Genji Logo"
                  />
                  <button
                    onClick={toggleSidebar}
                    className="absolute inset-0 flex items-center justify-center bg-accent rounded-md ring-1 ring-border opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <PanelLeft className="h-4 w-4 text-foreground" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663044718178/iq22PtDDLnfa9zucwBEcgk/pasted_file_mDyGx8_image_080f602f.png"
                      className="h-8 w-8 rounded-md object-contain shrink-0 dark:invert"
                      alt="Genji Logo"
                    />
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="ml-auto h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                  >
                    <PanelLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                </>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 overflow-y-auto">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
                    >
                      <div className="relative">
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                        />
                        {(item as any).badge && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarContent className="gap-0 flex-1">
          </SidebarContent>

          <SidebarFooter className="p-3 space-y-3">
            <SidebarMenu className="px-0">
              {bottomMenuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
                    >
                      <div className="relative">
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                        />
                        {(item as any).badge && (
                          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <div className="border-t border-border"></div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-9 w-9 border shrink-0">
                      <AvatarFallback className="text-xs font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate leading-none">
                        {user.name || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1.5">
                        {user.email || "-"}
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setIsProfileDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => { window.location.href = getLoginUrl(); }}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:p-0"
                size="sm"
              >
                <span className="group-data-[collapsible=icon]:hidden">{t('common.signIn')}</span>
                <LogOut className="hidden group-data-[collapsible=icon]:block h-4 w-4" />
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        <div className="flex border-b h-14 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-2">
            {isMobile && <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />}
            {isMobile && (
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? ''}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggleButton />
          </div>
        </div>
        <main className="flex-1 p-4">{children}</main>
        <Footer />
      </SidebarInset>
      
      <UserProfileDialog 
        open={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen} 
      />
    </>
  );
}
