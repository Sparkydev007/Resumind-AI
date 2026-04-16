import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<Object>;
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;

  hasCheckedAuth: boolean; // ✅ ADD

  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };

  fs: any;
  ai: any;
  kv: any;

  init: () => void;
  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>()((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      hasCheckedAuth: true, 
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const isSignedIn = await puter.auth.isSignedIn();

      if (isSignedIn) {
        const user = await puter.auth.getUser();

        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
          hasCheckedAuth: true,
        });

        return true;
      } else {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
          hasCheckedAuth: true, // ✅ ADD
        });

        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth error");
      return false;
    }
  };

  const signIn = async () => {
    const puter = getPuter();
    if (!puter) return;

    set({ isLoading: true });

    await puter.auth.signIn();
    await checkAuthStatus();
  };

  const signOut = async () => {
    const puter = getPuter();
    if (!puter) return;

    set({ isLoading: true });

    await puter.auth.signOut();

    set({
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: () => null,
      },
      isLoading: false,
      hasCheckedAuth: true,
    });
  };

  const refreshUser = async () => {
    const puter = getPuter();
    if (!puter) return;

    const user = await puter.auth.getUser();

    set({
      auth: {
        user,
        isAuthenticated: true,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: () => user,
      },
      isLoading: false,
      hasCheckedAuth: true, // ✅ ADD
    });
  };

  const init = () => {
    const boot = async () => {
      const wait = () =>
        new Promise<void>((resolve) => {
          const i = setInterval(() => {
            if (window.puter) {
              clearInterval(i);
              resolve();
            }
          }, 50);
        });

      await wait();

      set({ puterReady: true });
      await checkAuthStatus();
    };

    boot();
  };

  return {
    isLoading: false,
    error: null,
    puterReady: false,

    hasCheckedAuth: false, // ✅ ADD

    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },

    fs: {} as any,
    ai: {} as any,
    kv: {} as any,

    init,
    clearError: () => set({ error: null }),
  };
});