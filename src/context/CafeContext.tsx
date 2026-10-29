import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  CartItemOption,
  Order,
  OrderStatus,
  DiningType,
  Reservation,
  ReservationStatus,
  InventoryItem,
  CafeSettings,
} from '../types/cafe';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_INVENTORY,
  INITIAL_CAFE_SETTINGS,
} from '../data/initialData';

interface CafeContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  reservations: Reservation[];
  inventory: InventoryItem[];
  settings: CafeSettings;
  isOwnerModalOpen: boolean;
  setIsOwnerModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
  isGmailModalOpen: boolean;
  setIsGmailModalOpen: (open: boolean) => void;
  gmailModalConfig: {
    defaultCompose?: boolean;
    initialOrder?: Order | null;
    initialReservation?: Reservation | null;
  };
  openGmailWithOrder: (order: Order) => void;
  openGmailWithReservation: (reservation: Reservation) => void;
  openGmailCompose: () => void;
  activeTrackedOrder: Order | null;
  setActiveTrackedOrder: (order: Order | null) => void;
  newOrderNotification: string | null;
  clearNotification: () => void;

  // Cart operations
  addToCart: (item: MenuItem, options?: CartItemOption, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Customer transactions
  placeOrder: (details: {
    customerName: string;
    customerPhone: string;
    diningType: DiningType;
    tableOrAddress: string;
    notes?: string;
    paymentMethod: 'card' | 'cash' | 'apple-pay';
    tip: number;
  }) => Order;
  makeReservation: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    guests: number;
    area: Reservation['area'];
    specialRequest?: string;
  }) => Reservation;

  // Owner management actions
  acceptOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  updateMenuItemPrice: (itemId: string, newPrice: number) => void;
  toggleItemStock: (itemId: string) => void;
  saveMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (itemId: string) => void;
  adjustInventoryStock: (itemId: string, delta: number) => void;
  updateSettings: (newSettings: Partial<CafeSettings>) => void;
  resetToDefaults: () => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

const STORAGE_KEY = 'sannys_kitchen_state_v3';

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_menu`);
      return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [settings, setSettings] = useState<CafeSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_CAFE_SETTINGS;
    } catch {
      return INITIAL_CAFE_SETTINGS;
    }
  });

  // UI state
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailModalConfig, setGmailModalConfig] = useState<{
    defaultCompose?: boolean;
    initialOrder?: Order | null;
    initialReservation?: Reservation | null;
  }>({});
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<Order | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);

  const openGmailWithOrder = (order: Order) => {
    setGmailModalConfig({
      defaultCompose: true,
      initialOrder: order,
      initialReservation: null,
    });
    setIsGmailModalOpen(true);
  };

  const openGmailWithReservation = (reservation: Reservation) => {
    setGmailModalConfig({
      defaultCompose: true,
      initialOrder: null,
      initialReservation: reservation,
    });
    setIsGmailModalOpen(true);
  };

  const openGmailCompose = () => {
    setGmailModalConfig({
      defaultCompose: true,
      initialOrder: null,
      initialReservation: null,
    });
    setIsGmailModalOpen(true);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_menu`, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);

  // Derived cart info
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

  const clearNotification = () => setNewOrderNotification(null);

  // Cart operations
  const addToCart = (item: MenuItem, options: CartItemOption = {}, quantity = 1) => {
    // calculate unit price with options
    let finalUnitPrice = item.price;
    if (options.size && item.options?.size) {
      const sizeOpt = item.options.size.find((s) => s.name === options.size);
      if (sizeOpt) finalUnitPrice += sizeOpt.extraPrice;
    }
    if (options.extras && item.options?.extras) {
      options.extras.forEach((extraName) => {
        const extraOpt = item.options?.extras?.find((e) => e.name === extraName);
        if (extraOpt) finalUnitPrice += extraOpt.price;
      });
    }

    const cartItemId = `${item.id}-${options.size || 'std'}-${options.temperature || 'std'}-${options.milk || 'std'}-${(options.extras || []).sort().join(',')}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          menuItem: item,
          quantity,
          unitPrice: finalUnitPrice,
          options,
        },
      ];
    });

    setIsCartDrawerOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Customer Placing Order
  const placeOrder = (details: {
    customerName: string;
    customerPhone: string;
    diningType: DiningType;
    tableOrAddress: string;
    notes?: string;
    paymentMethod: 'card' | 'cash' | 'apple-pay';
    tip: number;
  }) => {
    const tax = Number((cartSubtotal * (settings.taxRatePercent / 100)).toFixed(2));
    const total = Number((cartSubtotal + tax + details.tip).toFixed(2));
    const orderNum = `#SK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: 'Just now',
      customerName: details.customerName,
      customerPhone: details.customerPhone,
      diningType: details.diningType,
      tableOrAddress: details.tableOrAddress,
      items: [...cart],
      subtotal: Number(cartSubtotal.toFixed(2)),
      tax,
      tip: details.tip,
      total,
      status: 'pending',
      estimatedMinutes: settings.estimatedWaitMinutes,
      notes: details.notes,
      paymentMethod: details.paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackedOrder(newOrder);
    setCart([]);
    setIsCartDrawerOpen(false);
    setIsOrderTrackerOpen(true);

    // Notify owner queue simulation
    setNewOrderNotification(`New incoming order ${orderNum} from ${details.customerName}`);

    return newOrder;
  };

  // Customer Table Booking
  const makeReservation = (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    date: string;
    timeSlot: string;
    guests: number;
    area: Reservation['area'];
    specialRequest?: string;
  }) => {
    const code = `SAN-${Math.floor(100 + Math.random() * 900)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: code,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      date: data.date,
      timeSlot: data.timeSlot,
      guests: data.guests,
      area: data.area,
      specialRequest: data.specialRequest,
      status: 'confirmed',
      createdAt: 'Just now',
    };

    setReservations((prev) => [newReservation, ...prev]);
    setNewOrderNotification(`New Table Reservation: ${code} for ${data.customerName} (${data.guests} guests)`);
    return newReservation;
  };

  // Owner Actions
  const acceptOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = { ...ord, status: 'preparing' };
          if (activeTrackedOrder?.id === orderId) setActiveTrackedOrder(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = { ...ord, status };
          if (activeTrackedOrder?.id === orderId) setActiveTrackedOrder(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
    );
  };

  const updateMenuItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: Number(newPrice.toFixed(2)) } : item))
    );
  };

  const toggleItemStock = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const saveMenuItem = (item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? item : i))
    );
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const adjustInventoryStock = (itemId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === itemId) {
          const nextStock = Math.max(0, Number((inv.currentStock + delta).toFixed(1)));
          return {
            ...inv,
            currentStock: nextStock,
            lastRestocked: delta > 0 ? 'Just now' : inv.lastRestocked,
          };
        }
        return inv;
      })
    );
  };

  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setReservations(INITIAL_RESERVATIONS);
    setInventory(INITIAL_INVENTORY);
    setSettings(INITIAL_CAFE_SETTINGS);
    setCart([]);
    localStorage.removeItem(`${STORAGE_KEY}_menu`);
    localStorage.removeItem(`${STORAGE_KEY}_orders`);
    localStorage.removeItem(`${STORAGE_KEY}_reservations`);
    localStorage.removeItem(`${STORAGE_KEY}_inventory`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_cart`);
  };

  return (
    <CafeContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        reservations,
        inventory,
        settings,
        isOwnerModalOpen,
        setIsOwnerModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        isReservationModalOpen,
        setIsReservationModalOpen,
        isGmailModalOpen,
        setIsGmailModalOpen,
        gmailModalConfig,
        openGmailWithOrder,
        openGmailWithReservation,
        openGmailCompose,
        activeTrackedOrder,
        setActiveTrackedOrder,
        newOrderNotification,
        clearNotification,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        placeOrder,
        makeReservation,
        acceptOrder,
        updateOrderStatus,
        updateReservationStatus,
        updateMenuItemPrice,
        toggleItemStock,
        saveMenuItem,
        addMenuItem,
        deleteMenuItem,
        adjustInventoryStock,
        updateSettings,
        resetToDefaults,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
