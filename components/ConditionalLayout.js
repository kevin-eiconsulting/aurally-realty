'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname === '/login' || pathname === '/signup';
  const isListing = pathname === '/buy' || pathname === '/rent';

  return (
    <>
      {!isAdmin && <Navbar hideBottomBar={isAuth || isListing} logoOnly={isAuth} />}
      <main>{children}</main>
      {!isAdmin && !isAuth && <Footer />}
    </>
  );
}
