// app/context/UsersContext.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  tag?: string;
  passwordHash?: string;
  deviceIds: Device[];
  createdAt: string;
  updatedAt: string;
}

interface Device {
  deviceId: string;
  platform: string;
  lastLogin: string;
}

interface UsersContextValue {
  user: User | null;
  loadUser: boolean;
  errorUser: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
}

export const UsersContext = createContext<UsersContextValue>({
  user: null,
  loadUser: true,
  errorUser: null,
  login: async () => {},
  logout: () => {},
  reloadUser: async () => {},
});

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadUser, setLoadUser] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoadUser(true);
      const response = await fetch("http://192.168.1.3:5000/api/users/me", {
        // For session-based authentication credentials: "include",
      });
      if (!response.ok) {
        throw new Error("ErrorUser fetching user");
      }
      const data = await response.json();
      setUser(data);
      setErrorUser(null);
    } catch (err: any) {
      console.error("ErrorUser fetching user:", err);
      setErrorUser("Failed to load user");
      setUser(null);
    } finally {
      setLoadUser(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoadUser(true);
      const response = await fetch("http://192.168.1.3:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }
      const data = await response.json();
      setUser(data);
      setErrorUser(null);
    } catch (err: any) {
      console.error("Login errorUser:", err);
      setErrorUser("Login failed");
      setUser(null);
    } finally {
      setLoadUser(false);
    }
  };

  const logout = () => {
    setUser(null);
    fetch("http://192.168.1.3:5000/api/users/logout", {
      method: "POST",
      //credentials: "include",
    }).catch((err) => console.error("Logout errorUser:", err));
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UsersContext.Provider
      value={{
        user,
        loadUser,
        errorUser,
        login,
        logout,
        reloadUser: fetchUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;
