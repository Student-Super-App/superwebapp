'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, Bell, Globe, DollarSign, Save } from 'lucide-react';
import { useUserProfile, useUpdateSettings } from '@/features/splitzone/hooks';
import {
  CURRENCIES,
  LANGUAGES,
  type Currency,
  type Language,
  type UpdateSettingsData,
} from '@/types/splitzone';

export default function SettingsPage() {
  const { data, isLoading } = useUserProfile();
  const updateSettings = useUpdateSettings();

  const user = data?.data;

  const [formData, setFormData] = useState<UpdateSettingsData>({
    defaultCurrency: (user?.settings.defaultCurrency || 'USD') as Currency,
    language: (user?.settings.language || 'en') as Language,
    notifications: {
      email: user?.settings.notifications?.email ?? true,
      push: user?.settings.notifications?.push ?? true,
      newExpense: user?.settings.notifications?.newExpense ?? true,
      paymentReceived: user?.settings.notifications?.paymentReceived ?? true,
      groupInvite: user?.settings.notifications?.groupInvite ?? true,
      expenseReminder: user?.settings.notifications?.expenseReminder ?? true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  const toggleNotification = (key: keyof NonNullable<UpdateSettingsData['notifications']>) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications!,
        [key]: !formData.notifications?.[key],
      },
    });
  };

  if (isLoading) {
    return <SettingsPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Unable to load settings</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your preferences and notification settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preferences */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Preferences
          </h2>

          <div className="space-y-2">
            <Label htmlFor="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Default Currency
            </Label>
            <Select
              value={formData.defaultCurrency}
              onValueChange={(value: Currency) =>
                setFormData({ ...formData, defaultCurrency: value })
              }
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value: Language) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive notifications via email
                </p>
              </div>
              <Button
                type="button"
                variant={formData.notifications?.email ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleNotification('email')}
              >
                {formData.notifications?.email ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Receive browser push notifications
                </p>
              </div>
              <Button
                type="button"
                variant={formData.notifications?.push ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleNotification('push')}
              >
                {formData.notifications?.push ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="font-medium mb-3">Notification Types</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="newExpense" className="font-normal cursor-pointer">
                    New Expense Added
                  </Label>
                  <input
                    id="newExpense"
                    type="checkbox"
                    checked={formData.notifications?.newExpense ?? false}
                    onChange={() => toggleNotification('newExpense')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="paymentReceived" className="font-normal cursor-pointer">
                    Payment Received
                  </Label>
                  <input
                    id="paymentReceived"
                    type="checkbox"
                    checked={formData.notifications?.paymentReceived ?? false}
                    onChange={() => toggleNotification('paymentReceived')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="groupInvite" className="font-normal cursor-pointer">
                    Group Invitations
                  </Label>
                  <input
                    id="groupInvite"
                    type="checkbox"
                    checked={formData.notifications?.groupInvite ?? false}
                    onChange={() => toggleNotification('groupInvite')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="expenseReminder" className="font-normal cursor-pointer">
                    Expense Reminders
                  </Label>
                  <input
                    id="expenseReminder"
                    type="checkbox"
                    checked={formData.notifications?.expenseReminder ?? false}
                    onChange={() => toggleNotification('expenseReminder')}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={updateSettings.isPending}>
            <Save className="h-5 w-5 mr-2" />
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function SettingsPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </Card>

      <div className="flex justify-end">
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
  );
}
