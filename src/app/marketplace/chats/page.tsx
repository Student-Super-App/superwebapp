'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChats } from '@/features/marketplace/hooks';
import { useAppSelector } from '@/store/hooks';
import { MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function ChatsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all');
  
  const { data, isLoading } = useChats({});
  const chats = data?.data || [];

  const filteredChats = chats.filter((chat) => {
    if (filter === 'buying') return chat.buyer?._id === user?._id;
    if (filter === 'selling') return chat.seller?._id === user?._id;
    return true;
  });

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    My Chats
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {filteredChats.length} conversation{filteredChats.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={
                    filter === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'dark:bg-gray-700 dark:border-gray-600'
                    }
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'buying' ? 'default' : 'outline'}
                    onClick={() => setFilter('buying')}
                    className={
                      filter === 'buying'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'dark:bg-gray-700 dark:border-gray-600'
                    }
                  >
                    Buying
                  </Button>
                  <Button
                    variant={filter === 'selling' ? 'default' : 'outline'}
                    onClick={() => setFilter('selling')}
                    className={
                      filter === 'selling'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'dark:bg-gray-700 dark:border-gray-600'
                    }
                  >
                    Selling
                  </Button>
                </div>
              </div>

              {/* Chats List */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4 dark:bg-gray-800 dark:border-gray-700">
                      <div className="animate-pulse flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredChats.length === 0 ? (
                <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Chats Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start a conversation by contacting a seller!
                  </p>
                  <Link href="/marketplace">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Browse Marketplace
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredChats.map((chat) => {
                    const isBuyer = chat.buyer?._id === user?._id;
                    const otherUser = isBuyer ? chat.seller : chat.buyer;
                    
                    return (
                      <Link key={chat._id} href={`/marketplace/chats/${chat._id}`}>
                        <Card className="p-4 hover:shadow-lg transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500 cursor-pointer">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                              {chat.product.images && chat.product.images.length > 0 ? (
                                <Image
                                  src={chat.product.images[0]}
                                  alt={chat.product.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Chat Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {chat.product.title}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {isBuyer ? 'Seller' : 'Buyer'}: {otherUser.firstName} {otherUser.lastName}
                                  </p>
                                </div>
                                {chat.unreadCount > 0 && (
                                  <Badge className="bg-blue-600 text-white">
                                    {chat.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              
                              {chat.lastMessage && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {chat.lastMessage.messageType === 'image' ? '📷 Image' : chat.lastMessage.message}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="dark:border-gray-600">
                                  ${chat.product.price.toFixed(2)}
                                </Badge>
                                <Badge
                                  variant={chat.product.isAvailable ? 'default' : 'secondary'}
                                  className={
                                    chat.product.isAvailable
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : ''
                                  }
                                >
                                  {chat.product.isAvailable ? 'Available' : 'Sold'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
        </main>
      </div>
    </AuthGuard>
  );
}
