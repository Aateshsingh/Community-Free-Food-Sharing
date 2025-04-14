import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { FoodItem } from '@/types';
import { addFoodItem } from '@/services/supabaseService';

const NewDonation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    foodType: '',
    expiryDate: '',
    pickupLocation: '',
    pickupTimeFrom: '',
    pickupTimeTo: '',
    image: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = [
      'title', 'description', 'quantity', 'foodType',
      'expiryDate', 'pickupLocation', 'pickupTimeFrom', 'pickupTimeTo'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields`);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('User not found');
      }
      
      // Create the food item object
      const newFoodItem: Omit<FoodItem, 'id' | 'createdAt' | 'donorName'> = {
        ...formData,
        status: 'available',
        donorId: user.id,
      };
      
      // Add the food item using the Supabase service
      const addedItem = await addFoodItem(newFoodItem);
      
      toast.success('Food donation added successfully');
      navigate(`/food/${addedItem.id}`);
    } catch (error) {
      console.error('Error adding donation:', error);
      toast.error('Failed to add donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const foodTypes = [
    'Produce', 'Bakery', 'Dairy', 'Meat', 'Grains', 
    'Canned Goods', 'Non-perishable', 'Prepared Meals', 'Other'
  ];
  
  return (
    <MainLayout requireAuth>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Donation</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>
                Provide information about the food you're donating
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="E.g., Fresh Vegetables, Bread Loaves"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the food, its condition, any allergens, etc."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      placeholder="E.g., 5 lbs, 3 bags, 10 items"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type</Label>
                    <Select
                      value={formData.foodType}
                      onValueChange={(value) => handleSelectChange('foodType', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select food category" />
                      </SelectTrigger>
                      <SelectContent>
                        {foodTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    name="pickupLocation"
                    placeholder="Full address where food can be picked up"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickupTimeFrom">Pickup Time (From)</Label>
                    <Input
                      id="pickupTimeFrom"
                      name="pickupTimeFrom"
                      type="time"
                      value={formData.pickupTimeFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pickupTimeTo">Pickup Time (To)</Label>
                    <Input
                      id="pickupTimeTo"
                      name="pickupTimeTo"
                      type="time"
                      value={formData.pickupTimeTo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    name="image"
                    placeholder="URL to an image of the food"
                    value={formData.image}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">
                    Provide a URL to an image of the food. If left blank, a default image will be used.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/donations')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary-green hover:bg-primary-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Donation'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewDonation;
