import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AUTH_PATHS } from '@/lib/constants/routes';
import { APP_NAME } from '@/lib/constants/site';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden px-4 py-16 md:py-24 lg:py-32">
      <div className="relative z-10 container mx-auto max-w-4xl space-y-8">
        <div className="space-y-6 text-center">
          <h1 className="text-foreground text-5xl font-bold tracking-tight md:text-6xl">
            {APP_NAME}
          </h1>
          <p className="text-foreground/90 mx-auto max-w-2xl text-xl md:text-2xl">
            Get started with your Next.js app project. Authentication and
            Database are already set up on the backend.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <Link href={AUTH_PATHS.LOGIN} className="w-full sm:w-auto">
              <Button
                className="bg-foreground text-background hover:bg-foreground/90 w-full"
                aria-label={`Get started with ${APP_NAME}`}
              >
                Log in
              </Button>
            </Link>
            <Link href={AUTH_PATHS.REGISTER} className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="hover:bg-background/90 w-full sm:w-auto"
                aria-label={`Sign up for ${APP_NAME}`}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
