// src/context/NotificationsContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/env"; // Importa la variable de entorno

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
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      // Usamos la variable API_URL para formar la URL de la API
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        // Actualizar contador de no leídas
        setUnreadCount(data.notifications.filter((n: INotification) => !n.read).length);
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

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      
      // Corregido: Cambiado de PUT a PATCH según el backend
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Actualizar estado local
        setNotifications(prevNotifications => 
          prevNotifications.map(notif => 
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        
        // Actualizar contador de no leídas
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error("Error marking notification as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Función para eliminar una notificación (marcar como eliminada)
  const deleteNotification = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      
      const response = await fetch(`${API_URL}/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Actualizar estado local eliminando la notificación de la lista
        setNotifications(prevNotifications => 
          prevNotifications.filter(notif => notif._id !== notificationId)
        );
        
        // Si la notificación no estaba leída, actualizar el contador
        const wasUnread = notifications.find(n => n._id === notificationId && !n.read);
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        console.error("Error deleting notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      
      // Implementación local ya que el backend no tiene un endpoint específico para esto
      // Marcamos cada notificación como leída una por una
      const unreadNotifications = notifications.filter(notif => !notif.read);
      
      for (const notif of unreadNotifications) {
        await markAsRead(notif._id);
      }
      
      // Actualizar estado local (esto ya se hace en markAsRead, pero lo hacemos de nuevo por seguridad)
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      
      // Actualizar contador de no leídas
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Función para agrupar notificaciones por fecha
  const getGroupedNotifications = () => {
    const grouped: Record<string, INotification[]> = {};
    
    notifications.forEach(notification => {
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
        // Formato: "26/02/2023"
        dateKey = date.toLocaleDateString();
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(notification);
    });
    
    return grouped;
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
    setUnreadCount(prev => prev + 1);
  };

  // Función para crear una notificación en el backend utilizando API_URL
  const createNotification = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(`${API_URL}/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Notificación de prueba API",
          message: "Esta notificación fue creada desde el botón de pruebas.",
          // El backend asigna el usuario a partir del token
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
