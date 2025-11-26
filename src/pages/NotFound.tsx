
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Silently log 404 errors without exposing to console in production
    if (process.env.NODE_ENV === 'development') {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-charcoal">
      <Navbar minimal />
      
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-7xl font-heading font-bold mb-4 gradient-text">404</h1>
          <p className="text-xl text-charcoal dark:text-cream mb-4">
            Oops! We couldn't find the page you're looking for.
          </p>
          <p className="text-muted-foreground dark:text-cream/60 mb-8">
            The page might have been moved or doesn't exist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              asChild 
              variant="outline"
              className="border-charcoal/20 dark:border-cream/20 text-charcoal dark:text-cream hover:bg-sage/10"
            >
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
            <Button asChild className="bg-terracotta hover:bg-terracotta-dark shadow-warm">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
