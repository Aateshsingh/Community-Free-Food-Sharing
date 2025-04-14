
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';

const NotFound = () => {
  const location = useLocation();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mb-8 mt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We couldn't find the page you're looking for: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{location.pathname}</span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="bg-primary-green hover:bg-primary-green/90">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/food">Browse Available Food</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
