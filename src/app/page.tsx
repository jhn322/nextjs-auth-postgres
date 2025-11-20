import Hero from '../components/landing-page/Hero';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // * Metadata is inherited from layout.tsx
};

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header>
        <Hero />
      </header>
    </main>
  );
}
