import { storageKeys } from '@/shared/config/storage-keys';
import { create } from 'zustand';
import { useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

type State = {
  isAuthenticated: boolean;
  user: User | null;
};

type Action = {
  changeAuthStatus: (status: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const authStore = create<State & Action>((set) => ({
  isAuthenticated: !!localStorage.getItem(storageKeys.ACCESS_TOKEN),
  user: (() => {
    const userData = localStorage.getItem(storageKeys.USER);
    return userData ? JSON.parse(userData) : null;
  })(),
  changeAuthStatus: (status: boolean) =>
    set(() => ({ isAuthenticated: status })),
  setUser: (user: User | null) => set(() => ({ user })),
  logout: () => {
    localStorage.removeItem(storageKeys.ACCESS_TOKEN);
    localStorage.removeItem(storageKeys.USER);
    set(() => ({ isAuthenticated: false, user: null }));
  },
}));

export const useAuthStore = () => {
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const changeAuthStatus = authStore((state) => state.changeAuthStatus);
  const user = authStore((state) => state.user);
  const setUser = authStore((state) => state.setUser);
  const logout = authStore((state) => state.logout);

  useEffect(() => {
    const token = localStorage.getItem(storageKeys.ACCESS_TOKEN);
    const userData = localStorage.getItem(storageKeys.USER);

    changeAuthStatus(!!token);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return { isAuthenticated, changeAuthStatus, user, setUser, logout };
};

export default authStore;
