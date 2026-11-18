import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-editorial bg-accent-terracotta/10 border border-accent-terracotta/20 flex items-center justify-center text-accent-action mx-auto mb-6">
            <Compass className="w-8 h-8" />
          </div>

          <span className="text-xs font-heading font-bold uppercase tracking-widest text-accent-terracotta mb-2 block">
            Error 404 · Route Not Found
          </span>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-ink-primary mb-4">
            Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-ink-secondary mb-8 font-body leading-relaxed">
            The page or resource you are attempting to reach does not exist or may have been moved as part of our platform roadmap.
          </p>

          <div className="flex justify-center">
            <Link href="/" passHref>
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

