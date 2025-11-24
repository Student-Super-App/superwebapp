'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/features/auth/hooks';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, ShoppingBag, Printer, Home as HomeIcon, Moon, Sun, LayoutDashboard, MessageCircle, Plus, Package } from 'lucide-react';
import { useState, useMemo } from 'react';

export const Header = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("user",user,"isAuthenticated",isAuthenticated)
  const logoutMutation = useLogout();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Determine current service from pathname
  const currentService = useMemo(() => {
    if (pathname.startsWith('/marketplace')) return 'marketplace';
    if (pathname.startsWith('/printing')) return 'printing';
    if (pathname.startsWith('/rentplace')) return 'rentplace';
    return 'dashboard';
  }, [pathname]);

  // Get navigation links based on current service
  const navLinks = useMemo(() => {
    const marketplaceNav = [
      { href: '/marketplace', label: 'Products', icon: ShoppingBag },
      { href: '/marketplace/my-listings', label: 'My Dashboard', icon: LayoutDashboard },
      { href: '/marketplace/chats', label: 'Chats', icon: MessageCircle },
      { href: '/marketplace/create', label: 'Sell', icon: Plus },
    ];

    const printingNav = [
      { href: '/printing', label: 'Print Files', icon: Printer },
      { href: '/printing/orders', label: 'My Orders', icon: Package },
      { href: '/printing/history', label: 'History', icon: LayoutDashboard },
    ];

    const rentplaceNav = [
      { href: '/rentplace', label: 'Properties', icon: HomeIcon },
      { href: '/rentplace/add', label: 'Add Property', icon: Plus },
      { href: '/rentplace/my-properties', label: 'My Properties', icon: LayoutDashboard },
    ];

    switch (currentService) {
      case 'marketplace':
        return marketplaceNav;
      case 'printing':
        return printingNav;
      case 'rentplace':
        return rentplaceNav;
      default:
        return [];
    }
  }, [currentService]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-gray-200 dark:border-gray-700">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Super App
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive(link.href)
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 h-10">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div className="text-left hidden lg:block">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Switch Service</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/marketplace" className="flex items-center cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          <span>Marketplace</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/printing" className="flex items-center cursor-pointer">
                          <Printer className="mr-2 h-4 w-4" />
                          <span>Printing</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/rentplace" className="flex items-center cursor-pointer">
                          <HomeIcon className="mr-2 h-4 w-4" />
                          <span>Rentplace</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={toggleTheme}
                        className="flex items-center cursor-pointer"
                      >
                        {theme === 'dark' ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden lg:hidden border-t dark:border-gray-700 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive(link.href)
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t dark:border-gray-700">
              <div className="flex items-center space-x-3 px-4 py-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              
              {/* Service Switcher */}
              <div className="pt-2 border-t dark:border-gray-700 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Switch Service
                </p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Marketplace</span>
                </Link>
                <Link
                  href="/printing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
                >
                  <Printer className="h-5 w-5" />
                  <span>Printing</span>
                </Link>
                <Link
                  href="/rentplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Rentplace</span>
                </Link>
              </div>
              
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white rounded-lg"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-5 w-5" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
