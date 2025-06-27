import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetBox, setShowResetBox] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: 'Please make sure your passwords are the same.',
            variant: 'destructive',
          });
          return;
        }

        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Signup successful!',
          description: 'Welcome to SplitEase 🎉',
        });
      } else {
        await setPersistence(
          auth,
          rememberMe ? browserLocalPersistence : browserSessionPersistence
        );

        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login successful!',
          description: 'Welcome back to SplitEase.',
        });
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: isSignup ? 'Signup failed' : 'Login failed',
        description: error.message || 'Something went wrong. Try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: 'Login successful!',
        description: 'Welcome via Google.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Google login failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          {isSignup ? 'Create an account' : 'Welcome back'}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {isSignup ? 'Register to use SplitEase' : 'Sign in to your SplitEase account'}
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
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {!isSignup && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={loading}
                />
                <Label htmlFor="remember" className="text-sm text-slate-600">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowResetBox(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSignup ? 'Signing up...' : 'Signing in...'}
              </>
            ) : (
              isSignup ? 'Sign Up' : 'Sign In'
            )}
          </Button>
        </form>

        {!isSignup && (
          <div className="pt-2">
            <Button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full h-11 bg-white border border-gray-300 hover:shadow-md flex items-center justify-center space-x-3 text-sm font-medium text-gray-700 transition-all duration-200"
  disabled={loading}
>
  {loading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    <>
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span>Continue with Google</span>
    </>
  )}
</Button>

          </div>
        )}

        {showResetBox && (
          <div className="mt-4 p-4 border rounded-md bg-blue-50 text-sm text-slate-800">
            <p className="mb-2 font-medium">Reset your password</p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button
                onClick={async () => {
                  try {
                    await sendPasswordResetEmail(auth, resetEmail);
                    toast({
                      title: "Reset link sent",
                      description: "Check your email to reset your password.",
                    });
                    setShowResetBox(false);
                    setResetEmail('');
                  } catch (error: any) {
                    toast({
                      title: "Failed to send reset link",
                      description: error.message,
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-blue-600 text-white"
              >
                Send Link
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowResetBox(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL encryption</span>
        </div>

        <div className="text-center text-sm text-slate-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;