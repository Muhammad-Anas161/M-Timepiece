import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prevItems => {
      // Create a unique key for comparison (id + variantId)
      const variantId = variant ? variant.id : null;
      
      const existingItem = prevItems.find(item => 
        item.id === product.id && item.variantId === variantId
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && item.variantId === variantId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // Add new item with variant info
      return [...prevItems, { 
        ...product, 
        quantity, 
        variantId: variantId,
        selectedColor: variant ? variant.color : null,
        price: variant ? (product.price + variant.price_modifier) : product.price // Update price if modifier exists
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variantId = null) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === productId && item.variantId === variantId)
    ));
  };

  const updateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.id === productId && item.variantId === variantId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
