// src/context/NotificationsContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface INotification {
  _id: string;
  title: string;
  content: string;
  type: "check" | "plus" | "time";
  date: string;
  read: boolean;
}

interface INotificationsContext {
  notifications: INotification[];
  refreshNotifications: () => Promise<void>;
  addSampleNotification: () => void;
  createNotification: () => Promise<void>;
}

export const NotificationsContext = createContext<INotificationsContext>({
  notifications: [],
  refreshNotifications: async () => {},
  addSampleNotification: () => {},
  createNotification: async () => {},
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      console.log("Token:", token);
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("https://ledfit-back.vercel.app/api/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        console.error("Error fetching notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  // Función para agregar una notificación de prueba localmente
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
  };

  // Función para crear una notificación en el backend
  const createNotification = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("https://ledfit-back.vercel.app/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Notificación de prueba API",
          message: "Esta notificación fue creada desde el botón de pruebas."
          // Nota: El backend, gracias al middleware, debería asignar el usuario a partir del token.
        }),
      });
      if (response.ok) {
        console.log("Notificación creada en backend");
        await fetchNotifications();
      } else {
        console.error("Error creating notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, refreshNotifications, addSampleNotification, createNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
