import { create } from 'zustand';
import {
  User,
  MotherChef,
  CartItem,
  Order,
  Review,
  Toast,
  MenuItem,
  OrderStatus,
} from '../types';
import { MOCK_MOTHERS, MOCK_REVIEWS, INITIAL_ORDERS } from '../data/mockData';

interface AppState {
  // Auth & Profile
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: 'customer' | 'chef') => void;
  loginAsChef: (motherId?: string, email?: string) => void;
  signup: (userData: Partial<User>) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;

  // Mothers & Menus
  mothers: MotherChef[];
  selectedMotherForMenu: MotherChef | null;
  selectedMotherForBooking: MotherChef | null;
  toggleMotherStatus: (motherId: string) => void;
  addMenuItem: (motherId: string, item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (motherId: string, item: MenuItem) => void;
  deleteMenuItem: (motherId: string, itemId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingSteps'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  reorder: (orderId: string) => void;
  selectedOrderForTracking: Order | null;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  deleteReview: (reviewId: string) => void;
  updateReview: (reviewId: string, updated: Partial<Review>) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Modals state
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  isMenuModalOpen: boolean;
  openMenuModal: (mother: MotherChef) => void;
  closeMenuModal: () => void;

  isBookingModalOpen: boolean;
  bookingInitialPlan: 'single' | 'weekly';
  openBookingModal: (mother: MotherChef, initialPlan?: 'single' | 'weekly') => void;
  closeBookingModal: () => void;

  togglePauseSubscriptionDate: (orderId: string, dateStr: string) => void;

  isTrackingModalOpen: boolean;
  openTrackingModal: (order: Order) => void;
  closeTrackingModal: () => void;

  isChefReviewsModalOpen: boolean;
  selectedMotherForReviews: MotherChef | null;
  openChefReviewsModal: (mother: MotherChef) => void;
  closeChefReviewsModal: () => void;

  isWriteReviewModalOpen: boolean;
  reviewTargetOrder: Order | null;
  reviewTargetMother: MotherChef | null;
  openWriteReviewModal: (target?: { order?: Order | null; mother?: MotherChef | null }) => void;
  closeWriteReviewModal: () => void;

  // Filters & Search
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating';
  setSortBy: (sort: 'recommended' | 'price-low' | 'price-high' | 'rating') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Default logged in user for instant smooth demo, or user can toggle/logout
  user: {
    id: 'user-demo-1',
    name: 'Karan Mehta',
    email: 'karan.m@gmail.com',
    role: 'customer',
    profession: 'Student',
    phone: '+91 98765 43210',
    address: 'Room 204, MSU Hostel No. 4, Fatehgunj',
    area: 'Fatehgunj',
    verifiedAccount: true,
    dietaryPreference: 'Pure Veg',
    joinedDate: 'August 2026',
    authMethod: 'password',
  },
  isAuthenticated: true,

  login: (emailOrPhone, role = 'customer') => {
    if (role === 'chef') {
      const chefUser: User = {
        id: 'mother-1',
        name: 'Lina Patel (Mother Chef)',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'lina.patel@mummystiffin.com',
        role: 'chef',
        profession: 'Other',
        phone: '+91 98250 11223',
        address: 'B-12, Green Park Society, Fatehgunj',
        area: 'Fatehgunj',
        verifiedChef: true,
        verifiedAccount: true,
        dietaryPreference: 'Pure Veg',
        joinedDate: 'January 2026',
        authMethod: 'chef',
      };
      set({ user: chefUser, isAuthenticated: true });
      get().addToast('🔒 Verified login: Welcome back, Lina Patel! Kitchen portal active.', 'success');
    } else {
      const isEmail = emailOrPhone.includes('@');
      const displayName = isEmail ? emailOrPhone.split('@')[0] : 'Karan Mehta';
      const custUser: User = {
        id: `user-${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: isEmail ? emailOrPhone : `${emailOrPhone.replace(/\D/g, '')}@user.mummystiffin.in`,
        role: 'customer',
        profession: 'Student',
        phone: isEmail ? '+91 98765 43210' : emailOrPhone,
        address: 'Hostel No 4, MSU Fatehgunj, Vadodara',
        area: 'Fatehgunj',
        verifiedAccount: true,
        dietaryPreference: 'Pure Veg',
        joinedDate: 'August 2026',
        authMethod: isEmail ? 'password' : 'otp',
      };
      set({ user: custUser, isAuthenticated: true });
      get().addToast(`🔒 Verified login: Welcome back, ${custUser.name}!`, 'success');
    }
    get().closeAuthModal();
  },

  loginAsChef: (motherId = 'mother-1', email = 'chef@mummystiffin.com') => {
    const mother = get().mothers.find((m) => m.id === motherId) || get().mothers[0];
    const chefUser: User = {
      id: mother.id,
      name: `${mother.name} (Mother Chef)`,
      email: email || `${mother.id}@mummystiffin.com`,
      role: 'chef',
      profession: 'Other',
      phone: mother.phone || '+91 98250 11223',
      address: `${mother.area}, Vadodara`,
      area: mother.area,
      verifiedChef: true,
      verifiedAccount: true,
      dietaryPreference: 'Pure Veg',
      joinedDate: 'January 2026',
      authMethod: 'chef',
    };
    set({ user: chefUser, isAuthenticated: true });
    get().addToast(`🔒 Verified Kitchen Portal: Welcome back, ${mother.name}!`, 'success');
    get().closeAuthModal();
  },

  signup: (userData) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'Vadodara Resident',
      email: userData.email || 'user@mummystiffin.in',
      role: userData.role || 'customer',
      profession: userData.profession || 'Student',
      phone: userData.phone || '+91 98765 43210',
      address: userData.address || 'Fatehgunj, Vadodara',
      area: userData.area || 'Fatehgunj',
      verifiedAccount: true,
      dietaryPreference: userData.dietaryPreference || 'Pure Veg',
      joinedDate: 'August 2026',
      authMethod: userData.authMethod || 'password',
    };
    set({ user: newUser, isAuthenticated: true });
    get().addToast(`🎉 Account Created & Verified! Welcome to Mummy's Tiffin, ${newUser.name}.`, 'success');
    get().closeAuthModal();
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
    get().addToast('Profile updated successfully!', 'success');
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    get().addToast('Logged out successfully', 'info');
  },

  // Mothers
  mothers: MOCK_MOTHERS,
  selectedMotherForMenu: null,
  selectedMotherForBooking: null,

  toggleMotherStatus: (motherId) => {
    set((state) => ({
      mothers: state.mothers.map((m) =>
        m.id === motherId ? { ...m, isOpen: !m.isOpen } : m
      ),
    }));
    const updated = get().mothers.find((m) => m.id === motherId);
    get().addToast(
      `Kitchen status updated to: ${updated?.isOpen ? 'Online (Accepting Orders)' : 'Offline'}`,
      'info'
    );
  },

  addMenuItem: (motherId, itemData) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `mi-${Date.now()}`,
    };
    set((state) => ({
      mothers: state.mothers.map((m) =>
        m.id === motherId
          ? { ...m, menuItems: [...m.menuItems, newItem] }
          : m
      ),
    }));
    get().addToast(`Added "${newItem.name}" to menu!`, 'success');
  },

  updateMenuItem: (motherId, updatedItem) => {
    set((state) => ({
      mothers: state.mothers.map((m) =>
        m.id === motherId
          ? {
              ...m,
              menuItems: m.menuItems.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
              ),
            }
          : m
      ),
    }));
    get().addToast(`Updated "${updatedItem.name}"`, 'success');
  },

  deleteMenuItem: (motherId, itemId) => {
    set((state) => ({
      mothers: state.mothers.map((m) =>
        m.id === motherId
          ? {
              ...m,
              menuItems: m.menuItems.filter((item) => item.id !== itemId),
            }
          : m
      ),
    }));
    get().addToast('Menu item removed', 'info');
  },

  // Cart
  cart: [],

  addToCart: (itemData) => {
    const currentCart = get().cart;
    // Check if cart already has items from another mother chef
    if (currentCart.length > 0 && currentCart[0].motherId !== itemData.motherId) {
      const confirmChange = window.confirm(
        `Your cart contains tiffins from ${currentCart[0].motherName}. Would you like to clear your cart and add tiffins from ${itemData.motherName}?`
      );
      if (!confirmChange) return;
      set({ cart: [] });
    }

    const newItem: CartItem = {
      ...itemData,
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };

    set((state) => ({ cart: [...state.cart, newItem] }));
    get().addToast(`Added "${newItem.itemName}" to your Tiffin Basket!`, 'success');
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
    get().addToast('Item removed from cart', 'info');
  },

  updateCartQuantity: (id, delta) => {
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    }));
  },

  clearCart: () => set({ cart: [] }),

  // Orders
  orders: INITIAL_ORDERS,
  selectedOrderForTracking: null,

  addOrder: (orderData) => {
    const isSub = orderData.isSubscription || orderData.items.some((i) => i.planType === 'weekly');
    const subItem = orderData.items.find((i) => i.planType === 'weekly');

    let subscriptionDetails = orderData.subscriptionDetails;
    if (isSub && !subscriptionDetails && subItem) {
      const daysCount = subItem.subscriptionDaysCount || 6;
      const mealsPerDay = subItem.mealsPerDay || (subItem.mealType === 'Both' ? 2 : 1);
      const totalMeals = (subItem.totalMealsCount || daysCount * mealsPerDay) * subItem.quantity;
      const discountPercent = subItem.discountPercent || (daysCount >= 7 ? 15 : daysCount >= 6 ? 12 : 10);
      const originalEst = subItem.itemPrice * (1 / (1 - discountPercent / 100)) * totalMeals;
      const discountSaved = Math.round(originalEst - orderData.totalAmount);

      const activeDays = subItem.subscriptionDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const startDateStr = subItem.subscriptionStartDate || new Date().toISOString().split('T')[0];
      const startD = new Date(startDateStr);

      const scheduledDays = activeDays.map((dayName, idx) => {
        const d = new Date(startD.getTime() + idx * 86400000);
        return {
          day: dayName,
          date: d.toISOString().split('T')[0],
          status: idx === 0 ? ('Preparing' as const) : ('Scheduled' as const),
        };
      });

      subscriptionDetails = {
        planType: 'weekly',
        daysCount,
        activeDays,
        startDate: startDateStr,
        endDate: subItem.subscriptionEndDate || new Date(startD.getTime() + 6 * 86400000).toISOString().split('T')[0],
        mealType: subItem.mealType,
        mealsPerDay,
        totalMeals,
        discountPercent,
        discountSaved: Math.max(0, discountSaved),
        pausedDates: [],
        scheduledDays,
      };
    }

    const newOrder: Order = {
      ...orderData,
      id: isSub ? `SUB-${Math.floor(1000 + Math.random() * 9000)}` : `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      isSubscription: isSub,
      subscriptionDetails,
      status: 'Placed',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      trackingSteps: [
        {
          step: 'Order Placed',
          description: isSub ? 'Weekly meal subscription confirmed' : 'Order confirmed with mother chef',
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          step: 'Kitchen Accepted',
          description: isSub ? 'Mother chef scheduled daily meal deliveries' : 'Mother chef is verifying menu & ingredients',
          completed: false,
        },
        {
          step: 'Cooking with Love',
          description: isSub ? "Today's recurring fresh hot meal being cooked" : 'Fresh hot meals being cooked',
          completed: false,
        },
        {
          step: 'Out for Delivery',
          description: 'Delivery partner picked up daily tiffin box',
          completed: false,
        },
        {
          step: 'Delivered',
          description: 'Delivered to your doorstep in Vadodara',
          completed: false,
        },
      ],
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      cart: [],
    }));

    get().addToast(
      isSub
        ? `Weekly Subscription ${newOrder.id} activated! Daily meals scheduled.`
        : `Order ${newOrder.id} placed successfully!`,
      'success'
    );
    return newOrder;
  },

  togglePauseSubscriptionDate: (orderId: string, dateStr: string) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId || !o.subscriptionDetails) return o;
        const currentPaused = o.subscriptionDetails.pausedDates || [];
        const isPaused = currentPaused.includes(dateStr);
        const updatedPaused = isPaused
          ? currentPaused.filter((d) => d !== dateStr)
          : [...currentPaused, dateStr];

        return {
          ...o,
          subscriptionDetails: {
            ...o.subscriptionDetails,
            pausedDates: updatedPaused,
          },
        };
      }),
    }));

    const targetOrder = get().orders.find((o) => o.id === orderId);
    const isNowPaused = targetOrder?.subscriptionDetails?.pausedDates?.includes(dateStr);
    get().addToast(
      isNowPaused
        ? `Tiffin paused for ${dateStr}. Daily meal skipped.`
        : `Tiffin resumed for ${dateStr}. Meal will be delivered!`,
      'info'
    );
  },

  updateOrderStatus: (orderId, newStatus) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;

        const updatedSteps = o.trackingSteps.map((step) => {
          if (newStatus === 'Preparing' && step.step === 'Kitchen Accepted') {
            return { ...step, completed: true, current: true };
          }
          if (newStatus === 'Preparing' && step.step === 'Cooking with Love') {
            return { ...step, completed: true, current: true };
          }
          if (newStatus === 'Out for Delivery' && step.step === 'Out for Delivery') {
            return { ...step, completed: true, current: true };
          }
          if (newStatus === 'Delivered') {
            return { ...step, completed: true, current: true };
          }
          return step;
        });

        return {
          ...o,
          status: newStatus,
          trackingSteps: updatedSteps,
        };
      }),
    }));

    const order = get().orders.find((o) => o.id === orderId);
    if (order && get().selectedOrderForTracking?.id === orderId) {
      set({ selectedOrderForTracking: order });
    }

    get().addToast(`Order ${orderId} status updated to: ${newStatus}`, 'info');
  },

  reorder: (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    order.items.forEach((item) => {
      get().addToCart({
        motherId: item.motherId,
        motherName: item.motherName,
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        quantity: item.quantity,
        mealType: item.mealType,
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveryTimeSlot: item.deliveryTimeSlot,
        specialInstructions: item.specialInstructions,
      });
    });

    get().addToast('Items added to cart for reorder!', 'success');
  },

  // Reviews
  reviews: MOCK_REVIEWS,
  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      verifiedSubscriber: true,
    };
    
    // Update reviews and recompute mother's rating and review count
    set((state) => {
      const updatedReviews = [newReview, ...state.reviews];
      
      const motherReviews = updatedReviews.filter((r) => r.motherId === reviewData.motherId);
      const avgRating = motherReviews.reduce((sum, r) => sum + r.rating, 0) / (motherReviews.length || 1);
      
      const updatedMothers = state.mothers.map((m) => {
        if (m.id === reviewData.motherId) {
          return {
            ...m,
            rating: Number(avgRating.toFixed(1)),
            reviewCount: motherReviews.length,
          };
        }
        return m;
      });

      return {
        reviews: updatedReviews,
        mothers: updatedMothers,
      };
    });

    get().addToast(`Thank you! Your review for ${reviewData.motherName} has been published.`, 'success');
  },

  deleteReview: (reviewId) => {
    set((state) => {
      const target = state.reviews.find((r) => r.id === reviewId);
      const updatedReviews = state.reviews.filter((r) => r.id !== reviewId);
      
      let updatedMothers = state.mothers;
      if (target) {
        const motherReviews = updatedReviews.filter((r) => r.motherId === target.motherId);
        const avgRating = motherReviews.length > 0 
          ? motherReviews.reduce((sum, r) => sum + r.rating, 0) / motherReviews.length 
          : 5.0;
        
        updatedMothers = state.mothers.map((m) => {
          if (m.id === target.motherId) {
            return {
              ...m,
              rating: Number(avgRating.toFixed(1)),
              reviewCount: motherReviews.length,
            };
          }
          return m;
        });
      }

      return {
        reviews: updatedReviews,
        mothers: updatedMothers,
      };
    });
    get().addToast('Review deleted successfully', 'info');
  },

  updateReview: (reviewId, updated) => {
    set((state) => {
      const updatedReviews = state.reviews.map((r) =>
        r.id === reviewId ? { ...r, ...updated } : r
      );
      return { reviews: updatedReviews };
    });
    get().addToast('Review updated successfully', 'success');
  },

  // Toasts
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Modals
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  isMenuModalOpen: false,
  openMenuModal: (mother) => set({ isMenuModalOpen: true, selectedMotherForMenu: mother }),
  closeMenuModal: () => set({ isMenuModalOpen: false, selectedMotherForMenu: null }),

  isBookingModalOpen: false,
  bookingInitialPlan: 'single',
  openBookingModal: (mother, initialPlan = 'single') =>
    set({ isBookingModalOpen: true, selectedMotherForBooking: mother, bookingInitialPlan: initialPlan }),
  closeBookingModal: () => set({ isBookingModalOpen: false, selectedMotherForBooking: null, bookingInitialPlan: 'single' }),

  isTrackingModalOpen: false,
  openTrackingModal: (order) => set({ isTrackingModalOpen: true, selectedOrderForTracking: order }),
  closeTrackingModal: () => set({ isTrackingModalOpen: false, selectedOrderForTracking: null }),

  isChefReviewsModalOpen: false,
  selectedMotherForReviews: null,
  openChefReviewsModal: (mother) => set({ isChefReviewsModalOpen: true, selectedMotherForReviews: mother }),
  closeChefReviewsModal: () => set({ isChefReviewsModalOpen: false, selectedMotherForReviews: null }),

  isWriteReviewModalOpen: false,
  reviewTargetOrder: null,
  reviewTargetMother: null,
  openWriteReviewModal: (target) =>
    set({
      isWriteReviewModalOpen: true,
      reviewTargetOrder: target?.order || null,
      reviewTargetMother: target?.mother || null,
    }),
  closeWriteReviewModal: () =>
    set({
      isWriteReviewModalOpen: false,
      reviewTargetOrder: null,
      reviewTargetMother: null,
    }),

  // Search & Filter
  selectedArea: 'All',
  setSelectedArea: (area) => set({ selectedArea: area }),
  selectedCuisine: 'All',
  setSelectedCuisine: (cuisine) => set({ selectedCuisine: cuisine }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  sortBy: 'recommended',
  setSortBy: (sortBy) => set({ sortBy }),
}));
