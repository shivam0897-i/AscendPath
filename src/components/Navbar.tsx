
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
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
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background text-foreground shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl gradient-text">AscendPath</span>
            </Link>
          </div>

          {!minimal && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <NavLinks />
                <div className="flex items-center space-x-4">
                  {user ? <UserMenu /> : <AuthButtons />}
                  <ThemeToggle />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-1">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </>
          )}

          {minimal && (
            <div>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !minimal && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <NavLinks mobile />
              <div className="pt-2 flex flex-col space-y-2">
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
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
  <>
    {mobile ? (
      <>
        <Link to="/" className="block py-2 hover:text-empowerPurple">
          Home
        </Link>
        <Link to="/dashboard" className="block py-2 hover:text-empowerPurple">
          Dashboard
        </Link>
        <Link to="/resources" className="block py-2 hover:text-empowerPurple">
          Resources
        </Link>
        <Link to="/community" className="block py-2 hover:text-empowerPurple">
          Community
        </Link>
        <Link to="/Questionnaire" className="block py-2 hover:text-empowerPurple">
          Find Career
        </Link>
      </>
    ) : (
      <>
        <Link to="/" className="hover:text-empowerPurple">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-empowerPurple">
          Dashboard
        </Link>
        <Link to="/resources" className="hover:text-empowerPurple">
          Resources
        </Link>
        <Link to="/community" className="hover:text-empowerPurple">
          Community
        </Link>
        <Link to="/Questionnaire" className="block py-2 hover:text-empowerPurple">
          Find Career
        </Link>
      </>
    )}
  </>
);

const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
  <>
    {mobile ? (
      <>
        <Link to="/auth">
          <Button variant="outline" className="w-full justify-center">
            Log in
          </Button>
        </Link>
        <Link to="/auth?tab=signup">
          <Button className="w-full justify-center bg-empowerPurple hover:bg-empowerPurple-dark">
            Sign up
          </Button>
        </Link>
      </>
    ) : (
      <>
        <Link to="/auth">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link to="/auth?tab=signup">
          <Button className="bg-empowerPurple hover:bg-empowerPurple-dark">
            Sign up
          </Button>
        </Link>
      </>
    )}
  </>
);

export default Navbar;
