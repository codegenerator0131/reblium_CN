/**
 * Mock tRPC client that replaces the real server connection.
 * Returns static data and handles mutations locally in memory.
 * All pages import `trpc` from `@/lib/trpc` which re-exports from here.
 */
import { useState, useCallback, useRef, useSyncExternalStore } from "react";
import {
  mockUser,
  mockStoreItems,
  mockAvatarProjects,
  mockTemplates,
  mockCreditPacks,
  mockCreditTransactions,
  mockCreditPurchases,
  mockLicenses,
  mockSoftwareVersions,
  mockSDKs,
  mockPoll,
  mockCartItems,
  mockFeatureRequests,
  mockDownloads,
  mockCollectionPurchases,
  mockInvoices,
  getStoreItemsByCategory,
} from "./mockData";

// ============ Simple Reactive Store ============
// Allows mutations to trigger re-renders in query hooks

type Listener = () => void;

function createStore<T>(initialData: T) {
  let data = initialData;
  const listeners = new Set<Listener>();

  return {
    get: () => data,
    set: (newData: T) => {
      data = newData;
      listeners.forEach(fn => fn());
    },
    update: (updater: (prev: T) => T) => {
      data = updater(data);
      listeners.forEach(fn => fn());
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Mutable stores for data that can change via mutations
const authUserStore = createStore<typeof mockUser | null>(mockUser);
const avatarProjectsStore = createStore([...mockAvatarProjects]);
const cartItemsStore = createStore([...mockCartItems]);
const featureRequestsStore = createStore([...mockFeatureRequests]);
const licensesStore = createStore([...mockLicenses]);
const creditBalanceStore = createStore(mockUser.creditBalance);
let nextId = 1000;

// ============ Hook Factories ============

function useMockQuery<T>(getData: () => T, _input?: unknown) {
  const data = getData();
  return {
    data,
    isLoading: false,
    isPending: false,
    isFetching: false,
    isError: false,
    error: null,
    status: "success" as const,
    refetch: async () => ({ data, isLoading: false, isPending: false, isFetching: false, isError: false, error: null, status: "success" as const }),
    fetchStatus: "idle" as const,
  };
}

function useStoreQuery<T>(store: ReturnType<typeof createStore<T>>) {
  const data = useSyncExternalStore(store.subscribe, store.get, store.get);
  return {
    data,
    isLoading: false,
    isPending: false,
    isFetching: false,
    isError: false,
    error: null,
    status: "success" as const,
    refetch: async () => ({ data, isLoading: false, isPending: false, isFetching: false, isError: false, error: null, status: "success" as const }),
    fetchStatus: "idle" as const,
  };
}

function useMockMutation<TInput = void, TOutput = { success: boolean }>(
  handler: (input: TInput) => TOutput | Promise<TOutput>,
  hookOpts?: { onSuccess?: (data: TOutput) => void; onError?: (error: unknown) => void }
) {
  const [isPending, setIsPending] = useState(false);
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const hookOptsRef = useRef(hookOpts);
  hookOptsRef.current = hookOpts;

  const mutateAsync = useCallback(async (input: TInput) => {
    setIsPending(true);
    try {
      const result = await handlerRef.current(input);
      setIsPending(false);
      hookOptsRef.current?.onSuccess?.(result);
      return result;
    } catch (e) {
      setIsPending(false);
      hookOptsRef.current?.onError?.(e);
      throw e;
    }
  }, []);

  const mutate = useCallback((input: TInput, callOpts?: { onSuccess?: (data: TOutput) => void; onError?: (error: unknown) => void }) => {
    mutateAsync(input).then(
      data => callOpts?.onSuccess?.(data),
      error => { if (!callOpts?.onError) return; callOpts.onError(error); }
    );
  }, [mutateAsync]);

  return {
    mutate,
    mutateAsync,
    isPending,
    isLoading: isPending,
    isError: false,
    error: null,
    isSuccess: false,
    data: undefined as TOutput | undefined,
    status: isPending ? "pending" as const : "idle" as const,
    reset: () => {},
  };
}

// ============ No-op Proxy for useUtils ============

function createNoopProxy(): any {
  return new Proxy(() => Promise.resolve(), {
    get: () => createNoopProxy(),
    apply: () => Promise.resolve(),
  });
}

// ============ Build the mock trpc object ============

function createQueryHook<T>(getData: () => T) {
  const hook = (_input?: any, _opts?: any) => useMockQuery(getData, _input);
  return { useQuery: hook };
}

function createStoreQueryHook<T>(store: ReturnType<typeof createStore<T>>) {
  const hook = (_input?: any, _opts?: any) => useStoreQuery(store);
  return { useQuery: hook };
}

function createMutationHook<TInput = void, TOutput = { success: boolean }>(
  handler: (input: TInput) => TOutput | Promise<TOutput>
) {
  const hook = (_opts?: { onSuccess?: (data: TOutput) => void; onError?: (error: unknown) => void }) => {
    return useMockMutation(handler, _opts);
  };
  return { useMutation: hook };
}

// Exported function to trigger mock sign-in from anywhere (e.g. Landing page)
export function mockSignIn() {
  authUserStore.set(mockUser);
}

export function mockSignOut() {
  authUserStore.set(null);
}

export const trpc = {
  useUtils: () => {
    // Return a proxy that handles auth.me.setData and auth.me.invalidate specially
    const authMeProxy = {
      setData: (_key: any, value: any) => { authUserStore.set(value); },
      invalidate: () => Promise.resolve(),
    };
    const authProxy = { me: authMeProxy };
    const handler: ProxyHandler<any> = {
      get: (_target, prop) => {
        if (prop === "auth") return authProxy;
        return createNoopProxy();
      },
    };
    return new Proxy({}, handler);
  },

  // Provider is a passthrough (not needed with mock)
  Provider: ({ children }: { children: React.ReactNode }) => children,
  createClient: () => ({}),

  auth: {
    me: {
      useQuery: (_input?: any, _opts?: any) => {
        const user = useSyncExternalStore(authUserStore.subscribe, authUserStore.get, authUserStore.get);
        return {
          data: user,
          isLoading: false,
          isPending: false,
          isFetching: false,
          isError: false,
          error: null,
          status: "success" as const,
          refetch: async () => ({ data: user, isLoading: false, isPending: false, isFetching: false, isError: false, error: null, status: "success" as const }),
          fetchStatus: "idle" as const,
        };
      },
    },
    logout: createMutationHook(() => {
      authUserStore.set(null);
      return { success: true as const };
    }),
    login: createMutationHook(() => {
      authUserStore.set(mockUser);
      return { success: true as const };
    }),
  },

  user: {
    getProfile: createQueryHook(() => mockUser),
    updateProfile: createMutationHook((_input: { name?: string; email?: string; bio?: string }) => ({ success: true })),
    changePassword: createMutationHook((_input: { currentPassword: string; newPassword: string }) => ({ success: true })),
    sendSupportRequest: createMutationHook((_input: { message: string }) => ({ success: true })),
  },

  avatarProjects: {
    list: {
      useQuery: (_input?: any, _opts?: any) => useStoreQuery(avatarProjectsStore),
    },
    create: createMutationHook((input: { name: string; thumbnailUrl?: string; thumbnailKey?: string }) => {
      avatarProjectsStore.update(prev => [
        { id: ++nextId, userId: 1, name: input.name, thumbnailUrl: input.thumbnailUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + nextId, thumbnailKey: input.thumbnailKey || null, isPublished: false, createdAt: new Date(), updatedAt: new Date() },
        ...prev,
      ]);
      return { success: true };
    }),
    update: createMutationHook((input: { id: number; name?: string; thumbnailUrl?: string; isPublished?: boolean }) => {
      avatarProjectsStore.update(prev => prev.map(p => p.id === input.id ? { ...p, ...input, updatedAt: new Date() } : p));
      return { success: true };
    }),
    delete: createMutationHook((input: { id: number }) => {
      avatarProjectsStore.update(prev => prev.filter(p => p.id !== input.id));
      return { success: true };
    }),
    duplicate: createMutationHook((input: { id: number }) => {
      avatarProjectsStore.update(prev => {
        const original = prev.find(p => p.id === input.id);
        if (!original) return prev;
        return [
          { ...original, id: ++nextId, name: `${original.name} (Copy)`, isPublished: false, createdAt: new Date(), updatedAt: new Date() },
          ...prev,
        ];
      });
      return { success: true };
    }),
  },

  templates: {
    list: createQueryHook(() => mockTemplates),
    createFromTemplate: createMutationHook((input: { templateId: number; name: string }) => {
      const template = mockTemplates.find(t => t.id === input.templateId);
      avatarProjectsStore.update(prev => [
        { id: ++nextId, userId: 1, name: input.name, thumbnailUrl: template?.thumbnailUrl || null, thumbnailKey: null, isPublished: false, createdAt: new Date(), updatedAt: new Date() },
        ...prev,
      ]);
      return { success: true };
    }),
  },

  store: {
    listItems: {
      useQuery: (_input?: any, _opts?: any) => useMockQuery(getStoreItemsByCategory),
    },
    getItemById: {
      useQuery: (input: { itemId: number }, _opts?: any) => useMockQuery(() => mockStoreItems.find(i => i.id === input.itemId) || null, input),
    },
    purchaseItem: createMutationHook((_input: { storeItemId: number; licenseType: "personal" | "commercial" }) => ({ success: true, priceUSD: 0 })),
  },

  purchase: {
    getUserItems: createQueryHook(() => []),
    getUserPurchases: createQueryHook(() => mockCollectionPurchases),
  },

  collection: {
    getPurchases: {
      useQuery: (_input?: any, _opts?: any) => useMockQuery(() => mockCollectionPurchases),
    },
    upgradeLicense: createMutationHook((_input: { userItemId: number; newLicenseType: "personal" | "commercial" }) => ({
      success: true,
      upgradeCost: 50,
      newLicenseType: "commercial" as const,
    })),
  },

  credits: {
    getBalance: {
      useQuery: (_input?: any, _opts?: any) => {
        const balance = useSyncExternalStore(creditBalanceStore.subscribe, creditBalanceStore.get, creditBalanceStore.get);
        return {
          data: { balance },
          isLoading: false,
          isPending: false,
          isFetching: false,
          isError: false,
          error: null,
          status: "success" as const,
          refetch: async () => ({ data: { balance }, isLoading: false, isPending: false, isFetching: false, isError: false, error: null, status: "success" as const }),
          fetchStatus: "idle" as const,
        };
      },
    },
    listPacks: createQueryHook(() => mockCreditPacks),
    purchasePack: createMutationHook((input: { packId: number }) => {
      const pack = mockCreditPacks.find(p => p.id === input.packId);
      if (pack) {
        creditBalanceStore.update(prev => prev + pack.credits);
      }
      return { success: true, newBalance: creditBalanceStore.get() };
    }),
    getTransactions: createQueryHook(() => mockCreditTransactions),
    getPurchases: createQueryHook(() => mockCreditPurchases),
  },

  downloads: {
    list: createQueryHook(() => mockDownloads),
    exportAsset: createMutationHook((_input: { projectId: number; format: string; creditCost: number }) => ({
      success: true,
      assetUrl: "#",
      newBalance: creditBalanceStore.get(),
    })),
  },

  invoices: {
    list: createQueryHook(() => mockInvoices),
  },

  updates: {
    listVersions: createQueryHook(() => mockSoftwareVersions),
    getLatest: createQueryHook(() => mockSoftwareVersions.find(v => v.isLatest) || null),
  },

  licenses: {
    list: {
      useQuery: (_input?: any, _opts?: any) => useStoreQuery(licensesStore),
    },
    create: createMutationHook((input: { licenseType: string; expiresAt?: Date }) => {
      const licenseKey = `RB-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      licensesStore.update(prev => [
        { id: ++nextId, userId: 1, licenseKey, licenseType: input.licenseType, status: "active" as const, expiresAt: input.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), createdAt: new Date() },
        ...prev,
      ]);
      return { success: true, licenseKey };
    }),
    updateStatus: createMutationHook((_input: { licenseId: number; status: "active" | "expired" | "revoked" }) => ({ success: true })),
  },

  polls: {
    getActive: createQueryHook(() => mockPoll),
    vote: createMutationHook((_input: { pollId: number; optionId: number; voterIdentifier: string }) => mockPoll),
    getResults: {
      useQuery: (_input: { pollId: number }, _opts?: any) => useMockQuery(() => mockPoll.options),
    },
  },

  sdks: {
    list: createQueryHook(() => mockSDKs),
    byEngine: {
      useQuery: (input: { engine: string }, _opts?: any) => useMockQuery(() => mockSDKs.filter(s => s.engine === input.engine)),
    },
    getById: {
      useQuery: (input: { id: number }, _opts?: any) => useMockQuery(() => mockSDKs.find(s => s.id === input.id) || null),
    },
  },

  cart: {
    getItems: {
      useQuery: (_input?: any, _opts?: any) => useStoreQuery(cartItemsStore),
    },
    addItem: createMutationHook((input: { storeItemId: number; licenseType: "personal" | "commercial"; quantity?: number }) => {
      cartItemsStore.update(prev => {
        const existing = prev.find(c => c.storeItemId === input.storeItemId && c.licenseType === input.licenseType);
        if (existing) {
          return prev.map(c => c.id === existing.id ? { ...c, quantity: c.quantity + (input.quantity || 1) } : c);
        }
        const item = mockStoreItems.find(i => i.id === input.storeItemId) || null;
        return [...prev, {
          id: ++nextId,
          userId: 1,
          storeItemId: input.storeItemId,
          licenseType: input.licenseType,
          quantity: input.quantity || 1,
          item,
          createdAt: new Date(),
        }];
      });
      return { success: true };
    }),
    removeItem: createMutationHook((input: { cartItemId: number }) => {
      cartItemsStore.update(prev => prev.filter(c => c.id !== input.cartItemId));
      return { success: true };
    }),
    updateQuantity: createMutationHook((input: { cartItemId: number; quantity: number }) => {
      cartItemsStore.update(prev =>
        input.quantity <= 0
          ? prev.filter(c => c.id !== input.cartItemId)
          : prev.map(c => c.id === input.cartItemId ? { ...c, quantity: input.quantity } : c)
      );
      return { success: true };
    }),
    clear: createMutationHook(() => {
      cartItemsStore.set([]);
      return { success: true };
    }),
  },

  featureRequests: {
    getAll: {
      useQuery: (_input?: any, _opts?: any) => useStoreQuery(featureRequestsStore),
    },
    create: createMutationHook((input: { userId: number; userName: string; title: string; category: string; description: string }) => {
      const newRequest = {
        id: ++nextId,
        userId: input.userId,
        userName: input.userName,
        title: input.title,
        category: input.category,
        description: input.description,
        upvotes: 0,
        downvotes: 0,
        status: "open" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      featureRequestsStore.update(prev => [newRequest, ...prev]);
      return newRequest;
    }),
    update: createMutationHook((input: { requestId: number; userId: number; title: string; category: string; description: string }) => {
      featureRequestsStore.update(prev =>
        prev.map(r => r.id === input.requestId ? { ...r, title: input.title, category: input.category, description: input.description, updatedAt: new Date() } : r)
      );
      return { success: true };
    }),
    delete: createMutationHook((input: { requestId: number; userId: number }) => {
      featureRequestsStore.update(prev => prev.filter(r => r.id !== input.requestId));
      return { success: true };
    }),
    vote: createMutationHook((input: { requestId: number; userIdentifier: string; voteType: "upvote" | "downvote" }) => {
      featureRequestsStore.update(prev =>
        prev.map(r => {
          if (r.id !== input.requestId) return r;
          return input.voteType === "upvote"
            ? { ...r, upvotes: r.upvotes + 1 }
            : { ...r, downvotes: r.downvotes + 1 };
        })
      );
      return { success: true };
    }),
    getUserVote: {
      useQuery: (_input: { requestId: number; userIdentifier: string }, _opts?: any) => useMockQuery(() => null),
    },
    getById: {
      useQuery: (input: { requestId: number }, _opts?: any) => useMockQuery(() => {
        const r = featureRequestsStore.get().find(r => r.id === input.requestId);
        return r ? [r] : [];
      }),
    },
  },

  contentSubmission: {
    submit: createMutationHook((_input: any) => ({ success: true, submissionId: ++nextId })),
    getPending: createQueryHook(() => []),
    getAll: createQueryHook(() => []),
    getByArtist: createQueryHook(() => []),
    review: createMutationHook((_input: any) => ({ success: true })),
  },

  system: {
    health: createQueryHook(() => ({ status: "ok" })),
    notifyOwner: createMutationHook((_input: any) => ({ success: true })),
  },
};
