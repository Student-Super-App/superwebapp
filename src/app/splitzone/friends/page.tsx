"use client";

import { useState } from "react";
import { useFriends, useFriendRequests, useSearchUsers, useAddFriend, useAcceptFriend, useRejectFriend } from "@/features/splitzone/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  UserPlus, 
  Search, 
  Users, 
  Check, 
  X,
  MessageCircle,
  DollarSign,
  ArrowRight,
  Clock
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: friendsData, isLoading: friendsLoading } = useFriends();
  const { data: requestsData, isLoading: requestsLoading } = useFriendRequests();
  const { data: searchData, isLoading: searchLoading } = useSearchUsers({ q: searchQuery, limit: 10 });
  
  const addFriend = useAddFriend();
  const acceptFriend = useAcceptFriend();
  const rejectFriend = useRejectFriend();

  const friends = friendsData?.data || [];
  const requests = requestsData?.data || [];
  const searchResults = searchData?.data || [];

  const handleAddFriend = (userId: string) => {
    addFriend.mutate({ friendUserId: userId }, {
      onSuccess: () => {
        setSearchQuery("");
      }
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (friendsLoading || requestsLoading) {
    return <FriendsPageSkeleton />;
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Friends</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your friends and split expenses together
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add a Friend</DialogTitle>
                <DialogDescription>
                  Search for users by name or email
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2">
                  {searchLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>{getInitials(user.userName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-50">
                              {user.userName}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFriend(user.userId)}
                          disabled={addFriend.isPending}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-slate-500">
                      No users found
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Start typing to search for users
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Friend Requests */}
        {requests.length > 0 && (
          <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Pending Requests ({requests.length})
              </h2>
            </div>
            
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.fromUser.profilePicture} />
                      <AvatarFallback>{getInitials(request.fromUser.userName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-50">
                        {request.fromUser.userName}
                      </p>
                      <p className="text-xs text-slate-500">{request.fromUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptFriend.mutate(request._id)}
                      disabled={acceptFriend.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectFriend.mutate(request._id)}
                      disabled={rejectFriend.isPending}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Friends List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="owes">They Owe You</TabsTrigger>
            <TabsTrigger value="owed">You Owe Them</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {friends.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  No friends yet
                </h3>
                <p className="text-slate-500 mb-4">
                  Start by adding friends to split expenses with
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Friend
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                  <Card
                    key={friend._id}
                    className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.profilePicture} />
                          <AvatarFallback>{getInitials(friend.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {friend.userName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{friend.email}</p>
                          {friend.university && (
                            <p className="text-xs text-slate-400 truncate">{friend.university}</p>
                          )}
                        </div>
                      </div>

                      {friend.balance !== undefined && friend.balance !== 0 && (
                        <Badge
                          variant={friend.balance > 0 ? "default" : "destructive"}
                          className={friend.balance > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : ""}
                        >
                          {friend.balance > 0 ? "+" : ""}
                          {formatCurrency(Math.abs(friend.balance), "INR")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/splitzone/expenses/new?friend=${friend.userId}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Add Expense
                        </Button>
                      </Link>
                      <Link href={`/splitzone/settlements/new?friend=${friend.userId}`}>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Settle
                        </Button>
                      </Link>
                    </div>

                    {friend.lastExpense && (
                      <div className="mt-3 pt-3 border-t text-xs text-slate-500">
                        Last expense: {formatCurrency(friend.lastExpense.amount, "INR")} on{" "}
                        {new Date(friend.lastExpense.date).toLocaleDateString()}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="owes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends
                .filter((f) => f.balance && f.balance > 0)
                .map((friend) => (
                  <Card key={friend._id} className="p-4 bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.profilePicture} />
                          <AvatarFallback>{getInitials(friend.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{friend.userName}</p>
                          <p className="text-sm text-emerald-600 font-medium">
                            Owes you {formatCurrency(friend.balance!, "INR")}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-emerald-600" />
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="owed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends
                .filter((f) => f.balance && f.balance < 0)
                .map((friend) => (
                  <Card key={friend._id} className="p-4 bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={friend.profilePicture} />
                          <AvatarFallback>{getInitials(friend.userName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{friend.userName}</p>
                          <p className="text-sm text-red-600 font-medium">
                            You owe {formatCurrency(Math.abs(friend.balance!), "INR")}
                          </p>
                        </div>
                      </div>
                      <Link href={`/splitzone/settlements/new?friend=${friend.userId}`}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Settle Up
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FriendsPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
