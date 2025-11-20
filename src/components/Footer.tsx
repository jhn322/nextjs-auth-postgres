import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background w-full">
      <Separator className="bg-border mb-4" />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="h-16 w-32">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={64}
                height={64}
                loading="lazy"
                sizes="164px"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="text-foreground ml-4 text-3xl font-bold tracking-tight">
              {/* {APP_NAME} */}
            </h1>
          </div>

          {/* Main Content */}
          <section className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-12">
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 lg:col-span-12">
              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-foreground text-base font-semibold">
                  Home
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 1
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/food-beverages">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 2
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/medical-cosmetics">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 3
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-foreground text-base font-semibold">
                  More
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/technology/growing">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 1
                    </CardDescription>
                  </Link>
                  <Link href="/technology/harvesting">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 2
                    </CardDescription>
                  </Link>
                  <Link href="/technology/data/batches">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 3
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-foreground text-base font-semibold">
                  Resources
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/blogs/updates">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 1
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/news">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 2
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/saffron-recipes">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 3
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-foreground text-base font-semibold">
                  About us
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/about-us/about">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 1
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/career">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 2
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/contact-us">
                    <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                      Link 3
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>
            </nav>
          </section>

          {/* Footer Bottom */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <CardDescription className="text-foreground text-center text-sm md:text-left">
              © {currentYear} | {APP_NAME}.
            </CardDescription>

            <div className="flex gap-4 text-sm">
              <Link href="/integritetspolicy">
                <CardDescription className="hover:text-foreground text-foreground text-sm transition-colors">
                  Privacy Policy
                </CardDescription>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
