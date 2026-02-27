"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import tmoApi from "@/lib/tmoApi";
import {
  TMOCart,
  TMOCartItem,
  TMOCartTotals,
  TMOCartItemProductOption,
  MappedCartItem,
} from "@/types/tmo";
import { UserContext } from "./UserContext";

interface CartContextType {
  cart: TMOCart | null;
  cartItems: MappedCartItem[];
  cartId: string | null;
  loading: boolean;
  itemsCount: number;
  totals: TMOCartTotals | null;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  createCart: () => Promise<string>;
  refreshCart: () => Promise<void>;
  addToCart: (
    sku: string,
    qty: number,
    options?: TMOCartItemProductOption
  ) => Promise<void>;
  updateCartItem: (itemId: number, qty: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  getCartTotals: () => Promise<TMOCartTotals>;
  clearCart: () => void;
  proceedToCheckout: (itemIds: number[]) => Promise<boolean>;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  cartItems: [],
  cartId: null,
  loading: false,
  itemsCount: 0,
  totals: null,
  isCartOpen: false,
  setIsCartOpen: () => {},
  createCart: async () => "",
  refreshCart: async () => {},
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  getCartTotals: async () => ({} as TMOCartTotals),
  clearCart: () => {},
  proceedToCheckout: async () => false,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useContext(UserContext);
  const [cart, setCart] = useState<TMOCart | null>(null);
  const [cartItems, setCartItems] = useState<MappedCartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<TMOCartTotals | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Map TMO cart items to display format
  const mapCartItems = useCallback((items: TMOCartItem[]): MappedCartItem[] => {
    return items.map((item) => tmoApi.mapTMOCartItemToMapped(item));
  }, []);

  // Create a new cart
  const createCart = useCallback(async (): Promise<string> => {
    const token = tmoApi.getTMOToken();
    if (!token) throw new Error("Not authenticated");

    setLoading(true);
    try {
      const newCartId = await tmoApi.createCart(token);
      setCartId(newCartId);
      // Store cart ID in localStorage for persistence
      localStorage.setItem("tmo_cart_id", newCartId);
      return newCartId;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh cart data from API
  const refreshCart = useCallback(async (): Promise<void> => {
    const token = tmoApi.getTMOToken();
    if (!token) return;

    setLoading(true);
    try {
      const cartData = await tmoApi.getCart(token);
      setCart(cartData);
      setCartId(cartData.id.toString());
      const mappedItems = mapCartItems(cartData.items || []);
      setCartItems(mappedItems);

      // Calculate totals from cart items instead of fetching from main cart
      // The partial-checkout cart doesn't have a separate totals endpoint
      // We'll calculate subtotal from items, other values will be 0 until checkout
      const calculatedSubtotal = mappedItems.reduce((sum, item) => sum + item.subtotal, 0);
      setTotals({
        grand_total: calculatedSubtotal,
        base_grand_total: calculatedSubtotal,
        subtotal: calculatedSubtotal,
        base_subtotal: calculatedSubtotal,
        discount_amount: 0,
        base_discount_amount: 0,
        subtotal_with_discount: calculatedSubtotal,
        base_subtotal_with_discount: calculatedSubtotal,
        shipping_amount: 0,
        base_shipping_amount: 0,
        shipping_discount_amount: 0,
        base_shipping_discount_amount: 0,
        tax_amount: 0,
        base_tax_amount: 0,
        weee_tax_applied_amount: null,
        shipping_tax_amount: 0,
        base_shipping_tax_amount: 0,
        subtotal_incl_tax: calculatedSubtotal,
        shipping_incl_tax: 0,
        base_shipping_incl_tax: 0,
        base_currency_code: 'USD',
        quote_currency_code: 'USD',
        items_qty: mappedItems.reduce((sum, item) => sum + item.qty, 0),
        items: [],
        total_segments: [],
      });
    } catch (error) {
      console.error("Error refreshing cart:", error);
      // If cart doesn't exist, clear local state
      setCart(null);
      setCartItems([]);
      setTotals(null);
    } finally {
      setLoading(false);
    }
  }, [mapCartItems]);

  // Add item to cart
  const addToCart = useCallback(
    async (
      sku: string,
      qty: number,
      productOption?: TMOCartItemProductOption
    ): Promise<void> => {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");

      setLoading(true);
      try {
        // Ensure we have a cart
        let currentCartId = cartId;
        if (!currentCartId) {
          currentCartId = await createCart();
        }

        const cartItem = await tmoApi.addToCart(
          {
            cartItem: {
              sku,
              qty,
              quote_id: currentCartId,
              product_option: productOption,
            },
          },
          token
        );

        // Refresh cart to get updated state
        await refreshCart();

        // Open cart sidebar to show the added item
        setIsCartOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [cartId, createCart, refreshCart]
  );

  // Update cart item quantity
  const updateCartItem = useCallback(
    async (itemId: number, qty: number): Promise<void> => {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");

      setLoading(true);
      try {
        await tmoApi.updateCartItem(
          itemId,
          {
            cartItem: {
              item_id: itemId,
              qty,
              quote_id: cartId || undefined,
            },
          },
          token
        );

        // Refresh cart to get updated state
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: number): Promise<void> => {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");

      setLoading(true);
      try {
        await tmoApi.deleteCartItem(itemId, token);
        // Refresh cart to get updated state
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [refreshCart]
  );

  // Get cart totals
  const getCartTotals = useCallback(async (): Promise<TMOCartTotals> => {
    const token = tmoApi.getTMOToken();
    if (!token) throw new Error("Not authenticated");

    const totalsData = await tmoApi.getTotals(token);
    setTotals(totalsData);
    return totalsData;
  }, []);

  // Clear local cart state
  const clearCart = useCallback((): void => {
    setCart(null);
    setCartItems([]);
    setCartId(null);
    setTotals(null);
    localStorage.removeItem("tmo_cart_id");
  }, []);

  // Proceed to checkout with selected items
  const proceedToCheckout = useCallback(
    async (itemIds: number[]): Promise<boolean> => {
      const token = tmoApi.getTMOToken();
      if (!token || !cartId) return false;

      setLoading(true);
      try {
        await tmoApi.checkoutAdd(cartId, itemIds, token);
        return true;
      } catch (error) {
        console.error("Error proceeding to checkout:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  // Load cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check for existing cart ID in localStorage
      const savedCartId = localStorage.getItem("tmo_cart_id");
      if (savedCartId) {
        setCartId(savedCartId);
      }
      refreshCart();
    } else {
      // Clear cart when user logs out
      clearCart();
    }
  }, [isAuthenticated, refreshCart, clearCart]);

  const itemsCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartId,
        loading,
        itemsCount,
        totals,
        isCartOpen,
        setIsCartOpen,
        createCart,
        refreshCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        getCartTotals,
        clearCart,
        proceedToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
