'use client';

import { useAppSelector } from '@/store/hooks';
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, changePasswordSchema, type UpdateProfileFormData, type ChangePasswordFormData } from '@/utils/validators';
import { useUpdateProfile, useChangePassword } from '@/features/auth/hooks';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      bio: user?.bio || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onUpdateProfile = (data: UpdateProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onChangePassword = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }, {
      onSuccess: () => {
        resetPassword();
      },
    });
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
              </div>

              {/* Profile Information */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Profile Information</CardTitle>
                  <CardDescription className="dark:text-gray-400">Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="dark:text-gray-200">First Name</Label>
                        <Input
                          id="firstName"
                          {...registerProfile('firstName')}
                          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        />
                        {profileErrors.firstName && (
                          <p className="text-sm text-red-600 dark:text-red-400">{profileErrors.firstName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="dark:text-gray-200">Last Name</Label>
                        <Input
                          id="lastName"
                          {...registerProfile('lastName')}
                          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        />
                        {profileErrors.lastName && (
                          <p className="text-sm text-red-600 dark:text-red-400">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="dark:text-gray-200">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...registerProfile('phoneNumber')}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      {profileErrors.phoneNumber && (
                        <p className="text-sm text-red-600 dark:text-red-400">{profileErrors.phoneNumber.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="dark:text-gray-200">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                        placeholder="Tell us about yourself..."
                        {...registerProfile('bio')}
                      />
                      {profileErrors.bio && (
                        <p className="text-sm text-red-600 dark:text-red-400">{profileErrors.bio.message}</p>
                      )}
                    </div>

                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Change Password</CardTitle>
                  <CardDescription className="dark:text-gray-400">Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="dark:text-gray-200">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...registerPassword('currentPassword')}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="dark:text-gray-200">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...registerPassword('newPassword')}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...registerPassword('confirmPassword')}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Button type="submit" disabled={changePasswordMutation.isPending}>
                      {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Email Verification:</span>
                      <span className={`text-sm font-medium ${user?.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                        {user?.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
                      </span>
                    </div>
                    {user?.googleId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Google Account:</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">✓ Linked</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Member Since:</span>
                      <span className="text-sm font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
