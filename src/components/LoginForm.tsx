
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Shield, Smartphone } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // Here you would typically handle the login logic
  };

  const handleRememberMeChange = (checked: boolean | 'indeterminate') => {
    setRememberMe(checked === true);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">Welcome back</CardTitle>
        <CardDescription className="text-slate-600">
          Sign in to your SplitEase account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={handleRememberMeChange}
              />
              <Label htmlFor="remember" className="text-sm text-slate-600">
                Remember me
              </Label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Forgot password?
            </a>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Sign In
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL encryption</span>
        </div>
        
        <div className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
