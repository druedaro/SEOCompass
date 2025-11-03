import { Link } from 'react-router-dom';
import { AUTH_PATHS } from '@/routes/paths';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">SC</span>
            </div>
            <div>
              <div className="text-lg font-semibold">SEO Compass</div>
              <div className="text-sm text-muted-foreground">The complete SEO platform for Technical SEO specialists, Content experts, and Developers.</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to={AUTH_PATHS.LOGIN} className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link>
            <Link to={AUTH_PATHS.REGISTER} className="text-sm text-muted-foreground hover:text-foreground">Get Started</Link>
          </div>

          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} SEO Compass. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

