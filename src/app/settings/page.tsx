'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Schema for Profile Form
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Schema for Password Form
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

type Tab = 'profile' | 'account' | 'members' | 'billing' | 'invoices' | 'api';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Fetch user details on mount
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          profileForm.reset({ name: data.user.name || '' });
          setHasPassword(data.user.hasPassword);
          setUserImage(data.user.image);
        }
      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    }
    fetchUserDetails();
  }, [profileForm]);

  async function onProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      await update({ name: data.name });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }

      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/user/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setUserImage(data.imageUrl);
      await update({ image: data.imageUrl });
      toast.success('Profile image updated');
    } catch {
      toast.error('Failed to upload image');
    }
  };

  // Helper to check if a section should be visible based on search
  const shouldShowSection = (title: string, description: string) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    );
  };

  const renderSidebarButton = (tab: Tab, label: string) => (
    <Button
      variant={activeTab === tab ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start',
        activeTab === tab ? 'font-medium' : 'text-muted-foreground'
      )}
      onClick={() => setActiveTab(tab)}
    >
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search settings..."
            className="pl-8 bg-muted/50 border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r min-h-[calc(100vh-81px)] p-6 space-y-1">
          {renderSidebarButton('profile', 'Profile')}
          {renderSidebarButton('account', 'Account')}
          {renderSidebarButton('members', 'Members')}
          {renderSidebarButton('billing', 'Billing')}
          {renderSidebarButton('invoices', 'Invoices')}
          {renderSidebarButton('api', 'API')}
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 max-w-4xl">
          {activeTab === 'profile' ? (
            <>
              {/* Basic Information */}
              {shouldShowSection(
                'Basic information',
                'View and update your personal details and account information.'
              ) && (
                <section className="mb-12">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        Basic information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        View and update your personal details and account
                        information.
                      </p>
                    </div>

                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-2">
                      <Avatar
                        className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <AvatarImage
                          src={userImage || session?.user?.image || ''}
                        />
                        <AvatarFallback className="text-lg">
                          {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Avatar
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 max-w-2xl">
                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Email address</FormLabel>
                          <Input
                            value={session?.user?.email || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>

                        <div className="pt-2">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </section>
              )}

              {(shouldShowSection(
                'Basic information',
                ''
              ) || shouldShowSection('Change password', '')) && hasPassword && <Separator className="my-8" />}

              {/* Change Password - Only for non-OAuth users */}
              {hasPassword &&
                shouldShowSection(
                  'Change password',
                  'Update your password to keep your account secure.'
                ) && (
                  <section className="mb-12">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-1">
                        Change password
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure.
                      </p>
                    </div>

                    <div className="grid gap-6 max-w-2xl">
                      <Form {...passwordForm}>
                        <form
                          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                          className="space-y-6"
                        >
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Verify current password</FormLabel>
                                <FormControl>
                                  <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New password</FormLabel>
                                <FormControl>
                                  <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                  <PasswordInput {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-2">
                            <Button type="submit" disabled={isLoading}>
                              {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Save
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </section>
                )}

            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-muted-foreground max-w-sm mt-2">
                  This section is currently under development. Check back later
                  for updates.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
