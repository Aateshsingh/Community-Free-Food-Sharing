import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  LogOut, 
  Menu, 
  User,
  X,
  Utensils
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClasses = (path: string) => {
    return `relative text-foreground hover:text-primary-green transition-colors duration-300 ${
      isActive(path) ? 'text-primary-green after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-green' : ''
    }`;
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary-green to-secondary-orange group-hover:shadow-lg transition-all duration-300">
              <Utensils className="h-6 w-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent">
                FoodShare
              </span>
              <span className="text-2xl font-bold ml-1 text-secondary-orange">
                Circle
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClasses('/')}>Home</Link>
            <Link to="/food" className={navLinkClasses('/food')}>Available Food</Link>
            
            {user && user.role === 'donor' && (
              <Link to="/donations" className={navLinkClasses('/donations')}>My Donations</Link>
            )}
            
            {user && user.role === 'volunteer' && (
              <Link to="/tasks" className={navLinkClasses('/tasks')}>Tasks</Link>
            )}
            
            <Link to="/about" className={navLinkClasses('/about')}>About</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleNotifications}
                    className="relative hover:bg-primary-green/10"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                  {notificationsOpen && (
                    <NotificationDropdown onClose={() => setNotificationsOpen(false)} />
                  )}
                </div>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary-green/10">
                      <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="ghost" asChild className="hover:bg-primary-green/10">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-primary-green hover:bg-primary-green/90">
                  <Link to="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-primary-green/10" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${navLinkClasses('/')} px-3 py-2 rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/food" 
                className={`${navLinkClasses('/food')} px-3 py-2 rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Available Food
              </Link>
              
              {user && user.role === 'donor' && (
                <Link 
                  to="/donations" 
                  className={`${navLinkClasses('/donations')} px-3 py-2 rounded-md`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Donations
                </Link>
              )}
              
              {user && user.role === 'volunteer' && (
                <Link 
                  to="/tasks" 
                  className={`${navLinkClasses('/tasks')} px-3 py-2 rounded-md`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tasks
                </Link>
              )}
              
              <Link 
                to="/about" 
                className={`${navLinkClasses('/about')} px-3 py-2 rounded-md`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    className="text-foreground hover:text-primary-green px-3 py-2 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-primary-green text-white px-3 py-2 rounded-md hover:bg-primary-green/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
