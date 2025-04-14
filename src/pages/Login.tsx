import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = await login(email, password);
      if (user) {
        toast.success('Login successful');
        
        // Redirect based on user role
        if (user.role === 'donor') {
          navigate('/donations');
        } else if (user.role === 'volunteer') {
          navigate('/tasks');
        } else {
          navigate('/food');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Demo login credentials
  const demoCredentials = [
    { email: 'john@example.com', role: 'donor' },
    { email: 'sarah@example.com', role: 'volunteer' },
  ];
  
  const handleDemoLogin = async (email: string) => {
    setEmail(email);
    setPassword('password'); // Demo password
    
    try {
      const user = await login(email, 'password');
      if (user) {
        toast.success('Demo login successful');
        
        // Redirect based on user role
        if (user.role === 'donor') {
          navigate('/donations');
        } else if (user.role === 'volunteer') {
          navigate('/tasks');
        } else {
          navigate('/food');
        }
      }
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Log in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary-green hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-gray-400">Or try a demo account</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {demoCredentials.map((cred) => (
                    <Button
                      key={cred.email}
                      variant="outline"
                      onClick={() => handleDemoLogin(cred.email)}
                      className="text-sm border-gray-200/20 hover:bg-primary-green/10 hover:text-white transition-colors"
                    >
                      Login as {cred.role} ({cred.email})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary-green hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
