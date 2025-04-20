// src/context/NotificationsContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

export interface INotification {
  _id: string;
  title: string;
  content: string;
  type: "check" | "plus" | "time";
  date: string;
  read: boolean;
  deleted?: boolean; // Campo opcional para manejar notificaciones eliminadas
}

interface INotificationsContext {
  notifications: INotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>; // Nueva función para eliminar notificaciones
  addSampleNotification: () => void;
  createNotification: () => Promise<void>;
  getGroupedNotifications: () => Record<string, INotification[]>;
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: [],
  unreadCount: 0,
  refreshNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {}, // Implementación vacía por defecto
  addSampleNotification: () => {},
  createNotification: async () => {},
  getGroupedNotifications: () => ({}),
});

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications");
      const data = response.data;

      setNotifications(data.notifications || []);
      setUnreadCount(
        (data.notifications || []).filter((n: INotification) => !n.read).length,
      );
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log(
          "NotificationsContext: No autorizado para obtener notificaciones (estado esperado sin login).",
        );
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error(
          "Error fetching notifications (Axios):",
          error.response?.data || error.message,
        );
      }
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/read`);

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error(
        `Error marking notification ${notificationId} as read (Axios):`,
        error.response?.data || error.message,
      );
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);

      const wasUnread = notifications.find(
        (n) => n._id === notificationId && !n.read,
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== notificationId),
      );
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error(
        `Error deleting notification ${notificationId} (Axios):`,
        error.response?.data || error.message,
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notif) => !notif.read);
      if (unreadNotifications.length === 0) return;

      await Promise.all(
        unreadNotifications.map((notif) => markAsRead(notif._id)),
      );
    } catch (error) {
      console.error("Error marking all notifications as read (Axios):", error);
    }
  };

  const createNotification = async () => {
    try {
      const samplePayload = {
        title: "Nueva Notificación",
        content: "Contenido creado desde la app",
        type: "check",
      };
      const response = await axiosInstance.post(
        "/notifications",
        samplePayload,
      );

      if (response.status === 201) {
        await refreshNotifications();
      }
    } catch (error: any) {
      console.error(
        "Error creating notification (Axios):",
        error.response?.data || error.message,
      );
    }
  };

  const getGroupedNotifications = () => {
    const grouped: Record<string, INotification[]> = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey: string;

      if (date.toDateString() === today.toDateString()) {
        dateKey = "Hoy";
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = "Ayer";
      } else {
        dateKey = date.toLocaleDateString();
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(notification);
    });

    return grouped;
  };

  const addSampleNotification = () => {
    const newNotif: INotification = {
      _id: Math.random().toString(36).substr(2, 9),
      title: "Notificación de prueba",
      content: "Esta es una notificación de ejemplo para pruebas.",
      type: "check",
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addSampleNotification,
        createNotification,
        getGroupedNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
