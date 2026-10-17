import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export const metadata = {
  title: 'Aurally Realty | Buy, Rent & Sell Properties in Chennai',
  description: 'Find your dream home in Chennai with Aurally Realty. Browse thousands of residential and commercial properties for rent, sale, and more.',
  keywords: 'real estate Chennai, buy property Chennai, rent flat Chennai, sell property Chennai, apartments Chennai',
  openGraph: {
    title: 'Aurally Realty | Chennai Real Estate',
    description: 'Find your dream home in Chennai with Aurally Realty.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
