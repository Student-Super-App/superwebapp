import type {
  UserProfile,
  UpdateProfileData,
  UpdateSettingsData,
  DashboardData,
  UserBalance,
  UserSearchParams,
  Friend,
  FriendRequest,
  AddFriendData,
  RespondFriendRequestData,
  Group,
  CreateGroupData,
  UpdateGroupData,
  AddMemberData,
  UpdateMemberRoleData,
  GroupFilters,
  GroupBalance,
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  MarkSplitPaidData,
  ApproveExpenseData,
  ExpenseFilters,
  ExpenseStats,
  Settlement,
  CreateSettlementData,
  UpdateSettlementData,
  SettlementSuggestion,
  SettlementFilters,
  PaginatedResponse,
  SingleResponse,
} from '@/types/splitzone';
import api from '@/lib/axios';

const SPLITZONE_BASE_URL = process.env.NEXT_PUBLIC_SPLITZONE_URL;
console.log('SplitZone Base URL:', SPLITZONE_BASE_URL);

// ==================== USER APIs ====================
export const userApi = {
  // Get or create profile (auth required)
  getOrCreateProfile: async (): Promise<SingleResponse<UserProfile>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/profile`);
    return data;
  },

  // Update profile (auth required)
  updateProfile: async (profileData: UpdateProfileData): Promise<SingleResponse<UserProfile>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/users/profile`, profileData);
    return data;
  },

  // Update settings (auth required)
  updateSettings: async (
    settingsData: UpdateSettingsData
  ): Promise<SingleResponse<UserProfile>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/users/settings`, settingsData);
    return data;
  },

  // Get dashboard (auth required)
  getDashboard: async (): Promise<SingleResponse<DashboardData>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/dashboard`);
    return data;
  },

  // Get balances (auth required)
  getBalances: async (
    groupId?: string
  ): Promise<
    SingleResponse<{
      youOwe: UserBalance[];
      youAreOwed: UserBalance[];
      summary: {
        totalOwed: number;
        totalOwing: number;
        netBalance: number;
        currency: string;
      };
    }>
  > => {
    const params = new URLSearchParams();
    if (groupId) params.append('groupId', groupId);

    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/balances?${params.toString()}`);
    return data;
  },

  // Search users (auth required)
  searchUsers: async (
    params: UserSearchParams
  ): Promise<
    PaginatedResponse<{
      userId: string;
      userName: string;
      email: string;
      profilePicture?: string;
    }>
  > => {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.append('q', params.q);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const { data } = await api.get(
      `${SPLITZONE_BASE_URL}/api/users/search?${searchParams.toString()}`
    );
    return data;
  },

  // Get user by ID (auth required)
  getUserById: async (
    userId: string
  ): Promise<
    SingleResponse<{
      userId: string;
      userName: string;
      email: string;
      profilePicture?: string;
    }>
  > => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/${userId}`);
    return data;
  },

  // Deactivate account (auth required)
  deactivateAccount: async (): Promise<SingleResponse<void>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/users/profile`);
    return data;
  },
};

// ==================== FRIEND APIs ====================
export const friendApi = {
  // Get all friends
  getFriends: async (): Promise<SingleResponse<Friend[]>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/friends`);
    return data;
  },

  // Get friend requests
  getFriendRequests: async (): Promise<SingleResponse<FriendRequest[]>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/users/friends/requests`);
    return data;
  },

  // Send friend request
  addFriend: async (friendData: AddFriendData): Promise<SingleResponse<FriendRequest>> => {
    const { data} = await api.post(`${SPLITZONE_BASE_URL}/api/users/friends/add`, friendData);
    return data;
  },

  // Accept friend request
  acceptFriend: async (requestId: string): Promise<SingleResponse<Friend>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/users/friends/${requestId}/accept`);
    return data;
  },

  // Reject friend request
  rejectFriend: async (requestId: string): Promise<SingleResponse<void>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/users/friends/${requestId}/reject`);
    return data;
  },

  // Remove friend
  removeFriend: async (friendId: string): Promise<SingleResponse<void>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/users/friends/${friendId}`);
    return data;
  },
};

// ==================== GROUP APIs ====================
export const groupApi = {
  // Create group (auth required)
  create: async (groupData: CreateGroupData): Promise<SingleResponse<Group>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/groups`, groupData);
    return data;
  },

  // Get user groups (auth required)
  getUserGroups: async (filters?: GroupFilters): Promise<PaginatedResponse<Group>> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);

    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/groups?${params.toString()}`);
    return data;
  },

  // Get group by ID (auth required)
  getById: async (id: string): Promise<SingleResponse<Group>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/groups/${id}`);
    return data;
  },

  // Update group (auth required)
  update: async (id: string, groupData: UpdateGroupData): Promise<SingleResponse<Group>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/groups/${id}`, groupData);
    return data;
  },

  // Delete group (auth required)
  delete: async (id: string): Promise<SingleResponse<void>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/groups/${id}`);
    return data;
  },

  // Get group balances (auth required)
  getBalances: async (id: string): Promise<SingleResponse<GroupBalance[]>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/groups/${id}/balances`);
    return data;
  },

  // Add member (auth required)
  addMember: async (id: string, memberData: AddMemberData): Promise<SingleResponse<Group>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/groups/${id}/members`, memberData);
    return data;
  },

  // Remove member (auth required)
  removeMember: async (id: string, userId: string): Promise<SingleResponse<Group>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/groups/${id}/members/${userId}`);
    return data;
  },

  // Update member role (auth required)
  updateMemberRole: async (
    id: string,
    userId: string,
    roleData: UpdateMemberRoleData
  ): Promise<SingleResponse<Group>> => {
    const { data } = await api.put(
      `${SPLITZONE_BASE_URL}/api/groups/${id}/members/${userId}/role`,
      roleData
    );
    return data;
  },
};

// ==================== EXPENSE APIs ====================
export const expenseApi = {
  // Create expense (auth required)
  create: async (expenseData: CreateExpenseData): Promise<SingleResponse<Expense>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/expenses`, expenseData);
    return data;
  },

  // Get expenses (auth required)
  getAll: async (filters?: ExpenseFilters): Promise<PaginatedResponse<Expense>> => {
    const params = new URLSearchParams();
    if (filters?.groupId) params.append('groupId', filters.groupId);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.isSettled !== undefined) params.append('isSettled', filters.isSettled.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/expenses?${params.toString()}`);
    return data;
  },

  // Get expense by ID (auth required)
  getById: async (id: string): Promise<SingleResponse<Expense>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/expenses/${id}`);
    return data;
  },

  // Get expense stats (auth required)
  getStats: async (
    groupId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<SingleResponse<ExpenseStats>> => {
    const params = new URLSearchParams();
    if (groupId) params.append('groupId', groupId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/expenses/stats?${params.toString()}`);
    return data;
  },

  // Update expense (auth required)
  update: async (id: string, expenseData: UpdateExpenseData): Promise<SingleResponse<Expense>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/expenses/${id}`, expenseData);
    return data;
  },

  // Delete expense (auth required)
  delete: async (id: string): Promise<SingleResponse<void>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/expenses/${id}`);
    return data;
  },

  // Mark split as paid (auth required)
  markSplitAsPaid: async (
    id: string,
    splitData: MarkSplitPaidData
  ): Promise<SingleResponse<Expense>> => {
    const { data } = await api.post(
      `${SPLITZONE_BASE_URL}/api/expenses/${id}/mark-paid`,
      splitData
    );
    return data;
  },

  // Approve expense (auth required)
  approveExpense: async (
    id: string,
    approvalData: ApproveExpenseData
  ): Promise<SingleResponse<Expense>> => {
    const { data } = await api.post(
      `${SPLITZONE_BASE_URL}/api/expenses/${id}/approve`,
      approvalData
    );
    return data;
  },
};

// ==================== SETTLEMENT APIs ====================
export const settlementApi = {
  // Create settlement (auth required)
  create: async (settlementData: CreateSettlementData): Promise<SingleResponse<Settlement>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/settlements`, settlementData);
    return data;
  },

  // Get settlements (auth required)
  getAll: async (filters?: SettlementFilters): Promise<PaginatedResponse<Settlement>> => {
    const params = new URLSearchParams();
    if (filters?.groupId) params.append('groupId', filters.groupId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/settlements?${params.toString()}`);
    return data;
  },

  // Get settlement by ID (auth required)
  getById: async (id: string): Promise<SingleResponse<Settlement>> => {
    const { data } = await api.get(`${SPLITZONE_BASE_URL}/api/settlements/${id}`);
    return data;
  },

  // Get suggested settlements (auth required)
  getSuggestions: async (
    groupId: string,
    simplify?: boolean
  ): Promise<SingleResponse<SettlementSuggestion[]>> => {
    const params = new URLSearchParams();
    if (simplify !== undefined) params.append('simplify', simplify.toString());

    const { data } = await api.get(
      `${SPLITZONE_BASE_URL}/api/settlements/suggest/${groupId}?${params.toString()}`
    );
    return data;
  },

  // Update settlement (auth required)
  update: async (
    id: string,
    settlementData: UpdateSettlementData
  ): Promise<SingleResponse<Settlement>> => {
    const { data } = await api.put(`${SPLITZONE_BASE_URL}/api/settlements/${id}`, settlementData);
    return data;
  },

  // Confirm settlement (auth required)
  confirm: async (id: string): Promise<SingleResponse<Settlement>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/settlements/${id}/confirm`);
    return data;
  },

  // Reject settlement (auth required)
  reject: async (id: string, reason?: string): Promise<SingleResponse<Settlement>> => {
    const { data } = await api.post(`${SPLITZONE_BASE_URL}/api/settlements/${id}/reject`, {
      reason,
    });
    return data;
  },

  // Delete settlement (auth required)
  delete: async (id: string): Promise<SingleResponse<void>> => {
    const { data } = await api.delete(`${SPLITZONE_BASE_URL}/api/settlements/${id}`);
    return data;
  },
};
