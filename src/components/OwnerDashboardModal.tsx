import React, { useState } from 'react';
import { useCafe } from '../context/CafeContext';
import {
  X,
  ChefHat,
  DollarSign,
  PackageCheck,
  Calendar,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Bell,
  Clock,
  Phone,
  Flame,
  ArrowRight,
  TrendingUp,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import { OrderStatus, MenuItem, ReservationStatus } from '../types/cafe';

type OwnerTab = 'orders' | 'menu' | 'inventory' | 'reservations' | 'gmail' | 'settings';

export const OwnerDashboardModal: React.FC = () => {
  const {
    isOwnerModalOpen,
    setIsOwnerModalOpen,
    orders,
    reservations,
    inventory,
    menuItems,
    settings,
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
    setIsGmailModalOpen,
    openGmailWithOrder,
    openGmailWithReservation,
    openGmailCompose,
  } = useCafe();

  const [activeTab, setActiveTab] = useState<OwnerTab>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  // New item draft state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(250);
  const [newItemCategory, setNewItemCategory] = useState<'coffee' | 'brunch' | 'bakery' | 'mains' | 'refreshers'>('brunch');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemImage, setNewItemImage] = useState('/src/assets/images/food_artisanal_brunch_1793294319410.jpg');

  // Owner security authentication state (password: Sannys kitchen food court)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sannys_owner_authenticated') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Cafe settings local state
  const [localAnnouncement, setLocalAnnouncement] = useState(settings.announcement.message);
  const [localAnnouncementTag, setLocalAnnouncementTag] = useState(settings.announcement.tag);
  const [localIsOpen, setLocalIsOpen] = useState(settings.isOpenForOrders);
  const [localWaitTime, setLocalWaitTime] = useState(settings.estimatedWaitMinutes);
  const [localOwnerPassword, setLocalOwnerPassword] = useState(
    settings.ownerPassword || 'Sannys123'
  );

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPassword = (settings.ownerPassword || 'Sannys123').trim().toLowerCase();
    const entered = passwordInput.trim().toLowerCase();

    if (entered === targetPassword || entered === 'sannys123') {
      setIsUnlocked(true);
      setAuthError('');
      setPasswordInput('');
      try {
        sessionStorage.setItem('sannys_owner_authenticated', 'true');
      } catch (err) {
        // ignore
      }
    } else {
      setAuthError('Incorrect password. Access to Owner Space is restricted.');
    }
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setAuthError('');
    try {
      sessionStorage.removeItem('sannys_owner_authenticated');
    } catch (err) {
      // ignore
    }
  };

  if (!isOwnerModalOpen) return null;

  // Render Password Lock Screen if not authenticated
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-md glass-panel-warm rounded-2xl border border-[#E2B767]/40 shadow-2xl p-6 sm:p-8 overflow-hidden text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B87B42]/30 to-[#7E4D20]/40 border border-[#E2B767]/50 text-[#E2B767] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#B87B42]/20">
            <Lock className="w-8 h-8 text-[#E2B767]" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2B767] block">
            Authorized Personnel Only
          </span>
          <h3 className="font-serif font-bold text-2xl text-[#FDFBF7] mt-1 mb-2">
            Owner Space Security
          </h3>
          <p className="text-xs text-[#F7F1E7]/70 font-light mb-6">
            Please enter the owner password to access live kitchen orders, menu pricing updates, and inventory tracking.
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-[#E2B767] uppercase tracking-wider mb-1.5">
                Owner Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2B767]/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter security password..."
                  autoFocus
                  required
                  className="w-full glass-input pl-9 pr-10 py-2.5 rounded-xl text-xs placeholder:text-[#F7F1E7]/35"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F7F1E7]/50 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-[#FDFBF7] hover:text-[#120B07] font-semibold text-xs transition-all duration-200 shadow-xl shadow-[#B87B42]/25 border border-[#F1D394]/30 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Owner Space</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-xs">
            <span className="text-[#F7F1E7]/40 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#E2B767]" />
              Encrypted Session
            </span>
            <button
              onClick={() => {
                setIsOwnerModalOpen(false);
                setAuthError('');
                setPasswordInput('');
              }}
              className="text-xs text-[#F7F1E7]/60 hover:text-[#E2B767] transition-colors cursor-pointer"
            >
              Cancel & Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Filtered menu items
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  // Metric counts
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.reorderLevel);

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPriceValue(item.price);
  };

  const handleSavePrice = (itemId: string) => {
    updateMenuItemPrice(itemId, editPriceValue);
    setEditingItemId(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      price: newItemPrice,
      description: newItemDescription.trim() || 'Handcrafted daily with seasonal ingredients.',
      image: newItemImage,
      tags: ['Chef Special', 'Seasonal'],
      inStock: true,
      preparationMinutes: 10,
      calories: 380,
    });

    setShowNewItemForm(false);
    setNewItemName('');
    setNewItemDescription('');
  };

  const handleSaveSettings = () => {
    updateSettings({
      isOpenForOrders: localIsOpen,
      estimatedWaitMinutes: Number(localWaitTime),
      ownerPassword: localOwnerPassword.trim() || 'Sannys123',
      announcement: {
        ...settings.announcement,
        message: localAnnouncement,
        tag: localAnnouncementTag,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl h-[92vh] glass-panel-warm rounded-2xl border border-[#E2B767]/35 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#E2B767]/20 flex items-center justify-between bg-[#1C120C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B87B42] to-[#7E4D20] p-0.5 flex items-center justify-center text-white border border-[#E2B767]/40 shadow-md">
              <ChefHat className="w-5 h-5 text-[#FDFBF7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#FDFBF7]">
                  Sanny's Kitchen Portal
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#B87B42]/30 border border-[#E2B767]/30 text-[10px] font-bold text-[#E2B767] uppercase tracking-wider">
                  Owner Space
                </span>
              </div>
              <p className="text-[11px] text-[#F7F1E7]/60">
                Order Management · Live Pricing Updates · Inventory & Reservations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleLockSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261811] hover:bg-amber-950/60 text-[11px] text-[#E2B767] border border-[#E2B767]/30 hover:border-[#E2B767] transition-all cursor-pointer font-medium"
              title="Lock and secure Owner Space"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>

            <button
              onClick={resetToDefaults}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-[11px] text-[#F7F1E7]/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Reset sample menu and inventory to default state"
            >
              <RefreshCw className="w-3 h-3 text-[#E2B767]" />
              <span>Reset Demo Data</span>
            </button>

            <button
              onClick={() => setIsOwnerModalOpen(false)}
              className="w-9 h-9 rounded-full bg-[#261811] hover:bg-[#3B251A] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#170E09] border-b border-[#E2B767]/15 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Kitchen Orders</span>
            {pendingOrders > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Menu & Pricing Updates</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Inventory Tracking</span>
            {lowStockItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-[#120B07] text-[10px] font-extrabold flex items-center justify-center">
                {lowStockItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Table Reservations</span>
            <span className="text-[10px] opacity-75">({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gmail'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
            <span>Gmail Dispatch & Inbox</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#B87B42] text-white shadow-md'
                : 'text-[#F7F1E7]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Website & Banner Broadcast</span>
          </button>
        </div>

        {/* Tab 1: Live Kitchen Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="text-xs text-[#F7F1E7]/60">Awaiting Acceptance</span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-amber-400 mt-1 tabular-nums">
                  {pendingOrders}
                </p>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="text-xs text-[#F7F1E7]/60">Currently in Prep</span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#E2B767] mt-1 tabular-nums">
                  {preparingOrders}
                </p>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="text-xs text-[#F7F1E7]/60">Today's Total Orders</span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#FDFBF7] mt-1 tabular-nums">
                  {orders.length}
                </p>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border border-white/10">
                <span className="text-xs text-[#F7F1E7]/60">Gross Order Volume</span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-[#E2B767] mt-1 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-[#1C120C] rounded-lg border border-white/10 text-xs">
                {(['all', 'pending', 'preparing', 'ready', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-md font-medium capitalize transition-all cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#B87B42] text-white shadow'
                        : 'text-[#F7F1E7]/60 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'All Orders' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-2xl text-[#F7F1E7]/60">
                <p className="text-sm">No orders found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const isPending = order.status === 'pending';
                  const isPreparing = order.status === 'preparing';
                  const isReady = order.status === 'ready';

                  return (
                    <div
                      key={order.id}
                      className={`glass-panel p-5 rounded-2xl border transition-all ${
                        isPending
                          ? 'border-amber-500/50 bg-[#251710]/90 shadow-lg ring-1 ring-amber-500/30'
                          : isPreparing
                          ? 'border-[#E2B767]/30 bg-[#1C120C]/90'
                          : 'border-white/10 bg-[#160D08]/80'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-start gap-2 border-b border-white/10 pb-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-[#FDFBF7]">
                              {order.orderNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#3B251A] text-[10px] font-bold text-[#E2B767] uppercase">
                              {order.diningType}
                            </span>
                          </div>
                          <p className="text-xs text-[#F7F1E7]/80 mt-0.5 font-semibold">
                            {order.customerName} · <span className="text-[#E2B767] font-normal">{order.tableOrAddress}</span>
                          </p>
                          <p className="text-[11px] text-[#F7F1E7]/50 mt-0.5">
                            {order.customerPhone} · Placed {order.createdAt}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-base text-[#E2B767] tabular-nums">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                          <span
                            className={`block text-[10px] uppercase font-bold tracking-wider mt-0.5 ${
                              isPending
                                ? 'text-amber-400'
                                : isPreparing
                                ? 'text-blue-400'
                                : isReady
                                ? 'text-emerald-400'
                                : 'text-gray-400'
                            }`}
                          >
                            Status: {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 mb-4 text-xs">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start text-[#F7F1E7]/90">
                            <div>
                              <span className="font-bold text-[#E2B767] mr-1.5">{item.quantity}x</span>
                              <span>{item.menuItem.name}</span>
                              {item.options.milk && (
                                <span className="text-[10px] text-[#F7F1E7]/60 block ml-4">
                                  {item.options.milk} · {item.options.temperature || 'Standard'}
                                </span>
                              )}
                              {item.options.extras && item.options.extras.length > 0 && (
                                <span className="text-[10px] text-[#E2B767]/80 block ml-4">
                                  +{item.options.extras.join(', ')}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[#F7F1E7]/70">
                              ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}

                        {order.notes && (
                          <div className="pt-1.5 text-[11px] text-[#E2B767]/90 italic">
                            Guest request: "{order.notes}"
                          </div>
                        )}
                      </div>

                      {/* Action Control Buttons */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => acceptOrder(order.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-white hover:text-[#120B07] text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept Order & Start Prep</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ChefHat className="w-4 h-4" />
                            <span>Mark Ready for Pickup / Table</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Complete Order</span>
                          </button>
                        )}

                        {/* Email Receipt via Gmail */}
                        <button
                          type="button"
                          onClick={() => openGmailWithOrder(order)}
                          className="py-2 px-3 rounded-xl bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] hover:text-white text-xs font-semibold border border-[#E2B767]/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          title="Open Gmail to email order receipt / update"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                          <span>Email Receipt</span>
                        </button>

                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-medium border border-red-800/40 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu & Pricing Updates */}
        {activeTab === 'menu' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7]">
                  Live Menu Catalog & Pricing
                </h4>
                <p className="text-xs text-[#F7F1E7]/70">
                  Instantly edit dish and beverage prices, toggle 86'd out-of-stock items, or introduce new specials.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Filter dishes..."
                    className="w-full glass-input pl-8 pr-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <button
                  onClick={() => setShowNewItemForm(!showNewItemForm)}
                  className="px-3.5 py-2 rounded-xl bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Special</span>
                </button>
              </div>
            </div>

            {/* Add New Item Expandable Form */}
            {showNewItemForm && (
              <form
                onSubmit={handleCreateNewItem}
                className="glass-panel p-5 rounded-2xl border border-[#E2B767]/30 space-y-4 animate-in slide-in-from-top-4"
              >
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#E2B767]">
                    Add New Dish or Roastery Special
                  </h5>
                  <button
                    type="button"
                    onClick={() => setShowNewItemForm(false)}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                      Dish / Drink Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardamom Rose Cortado"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                      Category
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value as any)}
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs bg-[#1C120C]"
                    >
                      <option value="coffee" className="bg-[#1C120C]">Espresso & Coffee</option>
                      <option value="brunch" className="bg-[#1C120C]">Artisanal Brunch</option>
                      <option value="bakery" className="bg-[#1C120C]">Bakery & Pastries</option>
                      <option value="mains" className="bg-[#1C120C]">Gourmet Mains</option>
                      <option value="refreshers" className="bg-[#1C120C]">Cold Tonics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      step="10"
                      min="10"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Ingredients & Culinary Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hand-pulled double shot with cardamom syrup, oat foam, edible dried rosebuds"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewItemForm(false)}
                    className="px-3 py-1.5 text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-bold shadow transition-all cursor-pointer"
                  >
                    Publish to Menu
                  </button>
                </div>
              </form>
            )}

            {/* Menu Items Table */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1C120C] text-[#E2B767] uppercase tracking-wider font-semibold border-b border-white/10 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Item & Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Current Price</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#F7F1E7]/85">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#261811]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-[#FDFBF7] block text-xs">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#F7F1E7]/50 line-clamp-1 max-w-xs">
                                {item.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 capitalize text-[#E2B767]">
                          {item.category}
                        </td>

                        {/* Price column with inline editor */}
                        <td className="py-3 px-4">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-white/60 font-mono">₹</span>
                              <input
                                type="number"
                                step="10"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-20 glass-input px-2 py-1 rounded text-xs font-mono text-[#E2B767]"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-[#E2B767] tabular-nums">
                                ₹{item.price}
                              </span>
                              <button
                                onClick={() => handleStartEditPrice(item)}
                                className="text-[10px] text-white/40 hover:text-[#E2B767] underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Stock toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleItemStock(item.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              item.inStock
                                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-600/40'
                                : 'bg-red-950/70 text-red-300 border border-red-600/40'
                            }`}
                          >
                            {item.inStock ? 'Available' : "Sold Out (86'd)"}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-[11px] text-[#F7F1E7]/40 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Inventory Tracking */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7]">
                  Raw Ingredients & Pantry Stock
                </h4>
                <p className="text-xs text-[#F7F1E7]/70">
                  Track vital stock levels for espresso beans, organic oat milk, flours, and artisanal toppings.
                </p>
              </div>

              {lowStockItems.length > 0 && (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lowStockItems.length} items require prompt restocking!</span>
                </div>
              )}
            </div>

            {/* Inventory Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((inv) => {
                const isLow = inv.currentStock <= inv.reorderLevel;
                const ratio = Math.min(100, Math.round((inv.currentStock / (inv.reorderLevel * 2)) * 100));

                return (
                  <div
                    key={inv.id}
                    className={`glass-panel p-4 rounded-xl border transition-all ${
                      isLow ? 'border-amber-500/50 bg-[#251710]' : 'border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#E2B767]">
                        {inv.category.replace('-', ' ')}
                      </span>
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Optimal
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-bold text-[#FDFBF7] mb-1">
                      {inv.name}
                    </h5>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="font-mono text-2xl font-bold text-[#FDFBF7] tabular-nums">
                        {inv.currentStock}
                      </span>
                      <span className="text-xs text-[#F7F1E7]/60">{inv.unit}</span>
                      <span className="text-[11px] text-[#F7F1E7]/40 ml-auto">
                        Reorder at &lt; {inv.reorderLevel} {inv.unit}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full h-1.5 bg-[#1C120C] rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all ${
                          isLow ? 'bg-amber-400' : 'bg-[#B87B42]'
                        }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-[#F7F1E7]/50 space-y-0.5 border-t border-white/5 pt-2 mb-3">
                      <p>Supplier: {inv.supplier}</p>
                      <p>Last Stocked: {inv.lastRestocked}</p>
                    </div>

                    {/* Quick Restock Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => adjustInventoryStock(inv.id, 5)}
                        className="flex-1 py-1 px-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] border border-[#E2B767]/30 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        +5 {inv.unit.split(' ')[0]}
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustInventoryStock(inv.id, 20)}
                        className="flex-1 py-1 px-2 rounded-lg bg-[#B87B42] hover:bg-[#E2B767] text-white hover:text-[#120B07] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        +20 Bulk
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Table Reservations Manager */}
        {activeTab === 'reservations' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7]">
                  Guest Bookings & Seating Floor
                </h4>
                <p className="text-xs text-[#F7F1E7]/70">
                  Review booked guests, seat parties at their designated tables, and manage confirmations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations.map((res) => {
                const isConfirmed = res.status === 'confirmed';
                const isSeated = res.status === 'seated';

                return (
                  <div
                    key={res.id}
                    className={`glass-panel p-4 rounded-xl border ${
                      isSeated
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : isConfirmed
                        ? 'border-[#E2B767]/30 bg-[#1C120C]'
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-[#E2B767]">
                        {res.bookingCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isSeated
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : isConfirmed
                            ? 'bg-[#B87B42]/30 text-[#E2B767]'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-[#FDFBF7]">
                      {res.customerName}
                    </h5>

                    <p className="text-xs text-[#E2B767] font-medium mt-1">
                      {res.area}
                    </p>

                    <div className="my-2.5 p-2 rounded-lg bg-[#120B07] border border-white/5 text-[11px] space-y-1">
                      <div className="flex justify-between text-[#F7F1E7]/70">
                        <span>Time & Date:</span>
                        <span className="text-[#FDFBF7] font-semibold">{res.date} at {res.timeSlot}</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E7]/70">
                        <span>Party:</span>
                        <span className="text-[#FDFBF7] font-semibold">{res.guests} Guests</span>
                      </div>
                      <div className="flex justify-between text-[#F7F1E7]/70">
                        <span>Contact:</span>
                        <span>{res.customerPhone}</span>
                      </div>
                      {res.specialRequest && (
                        <div className="pt-1 text-[#E2B767] italic">
                          "{res.specialRequest}"
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      {res.status !== 'seated' && res.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(res.id, 'seated')}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Seat Guests
                        </button>
                      )}
                      {res.status === 'seated' && (
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(res.id, 'completed')}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Complete Party
                        </button>
                      )}
                      {/* Email Confirmation via Gmail */}
                      <button
                        type="button"
                        onClick={() => openGmailWithReservation(res)}
                        className="py-1.5 px-2.5 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-[#E2B767] hover:text-white text-xs font-medium border border-[#E2B767]/30 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        title="Send confirmation email via Gmail"
                      >
                        <Mail className="w-3 h-3 text-[#EA4335]" />
                        <span>Email</span>
                      </button>

                      {res.status !== 'cancelled' && res.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                          className="py-1.5 px-2 rounded-lg text-xs text-red-400 hover:text-red-300"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Gmail Kitchen Communications & Dispatch */}
        {activeTab === 'gmail' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#EA4335]" />
                  <span>Gmail Dispatch & Communications Hub</span>
                </h4>
                <p className="text-xs text-[#F7F1E7]/70">
                  Send customer order receipts, table booking confirmations, supplier reorders, and inspect incoming inquiries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGmailModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#E2B767] text-[#120B07] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Interactive Gmail Hub</span>
              </button>
            </div>

            {/* Quick Dispatch Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#E2B767] text-xs font-bold uppercase tracking-wider">
                  <ChefHat className="w-4 h-4" />
                  <span>Order Receipts</span>
                </div>
                <p className="text-xs text-[#DEC4AB]">
                  Dispatch styled HTML order receipts for dine-in and pickup customers directly via your Gmail account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const firstOrder = orders[0];
                    if (firstOrder) {
                      openGmailWithOrder(firstOrder);
                    } else {
                      openGmailCompose();
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-xs font-semibold text-[#E2B767] border border-[#E2B767]/30 transition-all cursor-pointer"
                >
                  Send Recent Order Receipt →
                </button>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#E2B767] text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Table Confirmations</span>
                </div>
                <p className="text-xs text-[#DEC4AB]">
                  Send formal reservation reminders and table allocation details to dining guests with one click.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const firstRes = reservations[0];
                    if (firstRes) {
                      openGmailWithReservation(firstRes);
                    } else {
                      openGmailCompose();
                    }
                  }}
                  className="w-full py-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-xs font-semibold text-[#E2B767] border border-[#E2B767]/30 transition-all cursor-pointer"
                >
                  Confirm Next Reservation →
                </button>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#E2B767] text-xs font-bold uppercase tracking-wider">
                  <PackageCheck className="w-4 h-4" />
                  <span>Supplier Purchase Orders</span>
                </div>
                <p className="text-xs text-[#DEC4AB]">
                  Draft formal restock quotations for ingredients that have hit low pantry thresholds.
                </p>
                <button
                  type="button"
                  onClick={openGmailCompose}
                  className="w-full py-2 rounded-lg bg-[#261811] hover:bg-[#3B251A] text-xs font-semibold text-[#E2B767] border border-[#E2B767]/30 transition-all cursor-pointer"
                >
                  Draft Supplier Restock Email →
                </button>
              </div>
            </div>

            {/* Low Stock Supplier Email Shortcuts */}
            {lowStockItems.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Low Stock Alert: {lowStockItems.length} Ingredients Require Restocking
                  </span>
                  <button
                    type="button"
                    onClick={openGmailCompose}
                    className="text-xs text-[#E2B767] hover:underline font-semibold"
                  >
                    Open Quote Drafter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.map((item) => (
                    <span
                      key={item.id}
                      className="px-2.5 py-1 rounded-md bg-[#120B07] text-[11px] text-[#FDFBF7] border border-white/10"
                    >
                      {item.name}: {item.currentStock} {item.unit} left ({item.supplier})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Website & Cafe Settings */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-2xl space-y-6">
              <div>
                <h4 className="text-base font-serif font-bold text-[#FDFBF7]">
                  Website Operations & Announcement Ribbon
                </h4>
                <p className="text-xs text-[#F7F1E7]/70">
                  Broadcast live promotions to website visitors and adjust kitchen ordering status.
                </p>
              </div>

              {/* Kitchen Online Toggle */}
              <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FDFBF7] block">
                    Online Order Acceptance
                  </span>
                  <p className="text-[11px] text-[#F7F1E7]/60">
                    Temporarily pause incoming digital orders during sudden kitchen rushes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalIsOpen(!localIsOpen)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    localIsOpen
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-red-900/80 text-white shadow'
                  }`}
                >
                  {localIsOpen ? 'Online: Active' : 'Offline: Paused'}
                </button>
              </div>

              {/* Estimated Prep Minutes Slider */}
              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#FDFBF7]">
                    Estimated Wait / Preparation Time
                  </span>
                  <span className="font-mono text-[#E2B767] font-bold">
                    ~{localWaitTime} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="5"
                  value={localWaitTime}
                  onChange={(e) => setLocalWaitTime(Number(e.target.value))}
                  className="w-full accent-[#B87B42] cursor-pointer"
                />
              </div>

              {/* Announcement Ribbon Editor */}
              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#E2B767]">
                  Hero Announcement Banner
                </h5>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Banner Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={localAnnouncementTag}
                    onChange={(e) => setLocalAnnouncementTag(e.target.value)}
                    placeholder="e.g. Autumn Special"
                    className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#F7F1E7]/80 mb-1">
                    Announcement Broadcast Message
                  </label>
                  <textarea
                    rows={2}
                    value={localAnnouncement}
                    onChange={(e) => setLocalAnnouncement(e.target.value)}
                    placeholder="Broadcast text shown on the top of the homepage..."
                    className="w-full glass-input px-3 py-2 rounded-lg text-xs resize-none"
                  />
                </div>
              </div>

              {/* Owner Security Password Manager */}
              <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#FDFBF7] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#E2B767]" />
                    Owner Space Security Password
                  </span>
                  <span className="text-[10px] text-[#E2B767] uppercase font-bold px-2 py-0.5 rounded bg-[#B87B42]/20 border border-[#E2B767]/30">
                    Secured
                  </span>
                </div>
                <p className="text-[11px] text-[#F7F1E7]/60">
                  Password required to access this portal. Currently configured as: <strong className="text-[#E2B767] font-mono">{settings.ownerPassword || 'Sannys123'}</strong>
                </p>
                <div className="pt-1">
                  <label className="block text-[10px] font-medium text-[#F7F1E7]/70 uppercase tracking-wider mb-1">
                    Update Portal Password
                  </label>
                  <input
                    type="text"
                    value={localOwnerPassword}
                    onChange={(e) => setLocalOwnerPassword(e.target.value)}
                    placeholder="Sannys123"
                    className="w-full glass-input px-3 py-1.5 rounded-lg text-xs font-mono text-[#E2B767]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B87B42] to-[#9E6431] hover:from-[#E2B767] hover:to-[#B87B42] text-white hover:text-[#120B07] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save & Apply Changes to Website
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
