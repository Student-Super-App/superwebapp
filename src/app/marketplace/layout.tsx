import { Header } from '@/components/common/Navbar';
import { NavbarHeight } from '@/utils/constant';
import { ReactNode } from 'react';

export default function MarketplaceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header></Header>
      <main style={{ minHeight: `calc(100vh - ${NavbarHeight}px)` }}>
        {children}
      </main>
    </>
  );
}
