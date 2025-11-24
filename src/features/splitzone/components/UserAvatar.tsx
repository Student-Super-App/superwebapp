'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export function UserAvatar({ name, email, size = 'md', className }: UserAvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold text-white',
        sizeClasses[size],
        getColorFromString(email || name),
        className
      )}
      title={email || name}
    >
      {getInitials(name)}
    </div>
  );
}
