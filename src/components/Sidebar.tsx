"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";
import { AiFillAppstore } from "react-icons/ai";
import { TbBuildingStore } from "react-icons/tb";
import { IoMdBook } from "react-icons/io";
import { FiUsers, FiPackage } from "react-icons/fi";
import { GoSidebarCollapse } from "react-icons/go";
import { CiCreditCard1 } from "react-icons/ci";
import { LuFileKey } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { UserContext } from "@/provider/UserContext";
import { useSelectedMenuItemStore } from "@/store/selectedMenuItem";
import { UserProfileDialog } from "./UserProfileDialog";

// === Constants for resizable sidebar ===
const SIDEBAR_WIDTH_KEY = "sidebar-width";
const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";
const DEFAULT_WIDTH = 200;
const COLLAPSED_WIDTH = 80;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const { userInfo, logout } = useContext(UserContext);
  const setHair = useSelectedMenuItemStore((state) => state.setHair);
  const setWardrobe = useSelectedMenuItemStore((state) => state.setWardrobe);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [selected, setSelected] = useState<string>("profile");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // === Sidebar width state ===
  const [width, setWidth] = useState<number>(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Load saved width and collapsed state from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const savedCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    if (savedCollapsed === "true") {
      setIsCollapsed(true);
      setWidth(COLLAPSED_WIDTH);

      // ✅ Notify layout immediately that sidebar width has changed
      window.dispatchEvent(
        new CustomEvent("sidebar-width-change", {
          detail: { width: COLLAPSED_WIDTH },
        }),
      );
    } else if (savedWidth) {
      const parsed = parseInt(savedWidth, 10);
      if (!isNaN(parsed)) {
        setWidth(parsed);

        // ✅ Also notify layout for normal (non-collapsed) state
        window.dispatchEvent(
          new CustomEvent("sidebar-width-change", {
            detail: { width: parsed },
          }),
        );
      }
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  // Handle resizing events with smooth animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || isCollapsed) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const newWidth = Math.min(Math.max(MIN_WIDTH, e.clientX), MAX_WIDTH);
        setWidth(newWidth);
        localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());

        window.dispatchEvent(
          new CustomEvent("sidebar-width-change", {
            detail: { width: newWidth },
          }),
        );
      });
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isResizing, isCollapsed]);

  useEffect(() => {
    const path = pathname.split("/").at(-1) || "profile";
    setSelected(path);
    localStorage.setItem("selectedMenuItem", path);
  }, [pathname]);

  const handleExit = async () => {
    localStorage.removeItem("create_mode");
    localStorage.removeItem("default_persona");
    localStorage.removeItem("defaultPersona");
    localStorage.removeItem("selected_assistant");
    setWardrobe("");
    setHair("");
    setShowExitPopup(false);
    const selectedItem = localStorage.getItem("selectedMenuItem");
    window.location.href = `/${selectedItem}`;
  };

  const handleMenuItemClick = (item: string) => {
    const avatarMode = localStorage.getItem("create_mode");

    if (avatarMode) {
      setShowExitPopup(true);
      localStorage.setItem("selectedMenuItem", item);
      return;
    }

    setSelected(item);
    localStorage.removeItem("selectedMenuItem");
    router.push(`/${item}`);
  };

  const handleLogOut = async () => logout();

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);

    if (newCollapsed) {
      setWidth(COLLAPSED_WIDTH);
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true");
      window.dispatchEvent(
        new CustomEvent("sidebar-width-change", {
          detail: { width: COLLAPSED_WIDTH },
        }),
      );
    } else {
      const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      const restoredWidth = savedWidth
        ? parseInt(savedWidth, 10)
        : DEFAULT_WIDTH;
      setWidth(restoredWidth);
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "false");
      window.dispatchEvent(
        new CustomEvent("sidebar-width-change", {
          detail: { width: restoredWidth },
        }),
      );
    }
  };

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width;

  const MenuItem = ({
    icon: Icon,
    label,
    onClick,
    isSelected,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    isSelected: boolean;
  }) => (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-center gap-3 p-2 rounded transition-colors text-sidebar-foreground  ${
          isSelected ? "bg-sidebar-accent font-bold" : "text-white"
        }`}
      >
        <Icon
          className={`${
            isSelected ? "text-primary" : ""
          } text-xl flex-shrink-0`}
        />
        {!isCollapsed && (
          <span className="w-[calc(100%-20px)] text-left whitespace-nowrap text-ellipsis overflow-hidden text-sm">
            {label}
          </span>
        )}
      </button>
      {isCollapsed && (
        <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap text-ellipsis overflow-hidden z-[50]">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800"></div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed left-0 top-0 h-full flex flex-col justify-between h-screen bg-sidebar z-[12]"
      style={{
        width: currentWidth,
        transition: isResizing ? "none" : "width 0.3s ease",
      }}
    >
      {/* === Resizer Handle === */}
      {!isCollapsed && (
        <div
          onMouseDown={() => setIsResizing(true)}
          className={`absolute right-0 top-0 h-full w-[6px] cursor-col-resize transition ${
            isResizing ? "bg-blue-400/50" : "hover:bg-blue-400/30"
          }`}
          style={{ zIndex: 51 }}
        />
      )}

      <div className="">
        {/* === Top Section === */}
        <div className="w-full flex flex-col gap-2 p-2 h-16 justify-center">
          <div
            className={`flex items-center ${
              !isCollapsed ? "pl-2 justify-between gap-3" : "justify-center"
            } transition-all w-full`}
          >
            <div
              className={`${
                isCollapsed ? "w-full" : "w-[calc(100%-32px-0.5rem)]"
              }  group relative cursor-pointer`}
              onClick={isCollapsed ? toggleCollapse : undefined}
            >
              <div className="flex items-center justify-center gap-3 min-w-0">
                <Image
                  src={"/images/reblium-logo.png"}
                  width={40}
                  height={40}
                  alt="Logo"
                  className="h-8 w-8 rounded-md object-cover ring-1 ring-border shrink-0"
                />
                {!isCollapsed && (
                  <p className="font-semibold whitespace-nowrap text-ellipsis overflow-hidden w-full text-sidebar-foreground">
                    {t("sidebar.appName")}
                  </p>
                )}
              </div>
              {isCollapsed && (
                <div className="w-full flex items-center justify-center absolute top-0 left-0">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 text-sidebar-foreground">
                    <GoSidebarCollapse />
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                className="ml-auto h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 text-sidebar-foreground"
                title={t("sidebar.collapseSidebar")}
              >
                <GoSidebarCollapse />
              </button>
            )}
          </div>
        </div>

        {/* === Middle Menu === */}
        <div className="icon-menu flex-1 flex items-center justify-center w-full px-2">
          <div id="newButton" className="menu flex flex-col gap-2 w-full">
            <MenuItem
              icon={AiFillAppstore}
              label={t("sidebar.menu.home")}
              onClick={() => handleMenuItemClick("general")}
              isSelected={selected === "general"}
            />
            <MenuItem
              icon={FiUsers}
              label={t("sidebar.menu.myAvatars")}
              onClick={() => handleMenuItemClick("projects")}
              isSelected={selected === "projects"}
            />
            <MenuItem
              icon={TbBuildingStore}
              label={t("sidebar.menu.store")}
              onClick={() => handleMenuItemClick("store")}
              isSelected={selected === "store"}
            />
            <MenuItem
              icon={FiPackage}
              label={t("sidebar.menu.orders")}
              onClick={() => handleMenuItemClick("orders")}
              isSelected={selected === "orders"}
            />
            <MenuItem
              icon={IoMdBook}
              label={t("sidebar.menu.tutorials")}
              onClick={() => handleMenuItemClick("tutorial")}
              isSelected={selected === "tutorial"}
            />
            <MenuItem
              icon={CiCreditCard1}
              label={t("sidebar.menu.credits")}
              onClick={() => handleMenuItemClick("credits")}
              isSelected={selected === "credits"}
            />
            <MenuItem
              icon={LuFileKey}
              label={t("sidebar.menu.licenses")}
              onClick={() => handleMenuItemClick("licenses")}
              isSelected={selected === "licenses"}
            />
          </div>
        </div>
      </div>

      {/* === Bottom Section - Profile === */}
      <div className="pb-4 w-full px-2 relative" ref={profileMenuRef}>
        <div
          className={`relative relative w-[${width}px] bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-(--sidebar-width-icon)`}
        >
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-[calc(100%-16px)] flex items-center justify-center gap-3 p-2 rounded hover:bg-sidebar-accent transition-colors m-auto"
          >
            {userInfo?.profile_picture ? (
              <Image
                className="rounded-full flex-shrink-0"
                src={`data:image/jpeg;base64,${userInfo.profile_picture}`}
                width={40}
                height={40}
                alt="User"
              />
            ) : (
              <Image
                className="rounded-full flex-shrink-0"
                src="/images/default_profile_picture.png"
                width={40}
                height={40}
                alt="Default User"
              />
            )}
            {!isCollapsed && (
              <div className="flex flex-col gap-1 w-[calc(100%-56px)] text-left">
                <p className="w-full whitespace-nowrap text-ellipsis overflow-hidden text-sm text-sidebar-foreground">
                  {userInfo?.name}
                </p>
                <p className="w-full whitespace-nowrap text-ellipsis overflow-hidden text-sm text-sidebar-foreground">
                  {userInfo?.email}
                </p>
              </div>
            )}
          </button>

          {/* Profile Menu Popup */}
          {showProfileMenu && (
            <div
              className={`absolute bg-sibebar-background border border-gray-500 rounded shadow-lg py-2 z-[12] transition-all duration-300 ease-out ${
                isCollapsed
                  ? "left-full ml-2 bottom-0"
                  : "bottom-full mb-2 left-0 right-0"
              } ${
                showProfileMenu ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{
                animation: "slideIn 0.3s ease-out",
              }}
            >
              {isCollapsed && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800"></div>
              )}
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setSettingsOpen(true);
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-sidebar-accent transition-colors flex items-center gap-3 text-sm whitespace-nowrap"
              >
                <MdAccountCircle className="text-sm" />
                <p>{t("sidebar.profile.settings")}</p>
              </button>
              <button
                onClick={() => {
                  handleLogOut();
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center gap-3 text-sm whitespace-nowrap"
              >
                <FaSignOutAlt className="text-sm rotate-180" />
                <p className="text-red-500">{t("sidebar.profile.signOut")}</p>
              </button>
            </div>
          )}
        </div>
      </div>

      {settingsOpen && (
        <UserProfileDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}

      {showExitPopup && (
        <div id="exitConfirmation" className="modal-exit">
          <div className="modal-content-exit">
            <h3>{t("sidebar.exitDialog.title")}</h3>
            <div className="modal-buttons-exit">
              <button id="save-exit" className="save-exit" onClick={handleExit}>
                {t("sidebar.exitDialog.yes")}
              </button>
              <button className="exit" onClick={() => setShowExitPopup(false)}>
                {t("sidebar.exitDialog.no")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
