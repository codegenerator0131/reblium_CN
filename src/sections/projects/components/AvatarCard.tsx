"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import Image from "next/image";
import {
  Loader2,
  Edit,
  Trash2,
  Copy,
  Download,
  MoreVertical,
  User,
  FileEdit,
} from "lucide-react";
import { UserContext } from "@/provider/UserContext";
import tmoApi from "@/lib/tmoApi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/AlertDialog";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/types/type";
import { useTranslation } from "react-i18next";

export interface AvatarCardProps {
  avatar: Avatar;
  onSetProfileAvatar: (avatarImage: number) => Promise<void>;
  onRenameAvatar: (avatarId: number, newName: string) => Promise<void>;
  onDeleteAvatar: (avatarId: number) => Promise<void>;
  onEditAvatar: (avatarId: number) => Promise<void>;
  onDuplicate: (avatarId: number) => Promise<void>;
  onShowToast?: (type: string, message: string) => void;
}

const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  onSetProfileAvatar,
  onRenameAvatar,
  onDeleteAvatar,
  onEditAvatar,
  onDuplicate,
  onShowToast,
}) => {
  const { t } = useTranslation("common");
  const { userInfo } = useContext(UserContext);
  const avatarId = avatar.id;
  const [newName, setNewName] = useState<string>(avatar.name);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isDeletng, setIsDeleting] = useState(false);
  const [isRenameDialog, setIsRenameDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRenameDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenameDialog]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRename = () => {
    if (newName.trim() && newName !== avatar.name) {
      onRenameAvatar(avatar.id, newName);
    }
    setIsRenameDialog(false);
    setNewName(avatar.name);
  };

  const handleRenameClick = () => {
    setIsMenuOpen(false);
    setNewName(avatar.name);
    setIsRenameDialog(true);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsRenameDialog(false);
      setNewName(avatar.name);
    }
  };

  const avatarSrc = avatar.image
    ? `data:image/jpeg;base64,${avatar.image}`
    : "/images/default_avatar.png";

  const handleDelete = () => {
    setIsDeleting(true);
    onDeleteAvatar(avatar.id);
    setIsDeleteConfirm(false);
    setIsDeleting(false);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEditAvatar(avatar.id);
  };

  const handleDuplicate = () => {
    setIsMenuOpen(false);
    onDuplicate(avatar.id);
  };

  const handleSetProfilePicture = async () => {
    setIsMenuOpen(false);
    try {
      await onSetProfileAvatar(avatar.id);
    } catch (error) {
      console.error("Failed to set profile picture:", error);
      onShowToast?.("error", "Failed to update profile picture");
    }
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsDeleteConfirm(true);
  };

  return (
    <div className="relative">
      <Card
        key={avatarId}
        className="relative aspect-square cursor-pointer hover:ring-2 hover:ring-primary transition-all !py-0 overflow-hidden"
      >
        <Image
          src={avatarSrc}
          alt={`Avatar`}
          width={400}
          height={400}
          className={`w-full h-full object-cover rounded-lg cursor-pointer`}
        />
        <div
          data-loc="client/src/pages/MyAvatars.tsx:219"
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-xl"
        >
          <p
            data-loc="client/src/pages/MyAvatars.tsx:220"
            className="text-white text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden w-full"
          >
            {avatar.name}
          </p>
        </div>

        {/* Menu Button and Dropdown */}
        <div className="absolute top-2 left-2 z-[10]">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      <div className="absolute top-[2.6rem] left-2 z-[11]" ref={menuRef}>
        {isMenuOpen && (
          <div className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[11] max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md">
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors hover:bg-accent"
            >
              <Edit className="h-4 w-4" />
              {t("projects.actions.edit")}
            </button>

            <button
              onClick={handleRenameClick}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors hover:bg-accent"
            >
              <FileEdit className="h-4 w-4" />
              {t("projects.actions.rename")}
            </button>

            <button
              onClick={handleSetProfilePicture}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-accent transition-colors"
            >
              <User className="h-4 w-4" />
              {t("projects.actions.setProfile")}
            </button>

            <button
              onClick={handleDuplicate}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors hover:bg-accent"
            >
              <Copy className="h-4 w-4" />
              {t("projects.actions.duplicate")}
            </button>

            <button
              disabled
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 cursor-not-allowed opacity-50"
              title="Export functionality coming soon"
            >
              <Download className="h-4 w-4" />
              {t("projects.actions.export")}
            </button>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              {t("projects.actions.delete")}
            </button>
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <AlertDialog open={isRenameDialog} onOpenChange={setIsRenameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("projects.rename.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("projects.rename.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleInputKeyPress}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("projects.rename.placeholder")}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewName(avatar.name)}>
              {t("projects.rename.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRename}
              disabled={!newName.trim() || newName === avatar.name}
            >
              {t("projects.rename.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteConfirm} onOpenChange={setIsDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("projects.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("projects.delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("projects.delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletng ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("projects.delete.deleting")}
                </>
              ) : (
                t("projects.delete.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvatarCard;
