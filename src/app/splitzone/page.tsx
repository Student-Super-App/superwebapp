'use client';

import { useDashboard } from '@/features/splitzone/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import {
  Users,
  Receipt,
  TrendingUp,
  TrendingDown,
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity as ActivityIcon,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SplitZoneDashboard() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load dashboard'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const dashboard = data?.data;
  console.log('Dashboard Data', dashboard);

  if (!dashboard) return null;

  const { user, balances, recentActivity } = dashboard;
  const { youOwe, youAreOwed, summary } = balances;
  const stats = user?.stats || {
    totalGroups: 0,
    totalExpenses: 0,
    totalSpent: 0,
    totalOwed: 0,
    totalOwing: 0,
  };

  // Calculate active groups (groups with activity in last 30 days)
  const activeGroups = stats.totalGroups; // You can refine this based on lastActiveAt if needed

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            SplitZone Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your expenses and settle up with friends
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/splitzone/expenses/new">
            <Button className="w-full h-20 text-lg bg-emerald-600 hover:bg-emerald-700" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Expense
            </Button>
          </Link>
          <Link href="/splitzone/groups/new">
            <Button className="w-full h-20 text-lg" variant="outline" size="lg">
              <Users className="mr-2 h-5 w-5" />
              Create Group
            </Button>
          </Link>
          <Link href="/splitzone/settlements/new">
            <Button className="w-full h-20 text-lg" variant="outline" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              Record Payment
            </Button>
          </Link>
        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance */}
          <Card
            className={`border-2 ${
              summary.netBalance > 0
                ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20'
                : summary.netBalance < 0
                ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
                : 'border-slate-200'
            }`}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-3xl font-bold ${
                      summary.netBalance > 0
                        ? 'text-emerald-600'
                        : summary.netBalance < 0
                        ? 'text-orange-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {formatCurrency(Math.abs(summary.netBalance), 'INR')}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {summary.netBalance > 0
                      ? 'You are owed'
                      : summary.netBalance < 0
                      ? 'You owe'
                      : 'All settled up!'}
                  </p>
                </div>
                {summary.netBalance > 0 ? (
                  <TrendingUp className="h-10 w-10 text-emerald-600" />
                ) : summary.netBalance < 0 ? (
                  <TrendingDown className="h-10 w-10 text-orange-600" />
                ) : (
                  <DollarSign className="h-10 w-10 text-slate-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* You Owe */}
          <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                You Owe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(summary.totalOwing, 'INR')}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {youOwe.length} {youOwe.length === 1 ? 'person' : 'people'}
              </p>
            </CardContent>
          </Card>

          {/* You Are Owed */}
          <Card className="border-2 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                You Are Owed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {formatCurrency(summary.totalOwed, 'INR')}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {youAreOwed.length} {youAreOwed.length === 1 ? 'person' : 'people'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Balances Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Your Balances
              </CardTitle>
              <CardDescription>Detailed breakdown of who owes what</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {youOwe.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-orange-600 mb-3 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    You owe ({youOwe.length})
                  </h3>
                  <div className="space-y-2">
                    {youOwe.map((balance, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            {balance.userName}
                          </p>
                          {balance.groupName && (
                            <p className="text-xs text-slate-500">{balance.groupName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            {formatCurrency(balance.amount, balance.currency)}
                          </p>
                          <Link href={`/splitzone/settlements/new?payTo=${balance.userId}`}>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Settle up
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {youAreOwed.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    You are owed ({youAreOwed.length})
                  </h3>
                  <div className="space-y-2">
                    {youAreOwed.map((balance, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            {balance.userName}
                          </p>
                          {balance.groupName && (
                            <p className="text-xs text-slate-500">{balance.groupName}</p>
                          )}
                        </div>
                        <p className="font-bold text-emerald-600">
                          {formatCurrency(balance.amount, balance.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {youOwe.length === 0 && youAreOwed.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>All settled up! 🎉</p>
                  <p className="text-sm mt-1">No outstanding balances</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ActivityIcon className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your groups</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 8).map((activity) => (
                    <div
                      key={activity._id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <Receipt className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 dark:text-slate-50">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                      {activity.amount && (
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          {formatCurrency(activity.amount, activity.currency || 'USD')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <ActivityIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Start by adding an expense</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard icon={Users} label="Total Groups" value={stats.totalGroups} color="blue" />
          <StatCard
            icon={Receipt}
            label="Total Expenses"
            value={stats.totalExpenses}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={formatCurrency(stats.totalSpent, 'INR')}
            color="green"
          />
          <StatCard
            icon={ActivityIcon}
            label="Active Groups"
            value={stats.totalGroups}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600',
    purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600',
    green: 'bg-green-50 dark:bg-green-950/20 text-green-600',
    orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Skeleton className="h-12 w-64 mb-2" />
      <Skeleton className="h-6 w-96 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
