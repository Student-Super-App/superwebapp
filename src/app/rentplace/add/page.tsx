'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPropertySchema, type CreatePropertyFormData } from '@/utils/validators';
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/error';
import { rentplaceApi } from '@/lib/api-client';

export default function AddPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
  });

  const onSubmit = async (data: CreatePropertyFormData) => {
    setIsLoading(true);
    try {
      await rentplaceApi.createProperty(data);
      toast.success('Property listed successfully!');
      router.push('/rentplace');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 bg-gray-50">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Add Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Cozy PG near Campus"
                        {...register('title')}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                        placeholder="Describe the property..."
                        {...register('description')}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                          id="type"
                          className="w-full px-3 py-2 border rounded-md"
                          {...register('type')}
                        >
                          <option value="pg">PG</option>
                          <option value="hostel">Hostel</option>
                          <option value="apartment">Apartment</option>
                          <option value="room">Room</option>
                        </select>
                        {errors.type && (
                          <p className="text-sm text-red-600">{errors.type.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender Preference</Label>
                        <select
                          id="gender"
                          className="w-full px-3 py-2 border rounded-md"
                          {...register('gender')}
                        >
                          <option value="any">Any</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        {errors.gender && (
                          <p className="text-sm text-red-600">{errors.gender.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rent">Monthly Rent</Label>
                        <Input
                          id="rent"
                          type="number"
                          placeholder="0"
                          {...register('rent', { valueAsNumber: true })}
                        />
                        {errors.rent && (
                          <p className="text-sm text-red-600">{errors.rent.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deposit">Deposit</Label>
                        <Input
                          id="deposit"
                          type="number"
                          placeholder="0"
                          {...register('deposit', { valueAsNumber: true })}
                        />
                        {errors.deposit && (
                          <p className="text-sm text-red-600">{errors.deposit.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="1"
                        {...register('capacity', { valueAsNumber: true })}
                      />
                      {errors.capacity && (
                        <p className="text-sm text-red-600">{errors.capacity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        {...register('location.address')}
                      />
                      {errors.location?.address && (
                        <p className="text-sm text-red-600">{errors.location.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          {...register('location.city')}
                        />
                        {errors.location?.city && (
                          <p className="text-sm text-red-600">{errors.location.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          {...register('location.state')}
                        />
                        {errors.location?.state && (
                          <p className="text-sm text-red-600">{errors.location.state.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          placeholder="123456"
                          {...register('location.pincode')}
                        />
                        {errors.location?.pincode && (
                          <p className="text-sm text-red-600">{errors.location.pincode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foodIncluded">Food Included</Label>
                      <select
                        id="foodIncluded"
                        className="w-full px-3 py-2 border rounded-md"
                        {...register('foodIncluded', { 
                          setValueAs: (v) => v === 'true' 
                        })}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                      {errors.foodIncluded && (
                        <p className="text-sm text-red-600">{errors.foodIncluded.message}</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Property'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
