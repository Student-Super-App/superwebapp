import { Header } from '@/components/common/Navbar';
import { NavbarHeight } from '@/utils/constant';
import { ReactNode } from 'react';

export default function SplitZoneLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header></Header>
      <main className='flex-1 bg-gray-50 dark:bg-gray-900'
      style={{ minHeight: `calc(100vh - ${NavbarHeight}px)` }}>{children}</main>
    </>
  );
}
