"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { privateInstance } from "@/configs/axiosConfig";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";

import { useTranslations } from "@/providers/TranslationProviders";
import {
  AppInfoType,
  NotificationResponseType,
  NotificationType,
} from "@/types";
import { ArrowRightIcon, BellIcon } from "@phosphor-icons/react/dist/ssr";

type Props = {
  appInfo: {
    firebase: AppInfoType["firebase"];
  };
};

export const FirebaseNotification = ({ appInfo: { firebase } }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { tran } = useTranslations();
  const { data, isLoading } = useGetQuery<NotificationResponseType>({
    url: "/profile/notifications",
    params: { per_page: 5 },
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Push token to server
  const sendFcmToken = useCallback(async (token: string) => {
    try {
      await privateInstance.post("profile/update-fcm-token", { token });
    } catch (err) {
      console.warn("Error sending FCM token:", err);
    }
  }, []);

  // Initialize Firebase and Notification
  const initFirebase = useCallback(async () => {
    if (
      initialized ||
      (isMounted && typeof window === "undefined") ||
      typeof Notification === "undefined" ||
      typeof Notification.requestPermission !== "function" ||
      !firebase?.apiKey
    )
      return;

    try {
      const app: FirebaseApp = initializeApp(firebase);

      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.warn("Notification permission denied");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: firebase.vapidKey ?? "",
      });

      if (token) {
        await sendFcmToken(token);
      } else {
        console.warn("No FCM token retrieved.");
      }

      onMessage(messaging, (payload) => {
        const msg = payload?.notification;
        if (msg) {
          const n = new Notification(msg.title ?? "New Notification", {
            body: msg.body,
          });

          setNotifications((prev) => [
            {
              data: msg.body ?? "New Notification",
              created_at: new Date().toISOString(),
            },
            ...prev,
          ]);

          n.onclick = () => {
            window.focus();
            n.close();
          };
        }
      });

      setInitialized(true);
    } catch (err) {
      console.warn("Firebase init failed:", err);
    }
  }, [firebase, initialized, sendFcmToken, isMounted]);

  useEffect(() => {
    if (firebase?.apiKey) {
      initFirebase();
    }
  }, [firebase, initFirebase]);

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data);
    }
  }, [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-none">
        <Button
          size="sm"
          className="relative size-10 rounded-full max-sm:p-2 sm:size-12"
        >
          <BellIcon className="text-xl sm:text-2xl" />
          {notifications.length > 0 && (
            <div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
              {notifications.length}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="space-y-1">
        {notifications.map((n, i) => (
          <DropdownMenuItem
            key={`notif-${i}`}
            className="bg-secondary/5 flex flex-col items-start gap-1 py-1"
          >
            <span>{n.data}</span>
            <span className="text-light4 text-xs">
              {moment(n.created_at).fromNow()}
            </span>
          </DropdownMenuItem>
        ))}

        {notifications.length > 2 && (
          <DropdownMenuItem className="text-muted-foreground p-0 text-sm">
            <Button
              size="sm"
              href="/notifications"
              className="w-full"
              variant="outline"
            >
              <span>{tran("View all")}</span> <ArrowRightIcon />
            </Button>
          </DropdownMenuItem>
        )}

        {notifications.length === 0 && !isLoading && (
          <DropdownMenuItem className="text-muted-foreground text-sm">
            {tran("No notifications")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
