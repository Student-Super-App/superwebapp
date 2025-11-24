'use client';

import { use, useEffect, useRef, useState, useMemo } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChat, useChatMessages, useSendMessage, useMarkAsRead } from '@/features/marketplace/hooks';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeft, Send, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ChatDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: chatData, isLoading: chatLoading } = useChat(id);
  const { data: messagesData, isLoading: messagesLoading } = useChatMessages(id, {});
  const sendMessage = useSendMessage(id);
  const markAsRead = useMarkAsRead(id);

  const [messageText, setMessageText] = useState('');

  const chat = chatData?.data;
  const messages = useMemo(() => messagesData?.data || [], [messagesData?.data]);

  const isBuyer = chat?.buyer?._id === user?._id;
  const otherUser = isBuyer ? chat?.seller : chat?.buyer;

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0 && chat) {
      const unreadIds = messages
        .filter((msg) => !msg.isRead && msg.sender._id !== user?._id)
        .map((msg) => msg._id);
      
      if (unreadIds.length > 0) {
        markAsRead.mutate(unreadIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, user?._id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessage.mutate(
      {
        message: messageText.trim(),
        messageType: 'text',
      },
      {
        onSuccess: () => {
          setMessageText('');
        },
      }
    );
  };

  if (chatLoading || messagesLoading) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
        </main>
      </div>
      </AuthGuard>
    );
  }

  if (!chat || !otherUser) {
    return (
      <AuthGuard>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Card className="p-12 text-center dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Chat Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This conversation doesn&apos;t exist or you don&apos;t have access to it.
                </p>
                <Link href="/marketplace/chats">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Chats
                    </Button>
                  </Link>
                </Card>
              </div>
          </main>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col h-full min-h-screen">
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
            {/* Chat Header */}
            <Card className="p-4 mb-4 dark:bg-gray-800 dark:border-gray-700">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-3 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
                
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/marketplace/${chat.product._id}`}
                    className="relative w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {chat.product.images && chat.product.images.length > 0 ? (
                      <Image
                        src={chat.product.images[0]}
                        alt={chat.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </Link>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/marketplace/${chat.product._id}`}>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                        {chat.product.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400">
                      {isBuyer ? 'Seller' : 'Buyer'}: {otherUser.firstName} {otherUser.lastName}
                    </p>
                    <div className="flex gap-2 mt-2">
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

              {/* Messages Area */}
              <Card className="flex-1 p-4 mb-4 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender._id === user?._id;
                      
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwnMessage
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {message.messageType === 'image' && message.imageUrl ? (
                              <div className="relative w-64 h-48 mb-2">
                                <Image
                                  src={message.imageUrl}
                                  alt="Shared image"
                                  fill
                                  className="object-cover rounded"
                                  sizes="256px"
                                />
                              </div>
                            ) : null}
                            <p className="break-words">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </Card>

              {/* Message Input */}
              <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                    disabled={sendMessage.isPending}
                  />
                  <Button
                    type="submit"
                    disabled={!messageText.trim() || sendMessage.isPending}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </Card>
            </div>
        </main>
      </div>
    </AuthGuard>
  );
}
