import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { userApi, friendApi, groupApi, expenseApi, settlementApi } from './services';
import type {
  UpdateProfileData,
  UpdateSettingsData,
  UserSearchParams,
  AddFriendData,
  GroupFilters,
  CreateGroupData,
  UpdateGroupData,
  AddMemberData,
  UpdateMemberRoleData,
  ExpenseFilters,
  CreateExpenseData,
  UpdateExpenseData,
  MarkSplitPaidData,
  ApproveExpenseData,
  SettlementFilters,
  CreateSettlementData,
  UpdateSettlementData,
} from '@/types/splitzone';

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (error: unknown): string => {
  return (error as ApiError).response?.data?.message || 'An error occurred';
};

// ==================== QUERY KEYS ====================
export const splitZoneKeys = {
  all: ['splitzone'] as const,

  // User keys
  users: () => [...splitZoneKeys.all, 'users'] as const,
  userProfile: () => [...splitZoneKeys.users(), 'profile'] as const,
  userDashboard: () => [...splitZoneKeys.users(), 'dashboard'] as const,
  userBalances: (groupId?: string) => [...splitZoneKeys.users(), 'balances', groupId] as const,
  userSearch: (params: UserSearchParams) => [...splitZoneKeys.users(), 'search', params] as const,
  userById: (userId: string) => [...splitZoneKeys.users(), 'detail', userId] as const,

  // Friend keys
  friends: () => [...splitZoneKeys.all, 'friends'] as const,
  friendsList: () => [...splitZoneKeys.friends(), 'list'] as const,
  friendRequests: () => [...splitZoneKeys.friends(), 'requests'] as const,

  // Group keys
  groups: () => [...splitZoneKeys.all, 'groups'] as const,
  groupsList: (filters?: GroupFilters) => [...splitZoneKeys.groups(), 'list', filters] as const,
  groupDetail: (id: string) => [...splitZoneKeys.groups(), 'detail', id] as const,
  groupBalances: (id: string) => [...splitZoneKeys.groups(), id, 'balances'] as const,

  // Expense keys
  expenses: () => [...splitZoneKeys.all, 'expenses'] as const,
  expensesList: (filters?: ExpenseFilters) =>
    [...splitZoneKeys.expenses(), 'list', filters] as const,
  expenseDetail: (id: string) => [...splitZoneKeys.expenses(), 'detail', id] as const,
  expenseStats: (groupId?: string, startDate?: string, endDate?: string) =>
    [...splitZoneKeys.expenses(), 'stats', { groupId, startDate, endDate }] as const,

  // Settlement keys
  settlements: () => [...splitZoneKeys.all, 'settlements'] as const,
  settlementsList: (filters?: SettlementFilters) =>
    [...splitZoneKeys.settlements(), 'list', filters] as const,
  settlementDetail: (id: string) => [...splitZoneKeys.settlements(), 'detail', id] as const,
  settlementSuggestions: (groupId: string, simplify?: boolean) =>
    [...splitZoneKeys.settlements(), 'suggestions', groupId, simplify] as const,
};

// ==================== USER HOOKS ====================

// Get or create user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: splitZoneKeys.userProfile(),
    queryFn: () => userApi.getOrCreateProfile(),
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userProfile() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update profile');
    },
  });
};

// Update settings
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsData) => userApi.updateSettings(data),
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userProfile() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update settings');
    },
  });
};

// Get dashboard
export const useDashboard = () => {
  return useQuery({
    queryKey: splitZoneKeys.userDashboard(),
    queryFn: () => userApi.getDashboard(),
    staleTime: 30000, // 30 seconds
  });
};

// Get balances
export const useBalances = (groupId?: string) => {
  return useQuery({
    queryKey: splitZoneKeys.userBalances(groupId),
    queryFn: () => userApi.getBalances(groupId),
    staleTime: 30000,
  });
};

// Search users
export const useSearchUsers = (params: UserSearchParams) => {
  return useQuery({
    queryKey: splitZoneKeys.userSearch(params),
    queryFn: () => userApi.searchUsers(params),
    enabled: (params.q?.length ?? 0) >= 2,
    staleTime: 60000,
  });
};

// Get user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: splitZoneKeys.userById(userId),
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
  });
};

// Deactivate account
export const useDeactivateAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deactivateAccount(),
    onSuccess: () => {
      toast.success('Account deactivated successfully');
      queryClient.clear();
      router.push('/login');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to deactivate account');
    },
  });
};

// ==================== FRIEND HOOKS ====================

// Get friends
export const useFriends = () => {
  return useQuery({
    queryKey: splitZoneKeys.friendsList(),
    queryFn: () => friendApi.getFriends(),
  });
};

// Get friend requests
export const useFriendRequests = () => {
  return useQuery({
    queryKey: splitZoneKeys.friendRequests(),
    queryFn: () => friendApi.getFriendRequests(),
  });
};

// Add friend
export const useAddFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddFriendData) => friendApi.addFriend(data),
    onSuccess: () => {
      toast.success('Friend request sent!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.friendRequests() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to send friend request');
    },
  });
};

// Accept friend request
export const useAcceptFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => friendApi.acceptFriend(requestId),
    onSuccess: () => {
      toast.success('Friend request accepted!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.friendRequests() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.friendsList() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to accept friend request');
    },
  });
};

// Reject friend request
export const useRejectFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => friendApi.rejectFriend(requestId),
    onSuccess: () => {
      toast.success('Friend request rejected');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.friendRequests() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to reject friend request');
    },
  });
};

// Remove friend
export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendId: string) => friendApi.removeFriend(friendId),
    onSuccess: () => {
      toast.success('Friend removed');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.friendsList() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to remove friend');
    },
  });
};

// ==================== GROUP HOOKS ====================

// Create group
export const useCreateGroup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupData) => groupApi.create(data),
    onSuccess: (response) => {
      toast.success('Group created successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push(`/splitzone/groups/${response.data._id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to create group');
    },
  });
};

// Get user groups
export const useGroups = (filters?: GroupFilters) => {
  return useQuery({
    queryKey: splitZoneKeys.groupsList(filters),
    queryFn: () => groupApi.getUserGroups(filters),
    staleTime: 30000,
  });
};

// Get group by ID
export const useGroup = (id: string) => {
  return useQuery({
    queryKey: splitZoneKeys.groupDetail(id),
    queryFn: () => groupApi.getById(id),
    enabled: !!id,
  });
};

// Update group
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupData }) => groupApi.update(id, data),
    onSuccess: (response, variables) => {
      toast.success('Group updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update group');
    },
  });
};

// Delete group
export const useDeleteGroup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupApi.delete(id),
    onSuccess: () => {
      toast.success('Group deleted successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push('/splitzone/groups');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to delete group');
    },
  });
};

// Get group balances
export const useGroupBalances = (id: string) => {
  return useQuery({
    queryKey: splitZoneKeys.groupBalances(id),
    queryFn: () => groupApi.getBalances(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

// Add member
export const useAddMember = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberData) => groupApi.addMember(groupId, data),
    onSuccess: () => {
      toast.success('Member added successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to add member');
    },
  });
};

// Remove member
export const useRemoveMember = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => groupApi.removeMember(groupId, userId),
    onSuccess: () => {
      toast.success('Member removed successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to remove member');
    },
  });
};

// Update member role
export const useUpdateMemberRole = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateMemberRoleData }) =>
      groupApi.updateMemberRole(groupId, userId, data),
    onSuccess: () => {
      toast.success('Member role updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(groupId) });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update member role');
    },
  });
};

// ==================== EXPENSE HOOKS ====================

// Create expense
export const useCreateExpense = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseData) => expenseApi.create(data),
    onSuccess: (response) => {
      toast.success('Expense added successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push(`/splitzone/expenses/${response.data._id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to create expense');
    },
  });
};

// Get expenses
export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery({
    queryKey: splitZoneKeys.expensesList(filters),
    queryFn: () => expenseApi.getAll(filters),
    staleTime: 30000,
  });
};

// Get expense by ID
export const useExpense = (id: string) => {
  return useQuery({
    queryKey: splitZoneKeys.expenseDetail(id),
    queryFn: () => expenseApi.getById(id),
    enabled: !!id,
  });
};

// Get expense stats
export const useExpenseStats = (groupId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: splitZoneKeys.expenseStats(groupId, startDate, endDate),
    queryFn: () => expenseApi.getStats(groupId, startDate, endDate),
    staleTime: 60000,
  });
};

// Update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseData }) =>
      expenseApi.update(id, data),
    onSuccess: (response, variables) => {
      toast.success('Expense updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenseDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update expense');
    },
  });
};

// Delete expense
export const useDeleteExpense = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      toast.success('Expense deleted successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push('/splitzone/expenses');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to delete expense');
    },
  });
};

// Mark split as paid
export const useMarkSplitPaid = (expenseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkSplitPaidData) => expenseApi.markSplitAsPaid(expenseId, data),
    onSuccess: (response) => {
      toast.success('Payment marked successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenseDetail(expenseId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to mark payment');
    },
  });
};

// Approve expense
export const useApproveExpense = (expenseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApproveExpenseData) => expenseApi.approveExpense(expenseId, data),
    onSuccess: (response, variables) => {
      toast.success(variables.isApproved ? 'Expense approved successfully!' : 'Expense rejected');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenseDetail(expenseId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.expenses() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to process approval');
    },
  });
};

// ==================== SETTLEMENT HOOKS ====================

// Create settlement
export const useCreateSettlement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSettlementData) => settlementApi.create(data),
    onSuccess: (response) => {
      toast.success('Payment recorded successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlements() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push(`/splitzone/settlements/${response.data._id}`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to record payment');
    },
  });
};

// Get settlements
export const useSettlements = (filters?: SettlementFilters) => {
  return useQuery({
    queryKey: splitZoneKeys.settlementsList(filters),
    queryFn: () => settlementApi.getAll(filters),
    staleTime: 30000,
  });
};

// Get settlement by ID
export const useSettlement = (id: string) => {
  return useQuery({
    queryKey: splitZoneKeys.settlementDetail(id),
    queryFn: () => settlementApi.getById(id),
    enabled: !!id,
  });
};

// Get settlement suggestions
export const useSettlementSuggestions = (groupId: string, simplify = true) => {
  return useQuery({
    queryKey: splitZoneKeys.settlementSuggestions(groupId, simplify),
    queryFn: () => settlementApi.getSuggestions(groupId, simplify),
    enabled: !!groupId,
    staleTime: 30000,
  });
};

// Update settlement
export const useUpdateSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSettlementData }) =>
      settlementApi.update(id, data),
    onSuccess: (response, variables) => {
      toast.success('Settlement updated successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlementDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlements() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to update settlement');
    },
  });
};

// Confirm settlement
export const useConfirmSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settlementApi.confirm(id),
    onSuccess: (response) => {
      toast.success('Payment confirmed!');
      queryClient.invalidateQueries({
        queryKey: splitZoneKeys.settlementDetail(response.data._id),
      });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlements() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to confirm payment');
    },
  });
};

// Reject settlement
export const useRejectSettlement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      settlementApi.reject(id, reason),
    onSuccess: (response) => {
      toast.success('Payment rejected');
      queryClient.invalidateQueries({
        queryKey: splitZoneKeys.settlementDetail(response.data._id),
      });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlements() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groupDetail(response.data.groupId) });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to reject payment');
    },
  });
};

// Delete settlement
export const useDeleteSettlement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settlementApi.delete(id),
    onSuccess: () => {
      toast.success('Settlement deleted successfully!');
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.settlements() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.groups() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userBalances() });
      queryClient.invalidateQueries({ queryKey: splitZoneKeys.userDashboard() });
      router.push('/splitzone/settlements');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to delete settlement');
    },
  });
};
