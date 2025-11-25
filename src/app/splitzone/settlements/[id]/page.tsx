'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, XCircle, Download, Calendar, CreditCard } from 'lucide-react';
import {
  useSettlement,
  useConfirmSettlement,
  useRejectSettlement,
  useDeleteSettlement,
} from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SettlementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const settlementId = params?.id as string;

  const { data, isLoading, error } = useSettlement(settlementId);
  const confirmSettlement = useConfirmSettlement();
  const rejectSettlement = useRejectSettlement();
  const deleteSettlement = useDeleteSettlement();

  const settlement = data?.data;

  const handleConfirm = () => {
    confirmSettlement.mutate(settlementId);
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this settlement?')) {
      rejectSettlement.mutate({ id: settlementId, reason: 'Rejected by user' });
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this settlement?')) {
      deleteSettlement.mutate(settlementId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    return method
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return <SettlementDetailSkeleton />;
  }

  if (error || !settlement) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>Settlement not found or you don't have access to it.</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/splitzone/settlements">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settlements
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Payment Settlement</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(settlement.status)}>{settlement.status}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {settlement.status === 'pending' && (
            <>
              <Button
                onClick={handleConfirm}
                disabled={confirmSettlement.isPending}
                variant="default"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejectSettlement.isPending}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button onClick={handleDelete} disabled={deleteSettlement.isPending} variant="outline">
            Delete
          </Button>
        </div>
      </div>

      {/* Amount Card */}
      <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Payment Amount</p>
        <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(settlement.amount, settlement.currency)}
        </p>
      </Card>

      {/* Payment Flow */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Flow</h2>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <UserAvatar name={settlement.payer.userName} email={settlement.payer.email} size="xl" />
            <p className="font-medium mt-2">{settlement.payer.userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Payer</p>
          </div>

          <div className="text-4xl text-emerald-600 dark:text-emerald-400">→</div>

          <div className="text-center">
            <UserAvatar
              name={settlement.recipient.userName}
              email={settlement.recipient.email}
              size="xl"
            />
            <p className="font-medium mt-2">{settlement.recipient.userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recipient</p>
          </div>
        </div>
      </Card>

      {/* Payment Details */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Payment Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Date</p>
              <p className="font-medium">{formatDate(settlement.settlementDate)}</p>
            </div>
          </div>

          {settlement.paymentMethod && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Payment Method</p>
                <p className="font-medium">{getPaymentMethodLabel(settlement.paymentMethod)}</p>
              </div>
            </div>
          )}

          {settlement.paymentDetails?.transactionId && (
            <div className="col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">Transaction ID</p>
              <p className="font-mono text-sm">{settlement.paymentDetails.transactionId}</p>
            </div>
          )}
        </div>

        {settlement.notes && (
          <div className="pt-4 border-t">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Notes</p>
            <p className="text-slate-700 dark:text-slate-300">{settlement.notes}</p>
          </div>
        )}

        {settlement.proof?.url && (
          <div className="pt-4 border-t">
            <Button variant="outline" asChild>
              <a href={settlement.proof.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                View Proof of Payment
              </a>
            </Button>
          </div>
        )}
      </Card>

      {settlement.group && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Group</h2>
          <Link href={`/splitzone/groups/${settlement.group._id}`}>
            <Button variant="outline" className="w-full">
              View {settlement.group.name}
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

function SettlementDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
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

      <Card className="p-6">
        <Skeleton className="h-32 w-full" />
      </Card>

      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
