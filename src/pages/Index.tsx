import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import FoodCard from '@/components/FoodCard';
import { useQuery } from '@tanstack/react-query';
import { getFoodItems } from '@/services/supabaseService';
import EmptyState from '@/components/EmptyState';
import { Package2, Gift, Heart, ArrowRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Index = () => {
  const { user } = useAuth();
  
  const { data: foodItems, isLoading } = useQuery({
    queryKey: ['recentFoodItems'],
    queryFn: getFoodItems
  });
  
  const recentFoodItems = foodItems?.slice(0, 3) || [];
  
  return (
    <MainLayout>
      {/* Hero Section with Background Image */}
      <section className="relative py-24 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070"
            alt="Food sharing background"
            className="w-full h-full object-cover brightness-[0.3] dark:brightness-50"
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-primary-green">FoodShare</span>
            <span className="text-secondary-orange">Circle</span>
          </h1>
          <p className="text-xl mb-8 text-gray-100 dark:text-gray-200">
            Join our community in reducing food waste while supporting those in need.
            Connect with local donors, volunteers, and beneficiaries.
          </p>
          {!user && (
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-primary-green hover:bg-primary-green/90 text-white" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/50 hover:border-white transition-colors" 
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all">
              <h3 className="text-2xl font-bold text-primary-green mb-2">Zero Food Waste</h3>
              <p className="text-gray-300">Help us create a sustainable future by reducing food waste in our community.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all">
              <h3 className="text-2xl font-bold text-secondary-orange mb-2">Community Support</h3>
              <p className="text-gray-300">Together we can make a difference in the lives of those facing food insecurity.</p>
            </div>
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-all">
              <h3 className="text-2xl font-bold text-accent-blue mb-2">Local Impact</h3>
              <p className="text-gray-300">Create meaningful connections and strengthen our local food sharing network.</p>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              #FoodWasteReduction
            </span>
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              #CommunitySupport
            </span>
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              #SustainableLiving
            </span>
            <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all">
              #LocalCommunity
            </span>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">How It Works</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join our community and make a difference through these three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gray-900/95 backdrop-blur-sm border-0">
            <div className="mb-6">
              <div className="mb-6 text-center">
                <h4 className="text-lg font-semibold text-primary-green mb-2">ReduceFoodWaste</h4>
                <p className="text-sm text-gray-300">Share your excess food and help eliminate waste</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=400"
                alt="Donate Food"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-white">Donate Food</h3>
              <p className="text-gray-300">
                List your surplus food items for donation. Help reduce waste and support the community.
              </p>
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gray-900/95 backdrop-blur-sm border-0">
            <div className="mb-6">
              <div className="mb-6 text-center">
                <h4 className="text-lg font-semibold text-secondary-orange mb-2">CommunityService</h4>
                <p className="text-sm text-gray-300">Be part of our distribution network</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400"
                alt="Volunteer"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-white">Volunteer</h3>
              <p className="text-gray-300">
                Help collect and distribute food donations. Make a difference in your community.
              </p>
            </div>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gray-900/95 backdrop-blur-sm border-0">
            <div className="mb-6">
              <div className="mb-6 text-center">
                <h4 className="text-lg font-semibold text-accent-blue mb-2">BuildConnections</h4>
                <p className="text-sm text-gray-300">Create lasting relationships in your community</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=400"
                alt="Connect"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-white">Connect</h3>
              <p className="text-gray-300">
                Build relationships within the community. Together we can make a bigger impact.
              </p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Recent Donations Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent">
              Recent Donations
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Check out the latest food items available for sharing in your community
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="animate-pulse">
                    <div className="bg-primary-green/20 h-56 rounded-t-lg" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-primary-green/20 rounded w-3/4" />
                      <div className="space-y-2">
                        <div className="h-4 bg-primary-green/20 rounded w-full" />
                        <div className="h-4 bg-primary-green/20 rounded w-2/3" />
                      </div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-4 bg-primary-green/20 rounded w-1/3" />
                        <div className="h-8 bg-primary-green/20 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : recentFoodItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentFoodItems.map(food => (
                  <div key={food.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                    <FoodCard food={food} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-semibold text-gray-900 dark:text-white border-gray-900/20 dark:border-white/20 hover:bg-gray-900/10 dark:hover:bg-white/10 transition-colors duration-300 group"
                  asChild
                >
                  <Link to="/food" className="inline-flex items-center gap-2">
                    View All Donations
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <EmptyState
              title="No Recent Donations"
              description="Be the first to share food with your community"
              icon={<Package2 className="w-12 h-12 text-primary-green" />}
              action={{
                label: "Donate Food",
                href: "/donations/new"
              }}
            />
          )}
        </div>
      </section>

      {/* Recent Community Members Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent mb-4">
              Our Community Members
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Meet the amazing people who are making a difference in our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Donors Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Gift className="h-6 w-6 text-primary-green mr-2" />
                Recent Donors
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Emma Wilson",
                    role: "Local Restaurant Owner",
                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
                    donations: 12
                  },
                  {
                    name: "Michael Chen",
                    role: "Grocery Store Manager",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
                    donations: 8
                  },
                  {
                    name: "Sarah Johnson",
                    role: "Community Baker",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
                    donations: 15
                  }
                ].map((donor, index) => (
                  <div 
                    key={donor.name}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <Avatar className="h-12 w-12 border-2 border-primary-green/20 group-hover:border-primary-green transition-colors">
                      <AvatarImage src={donor.image} alt={donor.name} />
                      <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{donor.name}</h4>
                      <p className="text-sm text-gray-400">{donor.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-primary-green font-semibold">{donor.donations}</span>
                      <p className="text-xs text-gray-400">donations</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteers Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Heart className="h-6 w-6 text-secondary-orange mr-2" />
                Active Volunteers
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "David Park",
                    role: "Delivery Volunteer",
                    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100",
                    tasks: 20
                  },
                  {
                    name: "Lisa Martinez",
                    role: "Food Sorting Lead",
                    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
                    tasks: 25
                  },
                  {
                    name: "James Wilson",
                    role: "Community Coordinator",
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
                    tasks: 18
                  }
                ].map((volunteer, index) => (
                  <div 
                    key={volunteer.name}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <Avatar className="h-12 w-12 border-2 border-secondary-orange/20 group-hover:border-secondary-orange transition-colors">
                      <AvatarImage src={volunteer.image} alt={volunteer.name} />
                      <AvatarFallback>{volunteer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{volunteer.name}</h4>
                      <p className="text-sm text-gray-400">{volunteer.role}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-secondary-orange font-semibold">{volunteer.tasks}</span>
                      <p className="text-xs text-gray-400">tasks</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Join the Community CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="font-semibold text-gray-900 dark:text-white border-gray-900/20 dark:border-white/20 hover:bg-gray-900/10 dark:hover:bg-white/10 transition-colors duration-300 group"
              asChild
            >
              <Link to="/register" className="inline-flex items-center gap-2">
                Join Our Community
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
