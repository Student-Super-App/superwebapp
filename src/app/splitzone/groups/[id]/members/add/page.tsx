'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useGroup, useAddMember, useSearchUsers } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { MEMBER_ROLES, type MemberRole, type AddMemberData } from '@/types/splitzone';

export default function AddMemberPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;

  const { data: groupData, isLoading: groupLoading } = useGroup(groupId);
  const addMember = useAddMember(groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member');

  const { data: searchResults, isLoading: searchLoading } = useSearchUsers({
    q: searchQuery,
    limit: 10,
  });

  const group = groupData?.data;
  const users = searchResults?.data || [];

  // Filter out users who are already members
  const availableUsers = users.filter(
    (user) => !group?.members.some((m) => m.userId === user.userId)
  );

  const selectedUser = users.find((u) => u.userId === selectedUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    const memberData: AddMemberData = {
      userId: selectedUser.userId,
      userName: selectedUser.userName,
      email: selectedUser.email,
      role: selectedRole,
    };

    addMember.mutate(memberData);
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (groupLoading) {
    return <AddMemberPageSkeleton />;
  }

  if (!group) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-slate-500 dark:text-slate-400">Group not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Member</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Add a new member to {group.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Users */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Search Users</h2>

          <div className="space-y-2">
            <Label htmlFor="search">Find by name or email</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type at least 2 characters to search
              </p>
            )}
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : availableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No users found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                availableUsers.map((user) => (
                  <button
                    key={user.userId}
                    type="button"
                    onClick={() => setSelectedUserId(user.userId)}
                    className={`w-full p-4 text-left rounded-lg transition-colors ${
                      selectedUserId === user.userId
                        ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.userName} email={user.email} size="md" />
                      <div className="flex-1">
                        <p className="font-medium">{user.userName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                      {selectedUserId === user.userId && (
                        <div className="text-blue-600 dark:text-blue-400">✓</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </Card>

        {/* Selected User & Role */}
        {selectedUser && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Member Details</h2>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-3">
                <UserAvatar name={selectedUser.userName} email={selectedUser.email} size="lg" />
                <div>
                  <p className="font-medium text-lg">{selectedUser.userName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: MemberRole) => setSelectedRole(value)}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ROLES.filter((r) => r !== 'creator').map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedRole === 'admin'
                  ? 'Admins can manage group settings and expenses'
                  : 'Members can view and participate in expenses'}
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href={`/splitzone/groups/${groupId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!selectedUser || addMember.isPending}>
            <UserPlus className="h-4 w-4 mr-2" />
            {addMember.isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AddMemberPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
