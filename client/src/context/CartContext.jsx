import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('hi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('hi_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      showNotification('This product is out of stock', 'error');
      return false;
    }

    const qty = Math.max(1, parseInt(quantity, 10));

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product === product._id || item.product === product.id
      );

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newQty = existingItem.quantity + qty;

        if (newQty > product.stock) {
          showNotification(
            `Cannot add more. Maximum available stock is ${product.stock}.`,
            'error'
          );
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        showNotification(`Updated quantity of "${product.name}" in cart!`);
        return updated;
      } else {
        if (qty > product.stock) {
          showNotification(
            `Only ${product.stock} units available in stock.`,
            'error'
          );
          return prevCart;
        }

        const newItem = {
          product: product._id || product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          viscosity: product.viscosity,
          volume: product.volume,
          price: product.price,
          stock: product.stock,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          quantity: qty,
        };

        showNotification(`Added "${product.name}" to cart!`);
        return [...prevCart, newItem];
      }
    });
    return true;
  };

  const addCustomOilToCart = (converter, litres, unit = 'L', originalQuantity = null) => {
    if (!converter || !converter.enabled) {
      showNotification('This oil converter is currently unavailable', 'error');
      return false;
    }

    const parsedLitres = parseFloat(litres);
    if (isNaN(parsedLitres) || parsedLitres <= 0) {
      showNotification('Please enter a valid quantity', 'error');
      return false;
    }

    if (converter.availableLitres < parsedLitres) {
      showNotification(
        `Insufficient bulk stock. Only ${converter.availableLitres} Litres available.`,
        'error'
      );
      return false;
    }

    const calculatedPrice = Math.round(parsedLitres * converter.pricePerLitre);
    const cartItemId = `custom-converter-${converter._id || converter.converterNumber}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product === cartItemId);
      const formattedVolume =
        unit === 'ml'
          ? `${originalQuantity || Math.round(parsedLitres * 1000)} ml (${parsedLitres} L)`
          : `${parsedLitres} Litres`;

      const newItem = {
        product: cartItemId,
        converterId: converter._id,
        converterNumber: converter.converterNumber,
        isCustomOil: true,
        name: converter.name,
        brand: converter.brand,
        viscosity: 'Bulk / Open Oil',
        volume: formattedVolume,
        unit: unit,
        litres: parsedLitres,
        price: converter.pricePerLitre,
        totalItemPrice: calculatedPrice,
        stock: converter.availableLitres,
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
        quantity: parsedLitres,
      };

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = newItem;
        showNotification(`Updated "${converter.name}" (${formattedVolume}) in cart!`);
        return updated;
      } else {
        showNotification(`Added "${converter.name}" (${formattedVolume}) to cart!`);
        return [...prevCart, newItem];
      }
    });

    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseFloat(newQuantity);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product === productId) {
          if (qty > item.stock) {
            showNotification(`Only ${item.stock} available in stock`, 'error');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const removed = prevCart.find((it) => it.product === productId);
      if (removed) {
        showNotification(`Removed "${removed.name}" from cart`);
      }
      return prevCart.filter((it) => it.product !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 8000;
  const standardDeliveryFee = 250;
  const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : standardDeliveryFee;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold,
        total,
        notification,
        addToCart,
        addCustomOilToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
