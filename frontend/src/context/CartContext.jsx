import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const user = window.localStorage.getItem('user');
      // Si no hay usuario logueado, forzamos un carrito vacío y limpiamos datos residuales
      if (!user) {
        window.localStorage.removeItem('tecnostore_cart');
        return [];
      }
      
      const item = window.localStorage.getItem('tecnostore_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage for cart', error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('tecnostore_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === producto.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      // Agregar nuevo producto con cantidad 1
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = item.cantidad + amount;
        return { ...item, cantidad: newQty > 0 ? newQty : 1 }; // Minimo 1
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calcular el total de productos en el carrito
  const cartItemCount = cart.reduce((total, item) => total + item.cantidad, 0);

  // Calcular el precio subtotal total
  const cartTotal = cart.reduce((total, item) => total + (Number(item.precio) * item.cantidad), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartItemCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
