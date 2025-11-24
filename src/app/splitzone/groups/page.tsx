'use client';

import { useGroups } from '@/features/splitzone/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Users, Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { GROUP_CATEGORIES } from '@/types/splitzone';

export default function GroupsPage() {
  const { data, isLoading } = useGroups({ page: 1, limit: 50 });

  const groups = data?.data || [];

  if (isLoading) {
    return <GroupsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Groups</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your expense groups</p>
        </div>
        <Link href="/splitzone/groups/new">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Group
          </Button>
        </Link>
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No groups yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md">
              Create your first group to start tracking shared expenses with friends, roommates, or
              colleagues.
            </p>
            <Link href="/splitzone/groups/new">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Group
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link key={group._id} href={`/splitzone/groups/${group._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {group.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {getCategoryLabel(group.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Members */}
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    {/* Total Amount */}
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{formatCurrency(group.stats.totalAmount, group.currency)} total</span>
                    </div>

                    {/* Expenses Count */}
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span>{group.stats.totalExpenses} expenses</span>
                    </div>

                    {/* Last Activity */}
                    {group.stats.lastActivityAt && (
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Active {formatDate(group.stats.lastActivityAt)}</span>
                      </div>
                    )}

                    {/* Pending Settlements Badge */}
                    {group.stats.pendingSettlements > 0 && (
                      <Badge variant="secondary" className="w-full justify-center">
                        {group.stats.pendingSettlements} pending{' '}
                        {group.stats.pendingSettlements === 1 ? 'settlement' : 'settlements'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryLabel(category: (typeof GROUP_CATEGORIES)[number]): string {
  const labels: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    trip: 'Trip',
    event: 'Event',
    couple: 'Couple',
    project: 'Project',
    other: 'Other',
  };
  return labels[category] || category;
}

function GroupsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-9 w-32 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-11 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
