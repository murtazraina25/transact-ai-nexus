import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import OAuthButton from './OAuthButton';
import { LogIn, signUp } from '@/services/authentication/auth'; // Assuming these services exist
import { LoginFormData, SignUpFormData, ResetPasswordRequestData, ResetPasswordData } from '@/types/models/auth'; // Assuming these types exist
import { useNavigate, useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { notifyError, notifySuccess } from '@/lib/utils';

// Define a type for the different form modes
type FormMode = 'login' | 'signup' | 'forgotPasswordRequest' | 'resetPassword';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('login'); // New state for form mode
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // For new password field

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to access URL search parameters
  const resetToken = searchParams.get('token'); // Get the token from URL

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check for resetToken in URL on component mount
    if (resetToken) {
      setFormMode('resetPassword');
      // Optionally, you might want to decode the token to get the email
      // if your backend encodes it, or if it's sent separately.
      // For now, we'll assume the email needs to be entered again by the user
      // or that the backend handles email verification via the token itself.
    }
  }, [resetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formMode === 'signup') {
        if (!email || !password || !fullName) {
          notifyError({ message: "All fields are required for signup" });
          return;
        }
        const signUpFormData: SignUpFormData = {
          email,
          password,
          username: fullName,
        };
        const response = await signUp(signUpFormData);
        notifySuccess("Signup successful. Please log in.");
        handleModeSwitch('login'); // Switch to login mode after successful signup
        console.log("Signup successful:", response);
      } else if (formMode === 'login') {
        if (!email || !password) {
          notifyError({ message: "Email and password are required" });
          return;
        }
        const loginFormData: LoginFormData = {
          email,
          password,
        };
        const response = await LogIn(loginFormData);
        notifySuccess("Login successful");
        console.log("Login successful:", response);
        navigate("/dashboard");
      } else if (formMode === 'forgotPasswordRequest') {
        if (!email) {
          notifyError({ message: "Please enter your email address" });
          return;
        }
        const resetRequestData: ResetPasswordRequestData = { email };
        console.log("Sending password reset request for:", resetRequestData);
        // await requestPasswordReset(resetRequestData); // Call your backend service
        notifySuccess("If an account with that email exists, a password reset link has been sent.");
        setEmail(''); // Clear email field after sending request
      } else if (formMode === 'resetPassword') {
        if (!newPassword || !confirmNewPassword || !resetToken) {
          notifyError({ message: "All fields and a valid token are required." });
          return;
        }
        if (newPassword !== confirmNewPassword) {
          notifyError({ message: "New passwords do not match." });
          return;
        }
        if (newPassword.length < 6) {
          notifyError({ message: "New password must be at least 6 characters long." });
          return;
        }

        const resetData: ResetPasswordData = {
          token: resetToken,
          newPassword,
        };
        // await resetPassword(resetData); // Call your backend service
        console.log("Resetting password with data:", resetData);
        notifySuccess("Your password has been reset successfully. Please log in.");
        handleModeSwitch('login'); // Go back to login after reset
        navigate('/login', { replace: true }); // Clean the URL after successful reset
      }
    } catch (error) {
      console.error(`${formMode} error:`, error);
      notifyError({
        message: `${formMode === 'signup' ? "Signup" : formMode === 'login' ? "Login" : formMode === 'forgotPasswordRequest' ? "Password reset request" : "Password reset"} failed. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSwitch = (mode: FormMode) => {
    setFormMode(mode);
    setEmail('');
    setPassword('');
    setFullName('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPassword(false);
    setShowNewPassword(false);
    // If switching from resetPassword mode, remove the token from URL
    if (mode !== 'resetPassword' && resetToken) {
        navigate(location.pathname, { replace: true }); // Remove search params
    }
  };

  const isSignUp = formMode === 'signup';
  const isLogin = formMode === 'login';
  const isForgotPasswordRequest = formMode === 'forgotPasswordRequest';
  const isResetPassword = formMode === 'resetPassword';

  return (
    <div className="flex min-h-screen bg-[#101322] overflow-hidden">
      {/* Left Panel (60%) - Hero Section */}
      <div
        className={`hidden md:flex md:w-[60%] flex-col justify-center items-start p-8 lg:p-16 xl:p-24 text-white relative transition-all duration-1000 ease-out ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D2E] to-[#101322] opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-purple-900/10 animate-flow"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center mb-16">
            <img
              src="/lovable-uploads/27845ced-a36a-431c-8cd1-5016f13aab53.png"
              alt="Z-Transact logo"
              className="h-16 w-auto"
            />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-gradient">
            Z-Transact
          </h1>

          <h2 className="text-xl md:text-2xl mb-8 text-blue-200 font-light">
            Built to Think Like an Auditor
          </h2>

          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              Intelligent automation for finance and audit operations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel (40%) - Login/Signup Form */}
      <div
        className={`w-full md:w-[40%] flex items-center justify-center px-6 py-12 bg-[#0e111b]/80 transition-all duration-1000 ease-out ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
      >
        <Card className="w-full max-w-md shadow-xl border-[#2a3149] bg-[#151929]/90 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-center items-center mb-4">
              <div className="md:hidden mb-4">
                <img src="/lovable-uploads/27845ced-a36a-431c-8cd1-5016f13aab53.png" alt="Z-Transact logo" className="h-10" />
              </div>
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] flex items-center justify-center shadow-glow">
                <span className="text-white text-3xl font-bold">Z</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center text-white">
              {isSignUp ? 'Create Account' : isLogin ? 'Welcome Back' : isForgotPasswordRequest ? 'Forgot Password?' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-center text-gray-400 text-lg">
              {isSignUp ? 'Join Z-Transact today' : isLogin ? 'Access your AI-powered assistant' : isForgotPasswordRequest ? 'Enter your email to receive a password reset link.' : 'Enter your new password.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300 text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                    required={isSignUp}
                  />
                </div>
              )}

              {/* Email Field - Always visible */}
              {!isResetPassword && <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-base">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    placeholder="finance@example.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                    required
                    // readOnly={isResetPassword} // Email should be read-only when resetting password
                  />
                </div>
              </div>}

              {/* Password Field - Only for Login/Signup */}
              {(isLogin || isSignUp) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300 text-base">Password</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => handleModeSwitch('forgotPasswordRequest')}
                        className="text-sm text-[#6366F1] hover:text-[#A855F7] transition-colors hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                      required
                      minLength={isSignUp ? 6 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-5 w-5 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-gray-400">Password must be at least 6 characters long</p>
                  )}
                </div>
              )}

              {/* New Password and Confirm New Password Fields - Only for Reset Password */}
              {isResetPassword && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300 text-base">New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 h-5 w-5 text-gray-500 hover:text-blue-400 transition-colors"
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">New password must be at least 6 characters long</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-gray-300 text-base">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      className="pl-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#5254CD] hover:to-[#9546D5] text-white font-medium text-base transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? (isSignUp ? "Creating account..." : isLogin ? "Signing in..." : isForgotPasswordRequest ? "Sending link..." : "Resetting password...")
                  : (isSignUp ? "Create Account" : isLogin ? "Sign in" : isForgotPasswordRequest ? "Send Reset Link" : "Reset Password")}
              </Button>

              {/* Mode Switcher for Login/Signup/Forgot Password Request (not for resetPassword) */}
              {!isResetPassword && (
                <div className="text-center text-base text-gray-400">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  {/* {isForgotPasswordRequest ? "Remember your password? " : null} */}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(isSignUp || isForgotPasswordRequest ? 'login' : 'signup')}
                    className="text-[#6366F1] hover:text-[#A855F7] transition-colors hover:underline"
                  >
                    {isSignUp || isForgotPasswordRequest ? "Sign in" : "Sign up"}
                  </button>
                </div>
              )}

              {/* Back to Login button for Reset Password mode */}
              {isResetPassword && (
                <div className="text-center text-base text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="text-[#6366F1] hover:text-[#A855F7] transition-colors hover:underline"
                  >
                    Back to Sign in
                  </button>
                </div>
              )}
            </form>

            {/* OAuth Buttons - Visible for Login/Signup (and maybe forgot password request, depending on preference) */}
            {(isLogin || isSignUp || isForgotPasswordRequest) && (
              <div className="mt-6">
                <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                  Or {isSignUp ? 'sign up' : 'sign in'} with
                </div>
                <div className="flex gap-4 justify-center">
                  <OAuthButton provider="google" />
                  <OAuthButton provider="microsoft" />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center pt-0 text-gray-500">
            <p className="text-xs">
              Copyright © 2025 yavar Techworks Pte Ltd., All rights reserved
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;