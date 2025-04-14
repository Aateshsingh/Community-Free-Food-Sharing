import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import FoodCard from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import EmptyState from '@/components/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { getFoodItemsByDonor } from '@/services/supabaseService';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const MyDonations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: userDonations, isLoading } = useQuery({
    queryKey: ['userDonations', user?.id],
    queryFn: () => getFoodItemsByDonor(user!.id),
    enabled: !!user?.id
  });

  if (!user) {
    return <MainLayout requireAuth>Loading...</MainLayout>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <MainLayout requireAuth>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-orange bg-clip-text text-transparent mb-4">
              My Donations
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Track and manage your food donations, making a difference in your community
            </p>
            <Button 
              onClick={() => navigate('/donations/new')}
              className="bg-primary-green hover:bg-primary-green/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Donation
              <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </motion.div>

          {isLoading ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="animate-pulse space-y-4">
                      <div className="bg-primary-green/20 h-48 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-primary-green/20 rounded w-3/4"></div>
                        <div className="h-4 bg-primary-green/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : userDonations && userDonations.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {userDonations.map(food => (
                <motion.div 
                  key={food.id} 
                  variants={itemVariants}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <EmptyState
                title="Start Sharing Food"
                description="Make a difference in your community by sharing your excess food"
                icon={<Package2 className="w-12 h-12 text-primary-green" />}
                action={{
                  label: "Add Your First Donation",
                  href: "/donations/new"
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyDonations;
