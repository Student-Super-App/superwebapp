'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ExpenseSplit, type SplitMethod } from '@/types/splitzone';

interface SplitCalculatorProps {
  totalAmount: number;
  participants: Array<{ userId: string; userName: string; email: string }>;
  paidBy: { userId: string; userName: string; email: string };
  onSplitsChange: (splits: ExpenseSplit[]) => void;
  initialSplits?: ExpenseSplit[];
}

export function SplitCalculator({
  totalAmount,
  participants,
  paidBy,
  onSplitsChange,
  initialSplits,
}: SplitCalculatorProps) {
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [splits, setSplits] = useState<ExpenseSplit[]>([]);

  const recalculateFromShares = (currentSplits: ExpenseSplit[]) => {
    const totalShares = currentSplits.reduce((sum, s) => sum + (s.shares || 0), 0);
    if (totalShares === 0) {
      setSplits(currentSplits);
      return;
    }

    const newSplits = currentSplits.map((s) => ({
      ...s,
      amount: parseFloat(((totalAmount * (s.shares || 0)) / totalShares).toFixed(2)),
      percentage: parseFloat((((s.shares || 0) / totalShares) * 100).toFixed(2)),
    }));
    setSplits(newSplits);
  };

  const calculateSplits = (method: SplitMethod) => {
    if (participants.length === 0 || totalAmount <= 0) {
      setSplits([]);
      return;
    }

    let newSplits: ExpenseSplit[] = [];

    switch (method) {
      case 'equal':
        const equalAmount = totalAmount / participants.length;
        newSplits = participants.map((p) => ({
          userId: p.userId,
          userName: p.userName,
          amount: parseFloat(equalAmount.toFixed(2)),
          percentage: parseFloat((100 / participants.length).toFixed(2)),
          shares: 1,
          isPaid: p.userId === paidBy.userId,
        }));
        break;

      case 'exact':
        newSplits = participants.map((p) => ({
          userId: p.userId,
          userName: p.userName,
          amount: 0,
          percentage: 0,
          shares: 0,
          isPaid: p.userId === paidBy.userId,
        }));
        break;

      case 'percentage':
        newSplits = participants.map((p) => ({
          userId: p.userId,
          userName: p.userName,
          amount: 0,
          percentage: 0,
          shares: 0,
          isPaid: p.userId === paidBy.userId,
        }));
        break;

      case 'shares':
        newSplits = participants.map((p) => ({
          userId: p.userId,
          userName: p.userName,
          amount: 0,
          percentage: 0,
          shares: 1,
          isPaid: p.userId === paidBy.userId,
        }));
        recalculateFromShares(newSplits);
        return;
    }

    setSplits(newSplits);
  };

  useEffect(() => {
    if (initialSplits && initialSplits.length > 0) {
      setSplits(initialSplits);
    } else {
      calculateSplits(splitMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateSplits(splitMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, totalAmount, splitMethod]);

  useEffect(() => {
    onSplitsChange(splits);
  }, [splits, onSplitsChange]);

  const updateExactAmount = (userId: string, amount: number) => {
    const newSplits = splits.map((s) =>
      s.userId === userId ? { ...s, amount: parseFloat(amount.toFixed(2)) } : s
    );
    setSplits(newSplits);
  };

  const updatePercentage = (userId: string, percentage: number) => {
    const newSplits = splits.map((s) =>
      s.userId === userId
        ? {
            ...s,
            percentage: parseFloat(percentage.toFixed(2)),
            amount: parseFloat(((totalAmount * percentage) / 100).toFixed(2)),
          }
        : s
    );
    setSplits(newSplits);
  };

  const updateShares = (userId: string, shares: number) => {
    const newSplits = splits.map((s) => (s.userId === userId ? { ...s, shares } : s));
    recalculateFromShares(newSplits);
  };

  const getTotalSplit = () => {
    return splits.reduce((sum, s) => sum + s.amount, 0);
  };

  const getTotalPercentage = () => {
    return splits.reduce((sum, s) => sum + (s.percentage || 0), 0);
  };

  const isValid = () => {
    const total = getTotalSplit();
    return Math.abs(total - totalAmount) < 0.01;
  };

  return (
    <div className="space-y-4">
      <Tabs value={splitMethod} onValueChange={(v: string) => setSplitMethod(v as SplitMethod)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="equal">Equal</TabsTrigger>
          <TabsTrigger value="exact">Exact</TabsTrigger>
          <TabsTrigger value="percentage">%</TabsTrigger>
          <TabsTrigger value="shares">Shares</TabsTrigger>
        </TabsList>

        <TabsContent value="equal" className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Split equally among {participants.length} people
          </p>
          {splits.map((split) => (
            <div
              key={split.userId}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md"
            >
              <div>
                <p className="font-medium">{split.userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{split.userName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${split.amount.toFixed(2)}</p>
                {split.isPaid && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Paid</p>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="exact" className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter exact amounts for each person
          </p>
          {splits.map((split) => (
            <div key={split.userId} className="space-y-2">
              <Label>{split.userName}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={totalAmount}
                  value={split.amount}
                  onChange={(e) => updateExactAmount(split.userId, parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
                {split.isPaid && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Paid</span>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
            <span className="font-medium">Total Split</span>
            <span className={`font-semibold ${isValid() ? 'text-emerald-600' : 'text-red-600'}`}>
              ${getTotalSplit().toFixed(2)} / ${totalAmount.toFixed(2)}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="percentage" className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter percentage for each person
          </p>
          {splits.map((split) => (
            <div key={split.userId} className="space-y-2">
              <Label>{split.userName}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={split.percentage}
                  onChange={(e) => updatePercentage(split.userId, parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-20 text-right">
                  ${split.amount.toFixed(2)}
                </span>
                {split.isPaid && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Paid</span>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
            <span className="font-medium">Total</span>
            <span
              className={`font-semibold ${
                getTotalPercentage() === 100 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {getTotalPercentage().toFixed(2)}%
            </span>
          </div>
        </TabsContent>

        <TabsContent value="shares" className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter shares for each person (e.g., 1, 2, 3)
          </p>
          {splits.map((split) => (
            <div key={split.userId} className="space-y-2">
              <Label>{split.userName}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  value={split.shares}
                  onChange={(e) => updateShares(split.userId, parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">shares =</span>
                <span className="text-sm font-medium flex-1">
                  ${split.amount.toFixed(2)} ({split.percentage?.toFixed(1)}%)
                </span>
                {split.isPaid && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Paid</span>
                )}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {!isValid() && splitMethod !== 'equal' && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">
            Split amounts don&apos;t match total expense amount
          </p>
        </div>
      )}
    </div>
  );
}
