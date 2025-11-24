'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Edit,
  Trash,
  CheckCircle,
  Receipt,
  Calendar,
  CreditCard,
  FileText,
  Download,
} from 'lucide-react';
import { useExpense, useDeleteExpense, useApproveExpense } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expenseId = params?.id as string;

  const { data, isLoading, error } = useExpense(expenseId);
  const deleteExpense = useDeleteExpense();
  const approveExpense = useApproveExpense(expenseId);

  const expense = data?.data;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense.mutate(expenseId);
    }
  };

  const handleApprove = () => {
    approveExpense.mutate({ isApproved: true });
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (isLoading) {
    return <ExpenseDetailSkeleton />;
  }

  if (error || !expense) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>
            Expense not found or you don&apos;t have access to it.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/splitzone/expenses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Expenses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{expense.description}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getCategoryLabel(expense.category)}
              </Badge>
              {expense.isSettled && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                  Settled
                </Badge>
              )}
              {expense.isSettled && (
                <Badge
                  variant="outline"
                  className="bg-emerald-100 text-emerald-600 border-emerald-600"
                >
                  Settled
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/splitzone/expenses/${expenseId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteExpense.isPending}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Amount Card */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Amount</p>
        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(expense.totalAmount, expense.currency)}
        </p>
      </Card>

      {/* Expense Details */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Expense Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Date</p>
              <p className="font-medium">{formatDate(expense.expenseDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Receipt className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Split Method</p>
              <p className="font-medium capitalize">{expense.splitMethod}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <UserAvatar name={expense.paidBy.userName} email={expense.paidBy.email} size="sm" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Paid By</p>
              <p className="font-medium">{expense.paidBy.userName}</p>
            </div>
          </div>
        </div>

        {expense.notes && (
          <div className="pt-4 border-t">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Notes</p>
                <p className="text-slate-700 dark:text-slate-300">{expense.notes}</p>
              </div>
            </div>
          </div>
        )}

        {expense.receipt?.url && (
          <div className="pt-4 border-t">
            <Button variant="outline" asChild>
              <a href={expense.receipt.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                View Receipt
              </a>
            </Button>
          </div>
        )}
      </Card>

      {/* Splits Breakdown */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Split Breakdown</h2>

        <div className="space-y-3">
          {expense.splits.map((split) => (
            <div
              key={split.userId}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <UserAvatar name={split.userName} size="md" />
                <div>
                  <p className="font-medium">{split.userName}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">
                  {formatCurrency(split.amount, expense.currency)}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {split.percentage && <span>{split.percentage.toFixed(1)}%</span>}
                  {split.shares && split.shares > 0 && <span>{split.shares} shares</span>}
                  {split.isPaid && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      Paid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {expense.groupId && (
          <div className="pt-4 border-t">
            <Link href={`/splitzone/groups/${expense.groupId}`}>
              <Button variant="outline" className="w-full">
                View Group Details
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}

function ExpenseDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Card className="p-8">
        <Skeleton className="h-16 w-48 mx-auto" />
      </Card>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </Card>
    </div>
  );
}
