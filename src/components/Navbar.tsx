
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Mountain } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { useTheme } from "@/context/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  minimal?: boolean;
}

const Navbar = ({ minimal = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { signOut } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background/90 backdrop-blur-lg text-foreground border-b border-border/40 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Mountain className="h-7 w-7 text-terracotta group-hover:scale-110 transition-all duration-300" />
                <div className="absolute inset-0 bg-terracotta/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-heading font-bold text-2xl gradient-text">AscendPath</span>
            </Link>
          </div>

          {!minimal && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLinks currentPath={location.pathname} />
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border/50">
                  {user ? <UserMenu /> : <AuthButtons />}
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleMenu} 
                  className="p-2 hover:bg-terracotta/10 hover:text-terracotta transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </>
          )}

          {minimal && (
            <div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:text-terracotta">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !minimal && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in-down">
            <div className="flex flex-col space-y-1">
              <NavLinks mobile currentPath={location.pathname} />
              <div className="pt-4 mt-4 flex flex-col space-y-2 border-t border-border/50">
                {user ? (
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-center"
                    variant="outline"
                  >
                    Log out
                  </Button>
                ) : (
                  <AuthButtons mobile />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-border/50 hover:border-terracotta/50 hover:bg-terracotta/5 hover:text-terracotta transition-all duration-300"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-scale-in">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer hover:text-terracotta">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer hover:text-terracotta">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer hover:text-terracotta">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavLinks = ({ mobile = false, currentPath = "" }: { mobile?: boolean; currentPath?: string }) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resources", label: "Resources" },
    { href: "/community", label: "Community" },
    { href: "/Questionnaire", label: "Find Career" },
  ];
  
  return (
    <>
      {mobile ? (
        <>
          {links.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className={`block py-3 px-4 rounded-lg transition-all duration-200 ${
                currentPath === link.href 
                  ? "bg-terracotta/10 text-terracotta font-medium" 
                  : "hover:bg-terracotta/5 hover:text-terracotta"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </>
      ) : (
        <>
          {links.map((link) => (
            <Link 
              key={link.href}
              to={link.href} 
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPath === link.href 
                  ? "text-terracotta" 
                  : "text-foreground/80 hover:text-terracotta hover:bg-terracotta/5"
              }`}
            >
              {link.label}
              {currentPath === link.href && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-terracotta rounded-full" />
              )}
            </Link>
          ))}
        </>
      )}
    </>
  );
};

const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
  <>
    {mobile ? (
      <>
        <Link to="/auth">
          <Button variant="outline" className="w-full justify-center border-terracotta/30 hover:border-terracotta hover:bg-terracotta/5 hover:text-terracotta transition-all">
            Log in
          </Button>
        </Link>
        <Link to="/auth?tab=signup">
          <Button variant="warm" className="w-full justify-center">
            Sign up
          </Button>
        </Link>
      </>
    ) : (
      <>
        <Link to="/auth">
          <Button variant="ghost" className="hover:text-terracotta hover:bg-terracotta/5 transition-all">Log in</Button>
        </Link>
        <Link to="/auth?tab=signup">
          <Button variant="default">
            Sign up
          </Button>
        </Link>
      </>
    )}
  </>
);

export default Navbar;
