import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // includes \_id, username, role
      token: null,
      login: (userData, currentToken) => set({ user: userData, token: currentToken }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);

export default useAuthStore;
