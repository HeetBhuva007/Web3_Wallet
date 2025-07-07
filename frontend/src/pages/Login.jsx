import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
 // Changed Wallet to ShieldCheck for a security feel

const LoginPage = () => {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const dispatch=useDispatch();
  const {isAuthenticated,user}=useSelector(state=>state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    
    if(isAuthenticated){
        const check=async()=>{
            try{
            const response = await axiosClient.get("/wallet/getWallet")
            
            if (response.data.wallet) {
                navigate("/dashboard"); // Wallet exists
            }
    
        }
        catch(err){
            if (err.response && err.response.status === 404) {
                navigate("/createWallet"); // No wallet
              } else {
                console.error("Error checking wallet", err);
              }
        }
    }
    check();
         
    }
  }, [isAuthenticated])

  const onSubmit = async (data) => {
    setBackendError(null);
    try{
        dispatch(loginUser({...data}))
    }
    catch(err){
        setBackendError("Invalid credentials. Please check and try again.");
    }
    
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen p-4 font-mono noise-background">
      
      {/* The main form card using our new class */}
      <div className="w-full max-w-sm p-8 space-y-6 backpack-card">
        <div className="text-center">
          <div className="flex justify-center mb-4">
             {/* Use the new brand-red color */}
             <ShieldCheck className="w-12 h-12 text-brand-red" />
          </div>
          <h1 className="text-2xl font-bold text-text-color">Secure Login</h1>
          <p className="mt-2 text-sm text-gray-400">Access your command center</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="user@domain.com"
              {...register('emailId', { 
                required: "Email is required",
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email format" }
              })}
              // Apply the new input class
              className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.email ? 'border-brand-red' : 'border-border-color'}`}
            />
            {errors.email && <p className="mt-2 text-xs text-brand-red">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              {...register('password', {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" }
              })}
              // Apply the new input class
              className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.password ? 'border-brand-red' : 'border-border-color'}`}
            />
            {errors.password && <p className="mt-2 text-xs text-brand-red">{errors.password.message}</p>}
          </div>

          {backendError && (
             <div className="p-3 text-center text-sm text-brand-red bg-brand-red/10 rounded-lg border border-brand-red/30">
                {backendError}
             </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg backpack-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                  Authenticating...
                </>
              ) : (
                'Unlock'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>
            Need a wallet?{' '}
            <a href="/register" className="font-medium text-brand-red hover:underline">
              Create One
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;