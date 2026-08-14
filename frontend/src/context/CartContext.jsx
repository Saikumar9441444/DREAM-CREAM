import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cream_dream_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Cart recovery failed:", e);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cream_dream_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart, or increment quantity if it already exists
  const addToCart = (product) => {
    const productId = product._id || product.id;
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id || item.id) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Ensure we don't carry over old quantities if the product object happens to have one
      const { quantity, ...productData } = product;
      return [...prevItems, { ...productData, quantity: 1 }];
    });
  };

  // Decrease quantity by 1, or remove completely if quantity reaches 0
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => (item._id || item.id) === productId);
      if (existingItem?.quantity === 1) {
        return prevItems.filter((item) => (item._id || item.id) !== productId);
      }
      return prevItems.map((item) =>
        (item._id || item.id) === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  // Remove completely regardless of quantity
  const clearItemFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartTotalPrice = useMemo(() => {
    const total = cartItems.reduce((acc, item) => {
      let numericPrice = 0;
      if (typeof item.price === 'string') {
        numericPrice = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
      } else if (typeof item.price === 'number') {
        numericPrice = item.price;
      }
      return acc + (numericPrice * (item.quantity || 1));
    }, 0);
    return isNaN(total) ? 0 : total;
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearItemFromCart,
    clearCart,
    cartTotalItems,
    cartTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
