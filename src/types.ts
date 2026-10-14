export type UserRole = 'customer' | 'chef';
export type Profession = 'Student' | 'Employee' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profession: Profession;
  phone?: string;
  address: string;
  area: string;
  avatar?: string;
  verifiedChef?: boolean;
  verifiedAccount?: boolean;
  dietaryPreference?: 'Pure Veg' | 'Pure Jain' | 'Kathiyawadi / Gujarati' | 'Regular';
  joinedDate?: string;
  authMethod?: 'password' | 'otp' | 'google' | 'chef';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  mealType: 'Lunch' | 'Dinner' | 'Both';
  category: 'Thali' | 'Special Subzi' | 'Breads' | 'Rice' | 'Dessert' | 'Snack';
  isJain?: boolean;
  isPureVeg?: boolean;
  image?: string;
}

export interface MotherChef {
  id: string;
  name: string;
  profilePhoto: string;
  phone?: string;
  rating: number;
  reviewCount: number;
  area: string;
  specialtyCuisines: string[];
  pricePerTiffin: number;
  bio: string;
  isVerified: boolean;
  experienceYears: number;
  tiffinContents: string[];
  menuItems: MenuItem[];
  isOpen: boolean;
  dailyCapacity: number;
  activeOrdersCount: number;
}

export type PlanType = 'single' | 'weekly';

export interface CartItem {
  id: string;
  motherId: string;
  motherName: string;
  itemId?: string;
  itemName: string;
  itemPrice: number;
  quantity: number;
  mealType: 'Lunch' | 'Dinner' | 'Both';
  deliveryDate: string;
  deliveryTimeSlot: string;
  specialInstructions?: string;
  planType?: PlanType;
  isSubscription?: boolean;
  subscriptionDaysCount?: number;
  subscriptionDays?: string[];
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  discountPercent?: number;
  mealsPerDay?: number;
  totalMealsCount?: number;
  subscriptionDetails?: SubscriptionDetails;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface TrackingStep {
  step: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current?: boolean;
}

export interface ScheduledSubscriptionDay {
  day: string;
  date: string;
  status: 'Scheduled' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Paused';
}

export interface SubscriptionDetails {
  planType: 'weekly';
  daysCount: number;
  activeDays: string[];
  startDate: string;
  endDate: string;
  mealType: 'Lunch' | 'Dinner' | 'Both';
  mealsPerDay: number;
  totalMeals: number;
  discountPercent: number;
  discountSaved: number;
  pausedDates: string[];
  scheduledDays?: ScheduledSubscriptionDay[];
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  motherId: string;
  motherName: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  area: string;
  deliveryDate: string;
  timeSlot: string;
  status: OrderStatus;
  createdAt: string;
  paymentMethod: string;
  trackingSteps: TrackingStep[];
  isSubscription?: boolean;
  subscriptionDetails?: SubscriptionDetails;
}

export interface Review {
  id: string;
  userId?: string;
  orderId?: string;
  motherId: string;
  motherName: string;
  userName: string;
  userProfession: string;
  userType?: 'Student' | 'Professional';
  userArea?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  dishMentioned?: string;
  verifiedSubscriber?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
