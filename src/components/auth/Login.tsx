import { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import OAuthButton from './OAuthButton';
import { LogIn, signUp } from '@/services/authentication/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notifyError, notifySuccess } from '@/lib/utils';

// React Hook Form imports
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginFormSchema,
  LoginFormInputs,
  signUpFormSchema,
  SignUpFormInputs,
  forgotPasswordRequestFormSchema,
  ForgotPasswordRequestFormInputs,
  resetPasswordFormSchema,
  ResetPasswordFormInputs
} from '@/helpers/constants/zodSchema';
    import { PASSWORD_LENGTH } from '@/helpers/constants/constants';

// Define a type for the different form modes
type FormMode = 'login' | 'signup' | 'forgotPasswordRequest' | 'resetPassword';

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const currentSchema = useMemo(() => {
    switch (formMode) {
      case 'login': return loginFormSchema;
      case 'signup': return signUpFormSchema;
      case 'forgotPasswordRequest': return forgotPasswordRequestFormSchema;
      case 'resetPassword': return resetPasswordFormSchema;
      default: return loginFormSchema;
    }
  }, [formMode]);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Function to reset form fields and errors
    setValue, // Function to programmatically set field values
    getValues, // Function to get current field values
  } = useForm<LoginFormInputs | SignUpFormInputs | ForgotPasswordRequestFormInputs | ResetPasswordFormInputs>({
    resolver: zodResolver(currentSchema),
    // Set default values based on mode if needed, or leave empty
    defaultValues: {},
  });

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      if (event.data?.type === 'oauth-success') {
        notifySuccess("Login successful");
        window.location.href = "/dashboard";
      } else if (event.data?.type === 'oauth-error') {
        notifyError({ message: event.data.error || "OAuth failed" });
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resetToken) {
      setFormMode('resetPassword');
      // If the email was part of the reset token payload, you could set it here
      // For now, email field is not displayed in resetPassword mode.
    }
    // Reset form when formMode changes to clear previous field values and errors
    reset();
  }, [formMode, resetToken, reset]); // Add reset to dependency array

  // Dynamic onSubmit handler based on formMode
  const onSubmit: SubmitHandler<any> = async (data) => { // Use 'any' for data to accommodate different schema types
    setIsSubmitting(true);

    try {
      if (formMode === 'signup') {
        const signUpData = data as SignUpFormInputs;
        const signUpFormData = {
          email: signUpData.email,
          password: signUpData.password,
          username: signUpData.fullName,
        };
        const response = await signUp(signUpFormData);
        notifySuccess("Signup successful. Please log in.");
        handleModeSwitch('login');
        console.log("Signup successful:", response);
      } else if (formMode === 'login') {
        const loginData = data as LoginFormInputs;
        const loginFormData = {
          email: loginData.email,
          password: loginData.password,
        };
        const response = await LogIn(loginFormData);
        notifySuccess("Login successful");
        console.log("Login successful:", response);
        navigate("/dashboard");
      } else if (formMode === 'forgotPasswordRequest') {
        const requestData = data as ForgotPasswordRequestFormInputs;
        const resetRequestData = { email: requestData.email };
        console.log("Sending password reset request for:", resetRequestData);
        // await requestPasswordReset(resetRequestData);
        notifySuccess("If an account with that email exists, a password reset link has been sent.");
        reset({ email: '' }); // Clear email field after sending request
      } else if (formMode === 'resetPassword') {
        const resetData = data as ResetPasswordFormInputs;
        if (!resetToken) {
          notifyError({ message: "Invalid or missing reset token." });
          return;
        }
        const passwordResetData = {
          token: resetToken,
          newPassword: resetData.newPassword,
        };
        // await resetPassword(passwordResetData);
        console.log("Resetting password with data:", passwordResetData);
        notifySuccess("Your password has been reset successfully. Please log in.");
        handleModeSwitch('login');
        navigate('/login', { replace: true });
      }
    } catch (error: any) {
      // console.error(`${formMode} error:`, error);
      notifyError({
        message: `${formMode === 'signup' ? "Signup" : formMode === 'login' ? "Login" : formMode === 'forgotPasswordRequest' ? "Password reset request" : "Password reset"} failed. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSwitch = (mode: FormMode) => {
    setFormMode(mode);
    reset(); // Reset form when changing modes to clear all fields and errors
    if (mode !== 'resetPassword' && resetToken) {
      navigate(location.pathname, { replace: true });
    }
  };

  const isSignUp = formMode === 'signup';
  const isLogin = formMode === 'login';
  const isForgotPasswordRequest = formMode === 'forgotPasswordRequest';
  const isResetPassword = formMode === 'resetPassword';

  // Helper to get error messages
  const getErrorMessage = (fieldName: string) => {
    // RHF errors structure is errors.fieldName?.message
    return (errors as any)[fieldName]?.message;
  };

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
            {/* Wrap the form with RHF's handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300 text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    {...register('fullName')} // Register the input
                    className={`h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all ${getErrorMessage('fullName') ? 'border-red-500' : ''}`}
                  />
                  {getErrorMessage('fullName') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('fullName')}</p>}
                </div>
              )}

              {!isResetPassword && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-base">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    <Input
                      id="email"
                      placeholder="finance@example.com"
                      type="email"
                      {...register('email')} // Register the input
                      className={`pl-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all ${getErrorMessage('email') ? 'border-red-500' : ''}`}
                    />
                    {getErrorMessage('email') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('email')}</p>}
                  </div>
                </div>
              )}

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
                      {...register('password')} // Register the input
                      className={`pl-10 pr-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all ${getErrorMessage('password') ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-5 w-5 text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {getErrorMessage('password') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('password')}</p>}
                  {isSignUp && (
                    <p className="text-xs text-gray-400">Password must be at least {PASSWORD_LENGTH.MINIMUM} characters long and include uppercase, lowercase, number, and special character.</p>
                  )}
                </div>
              )}

              {isResetPassword && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300 text-base">New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...register('newPassword')} // Register the input
                        className={`pl-10 pr-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all ${getErrorMessage('newPassword') ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 h-5 w-5 text-gray-500 hover:text-blue-400 transition-colors"
                      >
                        {showNewPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {getErrorMessage('newPassword') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('newPassword')}</p>}
                    <p className="text-xs text-gray-400">New password must be at least {PASSWORD_LENGTH.MINIMUM} characters long and include uppercase, lowercase, number, and special character.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-gray-300 text-base">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...register('confirmNewPassword')} // Register the input
                      className={`pl-10 h-12 bg-[#1c2136] border-[#2a3149] text-white focus:ring-[#6366F1] focus:border-[#6366F1] transition-all ${getErrorMessage('confirmNewPassword') ? 'border-red-500' : ''}`}
                    />
                    {getErrorMessage('confirmNewPassword') && <p className="text-red-500 text-sm mt-1">{getErrorMessage('confirmNewPassword')}</p>}
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

              {!isResetPassword && (
                <div className="text-center text-base text-gray-400">
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(isSignUp || isForgotPasswordRequest ? 'login' : 'signup')}
                    className="text-[#6366F1] hover:text-[#A855F7] transition-colors hover:underline"
                  >
                    {isSignUp || isForgotPasswordRequest ? "Sign in" : "Sign up"}
                  </button>
                </div>
              )}

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

            {(isLogin || isSignUp || isForgotPasswordRequest) && (
              <div className="mt-6">
                <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                  Or {isSignUp ? 'sign up' : 'sign in'} with
                </div>
                <div className="flex gap-4 justify-center">
                  <OAuthButton provider="google" />
                  {/* <OAuthButton provider="github" /> */}
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

export default Login;