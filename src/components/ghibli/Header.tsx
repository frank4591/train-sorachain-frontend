
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
    <header className="border-b border-gray-200 bg-white z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-gray-700 hover:text-black hover:bg-gray-100"
            >
              {showSidebar ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              Ghibli SoraNet
            </h1>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              Transform your images into Ghibli-style masterpieces
            </p>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileSheetOpen(true)}
              className="text-gray-700 hover:text-black hover:bg-gray-100"
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
                    className="rounded-full h-9 w-9 p-0 border border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gray-200 text-gray-800">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 text-gray-900">
                  <DropdownMenuLabel className="text-gray-600">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer text-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer text-gray-800">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="text-red-600 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                className="text-gray-800 hover:text-black border-gray-300 hover:bg-gray-100"
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
