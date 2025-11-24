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
import { Plus, DollarSign, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useSettlements, useGroups } from '@/features/splitzone/hooks';
import { UserAvatar } from '@/features/splitzone/components/UserAvatar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { type SettlementStatus } from '@/types/splitzone';

export default function SettlementsPage() {
  const [filters, setFilters] = useState({
    groupId: '',
    status: '' as SettlementStatus | '',
  });

  const { data: settlementsData, isLoading } = useSettlements(filters);
  const { data: groupsData } = useGroups();

  const settlements = settlementsData?.data || [];
  const groups = groupsData?.data || [];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    return method
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return <SettlementsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settlements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and manage all payment settlements
          </p>
        </div>
        <Link href="/splitzone/settlements/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-2xl font-bold">
                {settlements.filter((s) => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Confirmed</p>
              <p className="text-2xl font-bold">
                {settlements.filter((s) => s.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Rejected</p>
              <p className="text-2xl font-bold">
                {settlements.filter((s) => s.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Select
              value={filters.groupId}
              onValueChange={(value) => setFilters({ ...filters, groupId: value })}
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
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value as SettlementStatus })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Settlements List */}
      {settlements.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No settlements yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Record payments to settle up with your group members
          </p>
          <Link href="/splitzone/settlements/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Record Your First Payment
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {settlements.map((settlement) => {
            const StatusIcon = getStatusIcon(settlement.status);

            return (
              <Link key={settlement._id} href={`/splitzone/settlements/${settlement._id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          name={settlement.payer.userName}
                          email={settlement.payer.email}
                          size="md"
                        />
                        <span className="text-2xl">→</span>
                        <UserAvatar
                          name={settlement.recipient.userName}
                          email={settlement.recipient.email}
                          size="md"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">
                            {settlement.payer.userName} paid {settlement.recipient.userName}
                          </p>
                          <Badge className={getStatusColor(settlement.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {settlement.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{formatDate(settlement.paymentDate)}</span>
                          {settlement.paymentMethod && (
                            <>
                              <span>•</span>
                              <span>{getPaymentMethodLabel(settlement.paymentMethod)}</span>
                            </>
                          )}
                          {settlement.groupId && (
                            <>
                              <span>•</span>
                              <span>{settlement.groupId.name}</span>
                            </>
                          )}
                        </div>

                        {settlement.notes && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">
                            {settlement.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(settlement.amount, settlement.currency)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SettlementsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-11 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
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
