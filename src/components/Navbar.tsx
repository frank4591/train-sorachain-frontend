
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  CreditCard, 
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
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  // Create navigation links for authenticated users
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Explore", path: "/explore", icon: <Globe className="h-4 w-4 mr-2" /> },
    { name: "Stake to Earn", path: "/stake-to-earn", icon: <Wallet className="h-4 w-4 mr-2" /> },
    { name: "Stake to Develop", path: "/stake-to-develop", icon: <Code className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-subtle" : "bg-background"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">SoraChain</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                location.pathname === link.path ? "text-primary" : "text-foreground/70"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
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
          
          <div className="flex items-center mr-4">
            <CreditCard className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium">{user?.credits || 0} Credits</span>
          </div>
          
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block py-2 text-base font-medium flex items-center",
                  location.pathname === link.path ? "text-primary" : "text-foreground/70"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="block py-2 text-base font-medium text-foreground/70 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              <span>{user?.credits || 0} Credits</span>
            </div>
            
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
          </div>
        </div>
      )}
    </header>
  );
}
