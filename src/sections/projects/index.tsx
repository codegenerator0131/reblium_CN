"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import Image from "next/image";

import { HiUserAdd } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserContext } from "@/provider/UserContext";
import { useRouter } from "next/navigation";
import AvatarCard from "./components/AvatarCard";
import { LoadingOverlay } from "@/components/LoadingComponent";

import { TEMPLATE_USER_IDS } from "@/Constant";
import { DataLoadingComponent } from "@/components/DataLoading";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";
import tmoApi from "@/lib/tmoApi";

const ProjectsView: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { userInfo, loading, isAuthenticated, refetchUserData } =
    useContext(UserContext);

  const [avatars, setAvatars] = useState([]);
  const [templateAvatars, setTemplateAvatars] = useState([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const [templateAvatarsLoading, setTemplateAvatarsLoading] = useState(true);

  const fetchAvatars = useCallback(async () => {
    if (!isAuthenticated) return;
    setAvatarsLoading(true);
    try {
      const token = tmoApi.getTMOToken();
      const response = await fetch("/api/avatars", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch avatars");
      }
      const { success, avatars } = await response.json();
      if (success) {
        const sortedData = avatars.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setAvatars(sortedData);
      }
      setAvatarsLoading(false);
    } catch (err) {
      console.error("Error fetching avatars:", err);
    } finally {
      setAvatarsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTemplateAvatars = useCallback(async () => {
    if (!isAuthenticated) return;
    setTemplateAvatarsLoading(true);
    try {
      const token = tmoApi.getTMOToken();
      const response = await fetch("/api/avatars/template", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ templateUserIds: TEMPLATE_USER_IDS }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch avatars");
      }
      const { success, avatars } = await response.json();
      if (success) {
        const sortedData = avatars.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setTemplateAvatars(sortedData);
      }
      setTemplateAvatarsLoading(false);
    } catch (err) {
      console.error("Error fetching avatars:", err);
    } finally {
      setTemplateAvatarsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    refetchUserData();
    if (avatarsLoading) {
      fetchAvatars();
      fetchTemplateAvatars();
    }
  }, [isAuthenticated, fetchAvatars, fetchTemplateAvatars, avatarsLoading]);

  const handleSetProfileAvatar = async (avatarId: number): Promise<void> => {
    try {
      const token = tmoApi.getTMOToken();
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_id: `${avatarId}` }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      await refetchUserData();
      toast.success(t("projects.toast.profileSuccess"));
    } catch (err) {
      console.error("Failed to update profile image:", err);
    }
  };

  const handleCreateNewAvatar = () => {
    window.location.href = `myunrealapp://login_success_token${tmoApi.getTMOToken()}`;
  };

  const handleRenameAvatar = async (
    avatarId: number,
    newName: string
  ): Promise<void> => {
    try {
      if (!isAuthenticated) return;
      const token = tmoApi.getTMOToken();
      const response = await fetch(`/api/avatars`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rename: newName, id: avatarId }),
      });

      const { message, success } = await response.json();

      if (success) {
        if (success) {
          toast.success(message);
          setAvatars((prevAvatars) =>
            prevAvatars.map((avatar) =>
              avatar.id === avatarId ? { ...avatar, name: newName } : avatar
            )
          );
        } else {
          toast.error("Failed to delete avatar");
        }
      }
    } catch (err) {
      console.error("Failed to rename avatar:", err);
    }
  };

  const handleDeleteAvatar = async (avatarId: number): Promise<void> => {
    try {
      if (!isAuthenticated) return;

      const token = tmoApi.getTMOToken();
      const response = await fetch(`/api/avatars?id=${avatarId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, message } = await response.json(); // Await the promise

      if (success) {
        toast.success(message);
        setAvatars((prevAvatars) =>
          prevAvatars.filter((avatar) => avatar.id !== avatarId)
        );
        refetchUserData();
      } else {
        toast.error("Failed to delete avatar");
      }
    } catch (err) {
      console.error("Failed to delete avatar:", err);
    }
  };

  const handleEditAvatar = async (avatarId: number): Promise<void> => {
    window.location.href = `myunrealapp://login_success_avatarId${avatarId}_token${tmoApi.getTMOToken()}`;
  };

  const handleDuplicateAvatar = async (avatarId: number): Promise<void> => {
    try {
      const token = tmoApi.getTMOToken();
      const response = await fetch(`/api/avatars/duplicate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatarId: avatarId,
        }),
      });

      const data = await response.json(); // Await the promise

      if (data.success) {
        toast.success(data.message);
        setAvatars((prevAvatars) => [
          {
            id: data.insertedId,
            name: data.name,
            image: data.image,
            avatar: data.avatar,
            created_at: data.created_at,
            updated_at: data.updated_at,
          },
          ...prevAvatars,
        ]);
      } else {
        toast.error("Failed to delete avatar");
      }
    } catch (err) {
      console.error("Failed to delete avatar:", err);
    }
  };

  const handleUseTemplate = (templateAvatarId) => {
    window.location.href = `myunrealapp://login_success_avatarId${templateAvatarId}_token${tmoApi.getTMOToken()}`;
  };

  const showToast = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    toast[type](message);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;
  if (!userInfo) return <div>No user data available</div>;

  return (
    <>
      <div className="w-full rounded-lg space-y-4">
        <div className="">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="">
              <h1 className={`text-2xl font-bold text-foreground`}>
                {t("projects.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("projects.subtitle")}
              </p>
            </div>
            {!avatarsLoading && (
              <div className="flex justify-between items-center">
                <button
                  onClick={handleCreateNewAvatar}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 gap-2 font-bold"
                >
                  <HiUserAdd className="text-lg" />
                  {t("projects.createNew")}
                </button>
              </div>
            )}
          </div>
          {avatarsLoading ? (
            <LoadingOverlay classStr={"image-loader"} type={"avatars"} />
          ) : avatars.length === 0 ? (
            <div
              data-loc="client/src/pages/MyAvatars.tsx:226"
              className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg"
            >
              <p
                data-loc="client/src/pages/MyAvatars.tsx:227"
                className="text-muted-foreground mb-4"
              >
                {t("projects.noProjects")}
              </p>
              <button
                data-slot="button"
                onClick={handleCreateNewAvatar}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-transparent shadow-xs hover:bg-accent dark:bg-transparent dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 text-foreground font-bold"
              >
                {t("projects.createFirst")}
              </button>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-x-hidden overflow-y-auto p-2 scrollbar-gutter-stable">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {avatars.map((avatar, index) => (
                  <AvatarCard
                    key={avatar.id}
                    avatar={avatar}
                    onSetProfileAvatar={handleSetProfileAvatar}
                    onRenameAvatar={handleRenameAvatar}
                    onDeleteAvatar={handleDeleteAvatar}
                    onDuplicate={handleDuplicateAvatar}
                    onEditAvatar={handleEditAvatar}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="">
          <div className="mb-4">
            <h1 className={`text-2xl font-bold text-foreground`}>
              {t("projects.templates.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("projects.templates.subtitle")}
            </p>
          </div>

          {templateAvatarsLoading ? (
            <DataLoadingComponent />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-2">
              {templateAvatars.map((avatar) => (
                <Card
                  key={avatar?.id}
                  className="group relative aspect-square overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all !py-0"
                  onClick={() => handleUseTemplate(avatar?.id)}
                >
                  <Image
                    src={`data:image/jpeg;base64,${avatar?.image}`}
                    alt={`Avatar`}
                    width={400}
                    height={400}
                    className={`w-full h-full object-cover rounded-lg cursor-pointer`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {avatar?.name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm">
                      {t("projects.templates.useTemplate")}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
};

export default ProjectsView;
