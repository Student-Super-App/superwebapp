'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, GraduationCap, Calendar, Save } from 'lucide-react';
import { useUserProfile, useUpdateProfile } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { formatCurrency } from '@/lib/utils';
import type { UpdateProfileData } from '@/types/splitzone';

export default function ProfilePage() {
  const { data, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();

  const user = data?.data;

  const [formData, setFormData] = useState<UpdateProfileData>({
    userName: user?.userName || '',
    profile: {
      phoneNumber: user?.profile?.phoneNumber || '',
      university: user?.profile?.university || '',
      graduationYear: user?.profile?.graduationYear || undefined,
      bio: user?.profile?.bio || '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <UserAvatar name={user.userName} email={user.email} size="xl" className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold">{user.userName}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {user.stats.totalGroups}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Groups</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {user.stats.totalExpenses}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expenses</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(user.stats.totalSpent, user.settings.defaultCurrency)}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Spent</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(
              Math.abs(user.stats.totalOwed - user.stats.totalOwing),
              user.settings.defaultCurrency
            )}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Net Balance</p>
        </Card>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </h2>

          <div className="space-y-2">
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <Input id="email" value={user.email} disabled className="flex-1" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                value={formData.profile?.phoneNumber || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, phoneNumber: e.target.value },
                  })
                }
                placeholder="+1 (555) 123-4567"
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <Input
                  id="university"
                  value={formData.profile?.university || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: { ...formData.profile, university: e.target.value },
                    })
                  }
                  placeholder="University name"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Input
                  id="graduationYear"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.profile?.graduationYear || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profile: {
                        ...formData.profile,
                        graduationYear: parseInt(e.target.value) || undefined,
                      },
                    })
                  }
                  placeholder="2024"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.profile?.bio || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: { ...formData.profile, bio: e.target.value },
                })
              }
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateProfile.isPending}>
            <Save className="h-5 w-5 mr-2" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </Card>

      <div className="flex justify-end">
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
