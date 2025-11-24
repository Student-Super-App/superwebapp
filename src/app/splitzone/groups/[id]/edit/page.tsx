'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGroup, useUpdateGroup } from '@/features/splitzone/hooks';
import {
  GROUP_CATEGORIES,
  CURRENCIES,
  type GroupCategory,
  type Currency,
  type UpdateGroupData,
} from '@/types/splitzone';

export default function EditGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;

  const { data, isLoading } = useGroup(groupId);
  const updateGroup = useUpdateGroup(groupId);

  const group = data?.data;

  const [formData, setFormData] = useState<UpdateGroupData>({
    name: '',
    description: '',
    category: 'other' as GroupCategory,
    currency: 'USD' as Currency,
    settings: {
      simplifyDebts: true,
      allowMemberToAddExpense: true,
      allowMemberToInvite: false,
      requireApprovalForExpense: false,
    },
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        category: group.category,
        currency: group.currency,
        settings: group.settings,
      });
    }
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateGroup.mutate(formData);
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return <EditGroupPageSkeleton />;
  }

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-slate-500 dark:text-slate-400">Group not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Group</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Update group details and settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Apartment 4B"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this group for?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: GroupCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: Currency) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Group Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Group Settings</h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="simplifyDebts" className="font-medium">
                  Simplify Debts
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Minimize the number of transactions needed to settle debts
                </p>
              </div>
              <input
                id="simplifyDebts"
                type="checkbox"
                checked={formData.settings?.simplifyDebts ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, simplifyDebts: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="allowMemberToAddExpense" className="font-medium">
                  Members Can Add Expenses
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Allow all members to add expenses to the group
                </p>
              </div>
              <input
                id="allowMemberToAddExpense"
                type="checkbox"
                checked={formData.settings?.allowMemberToAddExpense ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      allowMemberToAddExpense: e.target.checked,
                    },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="allowMemberToInvite" className="font-medium">
                  Members Can Invite
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Allow members to invite other users to the group
                </p>
              </div>
              <input
                id="allowMemberToInvite"
                type="checkbox"
                checked={formData.settings?.allowMemberToInvite ?? false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: { ...formData.settings, allowMemberToInvite: e.target.checked },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label htmlFor="requireApprovalForExpense" className="font-medium">
                  Require Approval for Expenses
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  New expenses must be approved by group creator/admin
                </p>
              </div>
              <input
                id="requireApprovalForExpense"
                type="checkbox"
                checked={formData.settings?.requireApprovalForExpense ?? false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      requireApprovalForExpense: e.target.checked,
                    },
                  })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href={`/splitzone/groups/${groupId}`}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={!formData.name || updateGroup.isPending}>
            {updateGroup.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function EditGroupPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </Card>

      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
