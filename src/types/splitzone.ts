// ==================== USER TYPES ====================

export interface UserProfile {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profile: {
    phoneNumber?: string;
    profilePicture?: string;
    university?: string;
    graduationYear?: number;
    bio?: string;
  };
  settings: {
    defaultCurrency: Currency;
    notifications: {
      email: boolean;
      push: boolean;
      newExpense: boolean;
      paymentReceived: boolean;
      groupInvite: boolean;
      expenseReminder: boolean;
    };
    language: Language;
  };
  stats: {
    totalGroups: number;
    totalExpenses: number;
    totalSpent: number;
    totalOwed: number;
    totalOwing: number;
    lastActiveAt?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  userName?: string;
  profile?: {
    phoneNumber?: string;
    profilePicture?: string;
    university?: string;
    graduationYear?: number;
    bio?: string;
  };
}

export interface UpdateSettingsData {
  defaultCurrency?: Currency;
  notifications?: {
    email?: boolean;
    push?: boolean;
    newExpense?: boolean;
    paymentReceived?: boolean;
    groupInvite?: boolean;
    expenseReminder?: boolean;
  };
  language?: Language;
}

export interface UserBalance {
  userId: string;
  userName: string;
  email: string;
  amount: number;
  currency: Currency;
  groupId?: string;
  groupName?: string;
}

export interface DashboardData {
  user: UserProfile;
  balances: {
    youOwe: UserBalance[];
    youAreOwed: UserBalance[];
    summary: {
      totalOwed: number;
      totalOwing: number;
      netBalance: number;
      currency: Currency;
    };
  };
  recentActivity: Activity[];
  stats: {
    totalGroups: number;
    totalExpenses: number;
    totalSpent: number;
    activeGroups: number;
  };
}

export interface UserSearchParams {
  q?: string;
  limit?: number;
}

export interface Friend {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  profilePicture?: string;
  university?: string;
  status: 'pending' | 'accepted' | 'rejected';
  addedAt: string;
  lastExpense?: {
    amount: number;
    date: string;
  };
  balance?: number; // How much you owe them (negative) or they owe you (positive)
}

export interface FriendRequest {
  _id: string;
  fromUser: {
    userId: string;
    userName: string;
    email: string;
    profilePicture?: string;
  };
  toUser: {
    userId: string;
    userName: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

export interface AddFriendData {
  friendUserId: string;
}

export interface RespondFriendRequestData {
  status: 'accepted' | 'rejected';
}

// ==================== GROUP TYPES ====================

export interface Group {
  _id: string;
  name: string;
  description?: string;
  groupImage?: string;
  category: GroupCategory;
  createdBy: {
    userId: string;
    userName: string;
    email: string;
  };
  members: GroupMember[];
  currency: Currency;
  settings: {
    simplifyDebts: boolean;
    allowMemberToAddExpense: boolean;
    allowMemberToInvite: boolean;
    requireApprovalForExpense: boolean;
  };
  stats: {
    totalExpenses: number;
    totalAmount: number;
    pendingSettlements: number;
    lastActivityAt?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  userId: string;
  userName: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
  isActive: boolean;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  groupImage?: string;
  category: GroupCategory;
  currency?: Currency;
  settings?: {
    simplifyDebts?: boolean;
    allowMemberToAddExpense?: boolean;
    allowMemberToInvite?: boolean;
    requireApprovalForExpense?: boolean;
  };
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  groupImage?: string;
  category?: GroupCategory;
  currency?: Currency;
  settings?: {
    simplifyDebts?: boolean;
    allowMemberToAddExpense?: boolean;
    allowMemberToInvite?: boolean;
    requireApprovalForExpense?: boolean;
  };
}

export interface AddMemberData {
  userId: string;
  userName: string;
  email: string;
  role?: MemberRole;
}

export interface UpdateMemberRoleData {
  role: MemberRole;
}

export interface GroupFilters {
  page?: number;
  limit?: number;
  category?: GroupCategory;
}

export interface GroupBalance {
  userId: string;
  userName: string;
  balances: {
    owesTo: {
      userId: string;
      userName: string;
      amount: number;
    }[];
    owedBy: {
      userId: string;
      userName: string;
      amount: number;
    }[];
  };
}

// ==================== EXPENSE TYPES ====================

export interface Expense {
  _id: string;
  groupId: string;
  group?: {
    _id: string;
    name: string;
  };
  description: string;
  category: ExpenseCategory;
  totalAmount: number;
  currency: Currency;
  paidBy: {
    userId: string;
    userName: string;
    email: string;
  };
  expenseDate: string;
  splitMethod: SplitMethod;
  splits: ExpenseSplit[];
  receipt?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  notes?: string;
  approval?: {
    isRequired: boolean;
    isApproved: boolean;
    approvedBy?: {
      userId: string;
      userName: string;
    };
    approvedAt?: string;
    rejectedReason?: string;
  };
  isSettled: boolean;
  createdBy: {
    userId: string;
    userName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSplit {
  userId: string;
  userName: string;
  amount: number;
  percentage?: number;
  shares?: number;
  isPaid: boolean;
  paidAt?: string;
}

export interface CreateExpenseData {
  groupId: string;
  description: string;
  category: ExpenseCategory;
  totalAmount: number;
  currency: Currency;
  paidBy: {
    userId: string;
    userName: string;
    email: string;
  };
  expenseDate?: string;
  splitMethod: SplitMethod;
  splits: {
    userId: string;
    userName: string;
    amount?: number;
    percentage?: number;
    shares?: number;
  }[];
  paymentMethod?: PaymentMethod;
  receipt?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  notes?: string;
}

export interface UpdateExpenseData {
  description?: string;
  category?: ExpenseCategory;
  totalAmount?: number;
  expenseDate?: string;
  notes?: string;
  receipt?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
}

export interface MarkSplitPaidData {
  userId: string;
}

export interface ApproveExpenseData {
  isApproved: boolean;
  rejectedReason?: string;
}

export interface ExpenseFilters {
  groupId?: string;
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
  isSettled?: boolean;
  page?: number;
  limit?: number;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  byCategory: {
    category: ExpenseCategory;
    count: number;
    totalAmount: number;
    averageAmount: number;
  }[];
  period: {
    startDate: string;
    endDate: string;
  };
}

// ==================== SETTLEMENT TYPES ====================

export interface Settlement {
  _id: string;
  groupId: string;
  group?: {
    _id: string;
    name: string;
  };
  expenseId?: string;
  expense?: {
    _id: string;
    description: string;
  };
  payer: {
    userId: string;
    userName: string;
    email: string;
  };
  recipient: {
    userId: string;
    userName: string;
    email: string;
  };
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    transactionId?: string;
    reference?: string;
  } & Record<string, unknown>;
  proof?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  settlementDate: string;
  status: SettlementStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettlementData {
  groupId: string;
  expenseId?: string;
  payer: {
    userId: string;
    userName: string;
    email: string;
  };
  recipient: {
    userId: string;
    userName: string;
    email: string;
  };
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    transactionId?: string;
    reference?: string;
  } & Record<string, unknown>;
  proof?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  settlementDate?: string;
  notes?: string;
}

export interface UpdateSettlementData {
  amount?: number;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    transactionId?: string;
    reference?: string;
  } & Record<string, unknown>;
  notes?: string;
}

export interface SettlementSuggestion {
  from: {
    userId: string;
    userName: string;
  };
  to: {
    userId: string;
    userName: string;
  };
  amount: number;
  currency: Currency;
}

export interface SettlementFilters {
  groupId?: string;
  status?: SettlementStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ==================== ACTIVITY TYPES ====================

export interface Activity {
  _id: string;
  groupId: string;
  type: ActivityType;
  actor: {
    userId: string;
    userName: string;
  };
  target?: {
    userId?: string;
    userName?: string;
  };
  relatedEntities: {
    expenseId?: string;
    settlementId?: string;
  };
  description: string;
  metadata?: Record<string, unknown>;
  amount?: number;
  currency?: Currency;
  timestamp: string;
}

// ==================== ENUMS & CONSTANTS ====================

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'hi'] as const;
export type Language = (typeof LANGUAGES)[number];

export const GROUP_CATEGORIES = [
  'apartment',
  'house',
  'trip',
  'event',
  'couple',
  'project',
  'other',
] as const;
export type GroupCategory = (typeof GROUP_CATEGORIES)[number];

export const MEMBER_ROLES = ['creator', 'admin', 'member'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const EXPENSE_CATEGORIES = [
  'food',
  'groceries',
  'rent',
  'utilities',
  'transportation',
  'entertainment',
  'shopping',
  'travel',
  'education',
  'health',
  'other',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const SPLIT_METHODS = ['equal', 'exact', 'percentage', 'shares'] as const;
export type SplitMethod = (typeof SPLIT_METHODS)[number];

export const PAYMENT_METHODS = [
  'cash',
  'bank_transfer',
  'upi',
  'paypal',
  'venmo',
  'zelle',
  'card',
  'other',
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const SETTLEMENT_STATUSES = ['pending', 'confirmed', 'rejected'] as const;
export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export const ACTIVITY_TYPES = [
  'group_created',
  'group_updated',
  'member_added',
  'member_removed',
  'member_role_changed',
  'expense_created',
  'expense_updated',
  'expense_deleted',
  'expense_approved',
  'expense_rejected',
  'split_paid',
  'settlement_created',
  'settlement_updated',
  'settlement_confirmed',
  'settlement_rejected',
  'settlement_deleted',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

// ==================== API RESPONSE TYPES ====================

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== UTILITY TYPES ====================

export interface CategoryIconMap {
  [key: string]: string;
}

export interface ColorMap {
  [key: string]: string;
}
