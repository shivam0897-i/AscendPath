
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";


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
    <nav className="bg-white shadow-sm">
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
                {user ? <UserMenu /> : <AuthButtons />}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
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
