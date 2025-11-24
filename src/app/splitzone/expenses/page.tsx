'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Receipt, Users, DollarSign, FileText } from 'lucide-react';
import { useExpenses, useExpenseStats } from '@/features/splitzone/hooks';
import { useGroups } from '@/features/splitzone/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/types/splitzone';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';

export default function ExpensesPage() {
  const [filters, setFilters] = useState({
    groupId: '',
    category: '' as ExpenseCategory | '',
    isSettled: '',
    search: '',
  });

  // Convert filters for API
  const apiFilters: ExpenseFilters = {
    groupId: filters.groupId || undefined,
    category: filters.category || undefined,
    isSettled: filters.isSettled ? filters.isSettled === 'true' : undefined,
  };

  const { data: expensesData, isLoading } = useExpenses(apiFilters);
  const { data: statsData } = useExpenseStats(filters.groupId || undefined);
  const { data: groupsData } = useGroups();

  const expenses = expensesData?.data || [];
  const stats = statsData?.data;
  const groups = groupsData?.data || [];

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      groceries: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      rent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      utilities: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      transportation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      shopping: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      travel: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      education: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      other: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return <ExpensesPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and manage all your shared expenses
          </p>
        </div>
        <Link href="/splitzone/expenses/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Expenses</p>
                <p className="text-2xl font-bold">{stats.totalExpenses}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount, 'INR')}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">By Category</p>
                <p className="text-2xl font-bold">{stats.byCategory.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Select
              value={filters.groupId}
              onValueChange={(value: string) => setFilters({ ...filters, groupId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.category}
              onValueChange={(value: string) =>
                setFilters({ ...filters, category: value === '' ? '' : (value as ExpenseCategory) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.isSettled}
              onValueChange={(value: string) => setFilters({ ...filters, isSettled: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="true">Settled</SelectItem>
                <SelectItem value="false">Unsettled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Start tracking shared expenses with your groups
          </p>
          <Link href="/splitzone/expenses/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Expense
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {expenses.map((expense) => (
            <Link key={expense._id} href={`/splitzone/expenses/${expense._id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <UserAvatar
                      name={expense.paidBy.userName}
                      email={expense.paidBy.email}
                      size="md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{expense.description}</h3>
                        <Badge className={getCategoryColor(expense.category)}>
                          {getCategoryLabel(expense.category)}
                        </Badge>
                        {expense.isSettled && (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                            Settled
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>Paid by {expense.paidBy.userName}</span>
                        <span>•</span>
                        <span>{formatDate(expense.expenseDate)}</span>
                        <span>•</span>
                        <span>{expense.splits.length} people</span>
                        {expense.groupId && (
                          <>
                            <span>•</span>
                            <span className="truncate">
                              {expense.group?.name || 'Unknown Group'}
                            </span>
                          </>
                        )}
                      </div>

                      {expense.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(expense.totalAmount, expense.currency)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Your share:{' '}
                      {formatCurrency(
                        expense.splits.find((s) => s.userId === expense.paidBy.userId)?.amount || 0,
                        expense.currency
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpensesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <Skeleton className="h-10 w-full" />
      </Card>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
