import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import api from '@/axios/api';
import { toast } from 'sonner';
import useAuth from './hooks/useAuth';

// Define Zod schema for form validation
const loginSchema = z.object({
  username: z.string()
    .nonempty({ message: 'Username is required' })
    .min(4, { message: 'Username must be at least 4 characters' })
    .regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed"),
    
  password: z.string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/api/token/', data);
      const { access, refresh, user } = response.data;
      login(user, access, refresh);
      setApiError(null);
      navigate('/dashboard'); 
      toast.success("Login successful");
    } catch (error) {
      console.log(error);
      setApiError(error.response?.data?.detail || 'Login failed.');
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to VideoConnect </h1>
          <p className="text-gray-600 text-lg">
            Connect, chat, and collaborate with ease. Join video calls, create rooms, and stay connected with your team or friends!
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login to your account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}

              <Button type="submit" className="w-full mt-4">Sign In</Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <a href="/register" className="ml-1 text-primary hover:underline">Register</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
