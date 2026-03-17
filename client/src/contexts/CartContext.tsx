import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import tmoApi from "@/lib/tmoApi";
import type {
  TMOCart,
  TMOCartItemProductOption,
  MappedCartItem,
  TMOCartTotals,
} from "@/types/tmo";

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
    options?: TMOCartItemProductOption,
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
  const [cart, setCart] = useState<TMOCart | null>(null);
  const [cartItems, setCartItems] = useState<MappedCartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState<TMOCartTotals | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isAuthenticated = !!tmoApi.getTMOToken();

  // Create a new cart
  const createCartFn = useCallback(async (): Promise<string> => {
    const token = tmoApi.getTMOToken();
    if (!token) throw new Error("Not authenticated");

    setLoading(true);
    try {
      const newCartId = await tmoApi.createCart(token);
      setCartId(newCartId);
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
      const mappedItems = (cartData.items || []).map((item) =>
        tmoApi.mapTMOCartItemToMapped(item),
      );
      setCartItems(mappedItems);

      // Calculate totals from items
      const calculatedSubtotal = mappedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0,
      );
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
        base_currency_code: "CNY",
        quote_currency_code: "CNY",
        items_qty: mappedItems.reduce((sum, item) => sum + item.qty, 0),
        items: [],
        total_segments: [],
      });
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setCart(null);
      setCartItems([]);
      setTotals(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCartFn = useCallback(
    async (
      sku: string,
      qty: number,
      productOption?: TMOCartItemProductOption,
    ): Promise<void> => {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");

      setLoading(true);
      try {
        let currentCartId = cartId;
        if (!currentCartId) {
          currentCartId = await createCartFn();
        }

        await tmoApi.addToCart(
          {
            cartItem: {
              sku,
              qty,
              quote_id: currentCartId,
              product_option: productOption,
            },
          },
          token,
        );

        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [cartId, createCartFn, refreshCart],
  );

  // Update cart item quantity
  const updateCartItemFn = useCallback(
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
          token,
        );
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [cartId, refreshCart],
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: number): Promise<void> => {
      const token = tmoApi.getTMOToken();
      if (!token) throw new Error("Not authenticated");

      setLoading(true);
      try {
        await tmoApi.deleteCartItem(itemId, token);
        await refreshCart();
      } finally {
        setLoading(false);
      }
    },
    [refreshCart],
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
    [cartId],
  );

  // Load cart on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const savedCartId = localStorage.getItem("tmo_cart_id");
      if (savedCartId) {
        setCartId(savedCartId);
      }
      refreshCart();
    } else {
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
        createCart: createCartFn,
        refreshCart,
        addToCart: addToCartFn,
        updateCartItem: updateCartItemFn,
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
