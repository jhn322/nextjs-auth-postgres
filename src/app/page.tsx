import { Hero } from '../components/landing-page/hero';
import { Features } from '../components/landing-page/features';
import { CodeExamples } from '../components/landing-page/code-examples';
import { TechStack } from '../components/landing-page/tech-stack';
import { AdvantagesShowcase } from '../components/landing-page/advantages';
import { Integrations } from '../components/landing-page/integrations';
import { FAQ } from '../components/landing-page/faq';
import type { Metadata } from 'next';
// import Form from './form';

export const metadata: Metadata = {
  // * Metadata is inherited from layout.tsx
};

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header>
        <Hero />
        <Features />
        <CodeExamples />
        <Integrations />
        <TechStack />
        <AdvantagesShowcase />
        <FAQ />
        {/* For testing Neon database connection */}
        {/* <Form /> */}
      </header>
    </main>
  );
}
