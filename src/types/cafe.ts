export type FoodCategory =
  | 'all'
  | 'coffee'
  | 'brunch'
  | 'bakery'
  | 'mains'
  | 'refreshers';

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'brunch' | 'bakery' | 'mains' | 'refreshers';
  price: number;
  description: string;
  image: string;
  tags: string[];
  inStock: boolean;
  preparationMinutes: number;
  calories?: number;
  isChefSpecial?: boolean;
  options?: {
    milk?: string[];
    temperature?: ('Hot' | 'Iced')[];
    size?: { name: string; extraPrice: number }[];
    extras?: { name: string; price: number }[];
  };
}

export interface CartItemOption {
  size?: string;
  temperature?: 'Hot' | 'Iced';
  milk?: string;
  extras?: string[];
  specialNotes?: string;
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  options: CartItemOption;
}

export type DiningType = 'dine-in' | 'takeaway' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  diningType: DiningType;
  tableOrAddress: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  estimatedMinutes: number;
  notes?: string;
  paymentMethod: 'card' | 'cash' | 'apple-pay';
}

export type ReservationArea = 'Main Espresso Hall' | 'Garden Veranda' | 'Cozy Hearth Corner' | 'Barista Counter';
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  guests: number;
  area: ReservationArea;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'coffee-beans' | 'dairy-plant' | 'bakery-flour' | 'pantry-produce' | 'syrups-spices';
  currentStock: number;
  unit: string;
  reorderLevel: number;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
}

export interface CafeAnnouncement {
  active: boolean;
  message: string;
  highlightText: string;
  tag: string;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  announcement: CafeAnnouncement;
  isOpenForOrders: boolean;
  estimatedWaitMinutes: number;
  taxRatePercent: number;
  phone: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
  instagramHandle: string;
  ownerPin: string;
  ownerPassword?: string;
}
