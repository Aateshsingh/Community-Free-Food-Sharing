import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Heart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-background to-gray-900/95 border-t border-white/10">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      <div className="container mx-auto px-4 py-12 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-green to-secondary-orange group-hover:shadow-lg transition-all duration-300">
                <Utensils className="h-6 w-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent">
                  FoodShare
                </span>
                <span className="text-xl font-bold ml-1 text-secondary-orange">
                  Circle
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join our mission to reduce food waste while supporting those in need. Together, we can make a difference in our community.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-green/10 hover:text-primary-green">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-green/10 hover:text-primary-green">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-green/10 hover:text-primary-green">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/food" className="text-gray-400 hover:text-primary-green transition-colors duration-200 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-primary-green mr-2"></span>
                  Available Food
                </Link>
              </li>
              <li>
                <Link to="/donations" className="text-gray-400 hover:text-primary-green transition-colors duration-200 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-primary-green mr-2"></span>
                  Donate Food
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="text-gray-400 hover:text-primary-green transition-colors duration-200 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-primary-green mr-2"></span>
                  Volunteer Tasks
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-green transition-colors duration-200 flex items-center">
                  <span className="h-1 w-1 rounded-full bg-primary-green mr-2"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-3 text-primary-green" />
                <span>123 Community St, City, State 12345</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-primary-green" />
                <span>9839660325</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-primary-green" />
                <span>contact@foodsharecircle.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for updates on food sharing opportunities and community events.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
              <Button className="bg-primary-green hover:bg-primary-green/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FoodShareCircle. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-green transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-green transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-400 flex items-center">
                Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for the community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
