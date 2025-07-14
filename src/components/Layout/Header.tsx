import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Bell, User, Menu, Home, Star, History, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#161111] border-b border-[#4c4242] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#ddbfbf] rounded-lg flex items-center justify-center">
              <span className="text-[#161111] font-bold text-lg">M</span>
            </div>
            <span className="text-white font-bold text-xl">MatFare</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-[#ddbfbf] bg-[#332d2d]' 
                  : 'text-[#afa5a5] hover:text-white hover:bg-[#231e1e]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/reviews"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/reviews') 
                  ? 'text-[#ddbfbf] bg-[#332d2d]' 
                  : 'text-[#afa5a5] hover:text-white hover:bg-[#231e1e]'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/history') 
                  ? 'text-[#ddbfbf] bg-[#332d2d]' 
                  : 'text-[#afa5a5] hover:text-white hover:bg-[#231e1e]'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#afa5a5] hover:text-white hover:bg-[#231e1e]"
            >
              <Bell className="w-5 h-5" />
            </Button>
            
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#afa5a5] hover:text-white hover:bg-[#231e1e]"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-[#afa5a5] hover:text-white hover:bg-[#231e1e]"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};