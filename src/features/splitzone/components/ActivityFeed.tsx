'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { UserAvatar } from './UserAvatar';
import { formatDate } from '@/lib/utils';
import { Activity } from '@/types/splitzone';
import {
  Receipt,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  Edit,
  Trash,
} from 'lucide-react';

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  showGroup?: boolean;
}

export function ActivityFeed({ activities, maxItems }: ActivityFeedProps) {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense_created':
      case 'expense_updated':
        return Receipt;
      case 'group_created':
      case 'group_updated':
        return Users;
      case 'settlement_created':
      case 'settlement_confirmed':
        return DollarSign;
      case 'settlement_rejected':
      case 'expense_rejected':
        return XCircle;
      case 'expense_approved':
        return CheckCircle;
      case 'member_added':
        return UserPlus;
      case 'member_removed':
        return UserMinus;
      case 'expense_deleted':
      case 'group_deleted':
      case 'settlement_deleted':
        return Trash;
      default:
        return Edit;
    }
  };

  const getActivityColor = (type: string) => {
    if (type.includes('created') || type.includes('added'))
      return 'text-emerald-600 dark:text-emerald-400';
    if (type.includes('deleted') || type.includes('removed') || type.includes('rejected'))
      return 'text-red-600 dark:text-red-400';
    if (type.includes('confirmed') || type.includes('approved'))
      return 'text-blue-600 dark:text-blue-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  if (displayActivities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        const actorName = activity.actor?.userName || 'Someone';

        return (
          <Card key={activity._id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <UserAvatar name={actorName} email={activity.actor?.userId || ''} size="sm" />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: activity.description }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon className={cn('h-4 w-4', getActivityColor(activity.type))} />
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(activity.timestamp)}
                    </span>
                  </div>
                </div>

                {activity.relatedEntities?.expenseId && (
                  <Link
                    href={`/splitzone/expenses/${activity.relatedEntities.expenseId}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                  >
                    View expense →
                  </Link>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
