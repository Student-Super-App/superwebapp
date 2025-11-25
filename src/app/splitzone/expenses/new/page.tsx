'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useCreateExpense, useGroups } from '@/features/splitzone/hooks';
import { SplitCalculator } from '@/features/splitzone/components/SplitCalculator';
import {
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  type ExpenseCategory,
  type PaymentMethod,
  type ExpenseSplit,
  type CreateExpenseData,
} from '@/types/splitzone';

export default function NewExpensePage() {
  const router = useRouter();
  const { data: groupsData } = useGroups();
  const createExpense = useCreateExpense();

  const groups = groupsData?.data || [];
  const [selectedGroup, setSelectedGroup] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    category: '' as ExpenseCategory | '',
    paymentMethod: '' as PaymentMethod | '',
    expenseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [splits, setSplits] = useState<ExpenseSplit[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const selectedGroupData = groups.find((g) => g._id === selectedGroup);
  const participants = selectedGroupData?.members || [];
  const currentUser = participants.find((m) => m.role === 'creator') || participants[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroup || !formData.description || !formData.totalAmount || !formData.category) {
      return;
    }

    if (splits.length === 0) {
      return;
    }

    const expenseData: CreateExpenseData = {
      groupId: selectedGroup,
      description: formData.description,
      totalAmount: parseFloat(formData.totalAmount),
      category: formData.category,
      currency: selectedGroupData?.currency || 'USD',
      paidBy: {
        userId: currentUser?.userId || '',
        userName: currentUser?.userName || '',
        email: currentUser?.email || '',
      },
      splits: splits,
      splitMethod: splits[0]?.shares
        ? 'shares'
        : splits[0]?.percentage
        ? 'percentage'
        : splits[0]?.amount && splits[0].amount !== 0
        ? 'exact'
        : 'equal',
      expenseDate: formData.expenseDate,
      notes: formData.notes || undefined,
      paymentMethod: formData.paymentMethod || undefined,
    };

    createExpense.mutate(expenseData);
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getPaymentMethodLabel = (method: string) => {
    return method
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Expense</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Record a new shared expense</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="group">Group *</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup} required>
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group._id} value={group._id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value as ExpenseCategory })
                }
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value as PaymentMethod })
                }
              >
                <SelectTrigger id="payment">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {getPaymentMethodLabel(method)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt (optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('receipt')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {receiptFile ? receiptFile.name : 'Upload Receipt'}
              </Button>
              {receiptFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setReceiptFile(null)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Split Calculator */}
        {selectedGroup && formData.totalAmount && currentUser && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Split Details</h2>
            <SplitCalculator
              totalAmount={parseFloat(formData.totalAmount) || 0}
              participants={participants}
              paidBy={currentUser}
              onSplitsChange={setSplits}
            />
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/splitzone/expenses">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              !selectedGroup ||
              !formData.description ||
              !formData.totalAmount ||
              !formData.category ||
              splits.length === 0 ||
              createExpense.isPending
            }
          >
            {createExpense.isPending ? 'Adding...' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
}
