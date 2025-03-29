
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PanelLeftOpen,
  PanelLeftClose,
  LayoutList,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  setMobileSheetOpen: (open: boolean) => void;
}

export default function Header({ showSidebar, setShowSidebar, setMobileSheetOpen }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-violet-800/20 bg-black/20 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-violet-200 hover:text-white hover:bg-violet-900/30"
            >
              {showSidebar ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-pink-300">
              Ghibli SoraNet
            </h1>
          </div>
          
          <div>
            <p className="text-sm text-violet-200/70">
              Transform your images into Ghibli-style masterpieces
            </p>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSheetOpen(true)}
              className="text-violet-200 hover:text-white hover:bg-violet-900/30"
            >
              <LayoutList className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-9 w-9 p-0 border border-violet-700/50 hover:bg-violet-900/30 text-violet-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-violet-800 text-violet-200">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a1d2d] border-violet-800/50 text-violet-200">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-violet-800/50" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-violet-800/30 focus:bg-violet-800/30 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-violet-800/30 focus:bg-violet-800/30 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-violet-800/50" />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="text-pink-300 hover:bg-violet-800/30 focus:bg-violet-800/30 hover:text-pink-200 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="sm" 
                variant="ghost"
                className="text-violet-200 hover:text-white border border-violet-700/50 hover:bg-violet-900/30"
                onClick={() => navigate('/login', { state: { from: "/ghibli-art" } })}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
