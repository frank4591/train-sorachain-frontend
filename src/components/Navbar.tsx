
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  CreditCard, 
  ExternalLink,
  Home,
  Globe,
  Wallet,
  Code,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAVIGATION_LINKS } from "@/lib/constants";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  // Don't render navbar on authenticated routes except for the home page
  const isHomePage = location.pathname === '/';
  if (isAuthenticated && !isHomePage) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const getIconForLink = (name: string) => {
    switch (name.toLowerCase()) {
      case "home":
        return <Home className="h-4 w-4 mr-2" />;
      case "explore":
        return <Globe className="h-4 w-4 mr-2" />;
      case "stake to earn":
        return <Wallet className="h-4 w-4 mr-2" />;
      case "stake to develop":
        return <Code className="h-4 w-4 mr-2" />;
      case "docs":
        return <ExternalLink className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">SoraChain</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {NAVIGATION_LINKS.map((link) => 
            link.external ? (
              <a
                key={link.name}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  "text-foreground/70"
                )}
              >
                {getIconForLink(link.name)}
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  location.pathname === link.path ? "text-primary" : "text-foreground/70"
                )}
              >
                {getIconForLink(link.name)}
                {link.name}
              </Link>
            )
          )}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                location.pathname === "/dashboard" ? "text-primary" : "text-foreground/70"
              )}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* User Menu or Login/Register Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {showSearch && (
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="h-9 pr-8" 
              />
              <Search className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSearch(!showSearch)}
            className="h-9 w-9"
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {isAuthenticated && (
            <div className="flex items-center mr-4">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">{user?.credits || 0} Credits</span>
            </div>
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative rounded-full h-9 w-9 p-0">
                  <span className="sr-only">Open user menu</span>
                  {user?.name.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-md animate-fade-in">
          <div className="py-4 px-6 space-y-4">
            {NAVIGATION_LINKS.map((link) => 
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-base font-medium text-foreground/70 flex items-center"
                >
                  {getIconForLink(link.name)}
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block py-2 text-base font-medium flex items-center",
                    location.pathname === link.path ? "text-primary" : "text-foreground/70"
                  )}
                >
                  {getIconForLink(link.name)}
                  {link.name}
                </Link>
              )
            )}
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "block py-2 text-base font-medium flex items-center",
                    location.pathname === "/dashboard" ? "text-primary" : "text-foreground/70"
                  )}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <div className="block py-2 text-base font-medium text-foreground/70 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-primary" />
                  <span>{user?.credits || 0} Credits</span>
                </div>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-base font-medium text-foreground/70 flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block py-2 text-base font-medium text-foreground/70 w-full text-left flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-base font-medium text-foreground/70"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-base font-medium text-primary"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
