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
import { useCreateSettlement, useGroups, useGroupBalances } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { PAYMENT_METHODS, type PaymentMethod, type CreateSettlementData } from '@/types/splitzone';

export default function NewSettlementPage() {
  const router = useRouter();
  const { data: groupsData } = useGroups();
  const createSettlement = useCreateSettlement();

  const groups = groupsData?.data || [];
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedPayer, setSelectedPayer] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '' as PaymentMethod | '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const { data: balancesData } = useGroupBalances(selectedGroup);
  const balances = balancesData?.data || [];

  const selectedGroupData = groups.find((g) => g._id === selectedGroup);
  const members = selectedGroupData?.members || [];
  const payerData = members.find((m) => m.userId === selectedPayer);
  const recipientData = members.find((m) => m.userId === selectedRecipient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroup || !payerData || !recipientData || !formData.amount) {
      return;
    }

    const settlementData: CreateSettlementData = {
      groupId: selectedGroup,
      payer: {
        userId: payerData.userId,
        userName: payerData.userName,
        email: payerData.email,
      },
      recipient: {
        userId: recipientData.userId,
        userName: recipientData.userName,
        email: recipientData.email,
      },
      amount: parseFloat(formData.amount),
      currency: selectedGroupData?.currency || 'USD',
      paymentMethod: formData.paymentMethod || undefined,
      paymentDate: formData.paymentDate,
      notes: formData.notes || undefined,
    };

    createSettlement.mutate(settlementData);
  };

  const getPaymentMethodLabel = (method: string) => {
    return method
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Get suggested amount based on balances
  const getSuggestedPayments = () => {
    if (!balances.length) return [];

    const payments: Array<{
      fromUserId: string;
      fromUserName: string;
      toUserId: string;
      toUserName: string;
      amount: number;
    }> = [];

    balances.forEach((userBalance) => {
      userBalance.balances.owesTo.forEach((debt) => {
        payments.push({
          fromUserId: userBalance.userId,
          fromUserName: userBalance.userName,
          toUserId: debt.userId,
          toUserName: debt.userName,
          amount: debt.amount,
        });
      });
    });

    return payments;
  };

  const suggestedPayments = getSuggestedPayments();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Record Payment</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Record a payment settlement between group members
          </p>
        </div>
      </div>

      {/* Suggested Payments */}
      {selectedGroup && suggestedPayments.length > 0 && !selectedPayer && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Suggested Payments</h2>
          <div className="space-y-2">
            {suggestedPayments.slice(0, 5).map((payment, index) => (
              <button
                key={`${payment.fromUserId}-${payment.toUserId}-${index}`}
                onClick={() => {
                  setSelectedPayer(payment.fromUserId);
                  setSelectedRecipient(payment.toUserId);
                  setFormData({ ...formData, amount: payment.amount.toString() });
                }}
                className="w-full p-3 text-left bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={payment.fromUserName} size="sm" />
                    <span className="text-xl">→</span>
                    <UserAvatar name={payment.toUserName} size="sm" />
                    <span className="font-medium">
                      {payment.fromUserName} pays {payment.toUserName}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ${payment.amount.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <Link href={`/splitzone/settlements/suggest/${selectedGroup}`}>
            <Button variant="outline" className="w-full">
              View All Suggestions
            </Button>
          </Link>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Details */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>

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

          {selectedGroup && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payer">Payer *</Label>
                  <Select value={selectedPayer} onValueChange={setSelectedPayer} required>
                    <SelectTrigger id="payer">
                      <SelectValue placeholder="Who is paying?" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem
                          key={member.userId}
                          value={member.userId}
                          disabled={member.userId === selectedRecipient}
                        >
                          {member.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Who is receiving?" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem
                          key={member.userId}
                          value={member.userId}
                          disabled={member.userId === selectedPayer}
                        >
                          {member.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedPayer &&
                selectedRecipient &&
                suggestedPayments.some(
                  (p) => p.fromUserId === selectedPayer && p.toUserId === selectedRecipient
                ) && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Suggested amount:{' '}
                      <span className="font-bold">
                        $
                        {suggestedPayments
                          .find(
                            (p) =>
                              p.fromUserId === selectedPayer && p.toUserId === selectedRecipient
                          )
                          ?.amount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                  />
                </div>
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
                <Label htmlFor="proof">Proof of Payment (optional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('proof')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {proofFile ? proofFile.name : 'Upload Proof'}
                  </Button>
                  {proofFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setProofFile(null)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/splitzone/settlements">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              !selectedGroup ||
              !selectedPayer ||
              !selectedRecipient ||
              !formData.amount ||
              createSettlement.isPending
            }
          >
            {createSettlement.isPending ? 'Recording...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
