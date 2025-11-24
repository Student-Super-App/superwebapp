'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGroup } from '@/features/splitzone/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import type { CreateGroupData, GroupCategory, Currency } from '@/types/splitzone';

export default function NewGroupPage() {
  const router = useRouter();
  const createGroupMutation = useCreateGroup();

  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    category: 'apartment',
    currency: 'USD',
    settings: {
      simplifyDebts: true,
      allowMemberToAddExpense: true,
      allowMemberToInvite: false,
      requireApprovalForExpense: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGroupMutation.mutateAsync(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
          <CardDescription>Set up a group to track shared expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Apartment 4B"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What's this group for?"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as GroupCategory })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="trip">Trip</option>
                <option value="event">Event</option>
                <option value="couple">Couple</option>
                <option value="project">Project</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CNY">CNY - Chinese Yuan</option>
              </select>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="font-medium">Group Settings</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="simplifyDebts">Simplify Debts</Label>
                  <p className="text-sm text-slate-500">Minimize number of transactions</p>
                </div>
                <input
                  id="simplifyDebts"
                  type="checkbox"
                  checked={formData.settings?.simplifyDebts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: { ...formData.settings!, simplifyDebts: e.target.checked },
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowMemberToAddExpense">Members Can Add Expenses</Label>
                  <p className="text-sm text-slate-500">Allow all members to add expenses</p>
                </div>
                <input
                  id="allowMemberToAddExpense"
                  type="checkbox"
                  checked={formData.settings?.allowMemberToAddExpense}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        allowMemberToAddExpense: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireApprovalForExpense">Require Approval</Label>
                  <p className="text-sm text-slate-500">Admin must approve expenses</p>
                </div>
                <input
                  id="requireApprovalForExpense"
                  type="checkbox"
                  checked={formData.settings?.requireApprovalForExpense}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings!,
                        requireApprovalForExpense: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createGroupMutation.isPending}>
                {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
