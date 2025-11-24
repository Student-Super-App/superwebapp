'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for users
const mockUsers = [
  { id: '1', name: 'Priyanshu Kumar', initials: 'PK', color: 'bg-blue-500' },
  { id: '2', name: 'Vansh Rana', initials: 'VR', color: 'bg-purple-500' },
  { id: '3', name: 'Ajay singh', initials: 'AJ', color: 'bg-indigo-500' },
  { id: '4', name: 'Shushil Sir', initials: 'SS', color: 'bg-violet-500' },
  { id: '5', name: 'Shivam Jaiswal', initials: 'SJ', color: 'bg-blue-400' },
  { id: '6', name: 'Ajeet Ram', initials: 'AR', color: 'bg-pink-500' },
  { id: '7', name: 'Vikash', initials: 'V', color: 'bg-purple-600' },
  { id: '8', name: 'Priyanshu Kumar', initials: 'PK', color: 'bg-blue-500' },
  { id: '9', name: 'Priyanshu Kumar', initials: 'PK', color: 'bg-blue-500' },
];

export default function ExpensePage() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex overflow-hidden bg-white dark:bg-slate-950" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
        {/* Top Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder=""
              className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/50",
                selectedUser.id === user.id
                  ? "bg-slate-100 dark:bg-slate-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className={cn("text-white font-semibold", user.color)}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Search */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <Input
            type="text"
            placeholder="Search Friend..."
            className="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={cn("text-white font-semibold", selectedUser.color)}>
                {selectedUser.initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {selectedUser.name}
            </span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Empty state - you can add expense messages here */}
            <div className="text-center py-12">
              <p className="text-slate-400 dark:text-slate-500">
                No expenses yet with {selectedUser.name}
              </p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <Input
              type="text"
              placeholder="Add an expense..."
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}