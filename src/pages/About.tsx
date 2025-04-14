import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Check, Heart, Users, Utensils, Clock, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent animate-fade-in">
              About FoodShareCircle
            </h1>
            <p className="text-2xl text-gray-300 mb-8 animate-fade-in-up">
              We're on a mission to reduce food waste and fight hunger by connecting donors, volunteers, and those in need.
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up">
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Heart className="h-5 w-5 text-primary-green" />
                <span>10K+ Meals Shared</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Users className="h-5 w-5 text-secondary-orange" />
                <span>5K+ Community Members</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Utensils className="h-5 w-5 text-accent-blue" />
                <span>500+ Active Donors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-primary-green/20 text-primary-green px-4 py-2 rounded-full text-sm font-semibold">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white">
                Creating a More Sustainable Future
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                FoodShareCircle addresses two critical issues: food waste and food insecurity. We've built a platform that makes it easy for businesses and individuals with surplus food to connect with those who need it most.
              </p>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-green/20 flex items-center justify-center mr-3 group-hover:bg-primary-green/30 transition-colors">
                    <Check className="h-4 w-4 text-primary-green" />
                  </div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">Reduce food waste in our communities</p>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-secondary-orange/20 flex items-center justify-center mr-3 group-hover:bg-secondary-orange/30 transition-colors">
                    <Check className="h-4 w-4 text-secondary-orange" />
                  </div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">Support those experiencing food insecurity</p>
                </div>
                <div className="flex items-start group">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-accent-blue/20 flex items-center justify-center mr-3 group-hover:bg-accent-blue/30 transition-colors">
                    <Check className="h-4 w-4 text-accent-blue" />
                  </div>
                  <p className="text-gray-300 group-hover:text-white transition-colors">Build stronger, more connected communities</p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-green to-secondary-orange rounded-xl opacity-30 blur-xl group-hover:opacity-50 transition duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000" 
                alt="People sharing food" 
                className="rounded-xl shadow-2xl relative transform group-hover:scale-[1.02] transition duration-500 w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <span className="bg-secondary-orange/20 text-secondary-orange px-4 py-2 rounded-full text-sm font-semibold">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-white mt-6 mb-4">
              A Seamless Food Sharing Experience
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our platform connects two key groups to create an efficient and effective food sharing network.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-primary-green/50 transition-all duration-300">
              <div className="w-14 h-14 bg-primary-green/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-primary-green">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Donors</h3>
              <p className="text-gray-300 leading-relaxed">
                Businesses and individuals with surplus food can easily post available items for collection, specifying details like quantity, pickup location, and available times.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400" 
                alt="Food donation" 
                className="mt-6 rounded-lg w-full h-48 object-cover"
              />
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-secondary-orange/50 transition-all duration-300">
              <div className="w-14 h-14 bg-secondary-orange/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-xl font-bold text-secondary-orange">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Volunteers</h3>
              <p className="text-gray-300 leading-relaxed">
                Volunteers sign up to collect and distribute food, viewing available tasks and accepting those that fit their schedule and location.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400" 
                alt="Volunteers working" 
                className="mt-6 rounded-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Our Story Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-full text-sm font-semibold">
                Our Story
              </span>
              <h2 className="text-4xl font-bold text-white mt-6 mb-4">
                The Journey of FoodShareCircle
              </h2>
              <p className="text-lg text-gray-300">
                From a simple observation to a thriving community.
              </p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-300 leading-relaxed">
                      It all started when our founder witnessed a local bakery throwing away perfectly good bread at the end of the day, while just a few blocks away, a community center was struggling to provide enough food for their free meal program.
                    </p>
                    <div className="border-l-4 border-primary-green pl-6 my-8">
                      <p className="text-lg font-medium text-white">
                        "We began with a simple goal: make it easy for businesses to donate excess food and for those in need to receive it."
                      </p>
                    </div>
                  </div>
                  <div>
                    <img 
                      src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=400" 
                      alt="Food sharing" 
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary-green/20 rounded-full flex items-center justify-center mb-4">
                      <Utensils className="h-8 w-8 text-primary-green" />
                    </div>
                    <span className="text-2xl font-bold text-white">10K+</span>
                    <span className="text-gray-300">Meals Shared</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-secondary-orange/20 rounded-full flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-secondary-orange" />
                    </div>
                    <span className="text-2xl font-bold text-white">2K+</span>
                    <span className="text-gray-300">Volunteer Hours</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-accent-blue" />
                    </div>
                    <span className="text-2xl font-bold text-white">5K+</span>
                    <span className="text-gray-300">Community Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Join Us Section */}
        <div className="container mx-auto px-4 pb-24">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green to-secondary-orange opacity-90"></div>
            <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:40px_40px]"></div>
            <div className="relative p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
              <p className="text-xl mb-12 max-w-2xl mx-auto">
                Whether you want to donate food, volunteer your time, or access resources, become part of our food sharing community today.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button asChild size="lg" variant="secondary" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link to="/register?role=donor" className="flex items-center gap-2">
                    Register as Donor
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Link to="/register?role=volunteer" className="flex items-center gap-2">
                    Register as Volunteer
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
