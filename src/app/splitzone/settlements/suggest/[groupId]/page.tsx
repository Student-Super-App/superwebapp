'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingDown, Sparkles } from 'lucide-react';
import { useSettlementSuggestions, useGroup } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { formatCurrency } from '@/lib/utils';

export default function SettlementSuggestPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;

  const { data: suggestionsData, isLoading } = useSettlementSuggestions(groupId);
  const { data: groupData } = useGroup(groupId);

  const suggestions = suggestionsData?.data || [];
  const group = groupData?.data;

  if (isLoading) {
    return <SettlementSuggestSkeleton />;
  }

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>Group not found or you don&apos;t have access to it.</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/splitzone/groups">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Settlement Suggestions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Optimized payment plan for {group.name}
          </p>
        </div>
        <Link href={`/splitzone/settlements/new?groupId=${groupId}`}>
          <Button size="lg">Record Payment</Button>
        </Link>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Simplified Debt Settlement
            </h2>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              These suggestions minimize the number of transactions needed to settle all debts in
              the group. Instead of everyone paying everyone, we&apos;ve optimized it to the minimum
              number of payments.
            </p>
          </div>
        </div>
      </Card>

      {/* Suggested Payments */}
      {suggestions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <TrendingDown className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">All Settled Up!</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Everyone in {group.name} is settled up. No payments needed!
          </p>
          <Link href={`/splitzone/groups/${groupId}`}>
            <Button variant="outline">Back to Group</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Suggested Payments ({suggestions.length})</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {group.settings.simplifyDebts ? 'Simplified' : 'Direct'} debts
            </p>
          </div>

          {suggestions.map((suggestion, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={suggestion.from.userName} size="lg" />
                    <div>
                      <p className="font-medium">{suggestion.from.userName}</p>
                    </div>
                  </div>

                  <div className="text-3xl text-emerald-600 dark:text-emerald-400 px-4">→</div>

                  <div className="flex items-center gap-3">
                    <UserAvatar name={suggestion.to.userName} size="lg" />
                    <div>
                      <p className="font-medium">{suggestion.to.userName}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(suggestion.amount, suggestion.currency)}
                  </p>
                  <Link
                    href={`/splitzone/settlements/new?groupId=${groupId}&from=${suggestion.from.userId}&to=${suggestion.to.userId}&amount=${suggestion.amount}`}
                  >
                    <Button size="sm" className="mt-2">
                      Record Payment
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total amount to settle:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatCurrency(
                  suggestions.reduce((sum, s) => sum + s.amount, 0),
                  group.currency
                )}
              </span>
            </p>
            <Link href={`/splitzone/groups/${groupId}`}>
              <Button variant="outline">Back to Group</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SettlementSuggestSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-40" />
      </div>

      <Card className="p-6">
        <Skeleton className="h-20 w-full" />
      </Card>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    </div>
  );
}
