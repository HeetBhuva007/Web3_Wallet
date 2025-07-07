import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, LoaderCircle } from 'lucide-react';
import { registerUser } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';




const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [apiError, setApiError] = useState(null);
  const {isAuthenticated}=useSelector(state=>state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm(); 
  useEffect(()=>{
    if(isAuthenticated)
        navigate('/createWallet')
  },[isAuthenticated])
  const onSubmit = async (data) => {
    setApiError(null);
    try {
      
      dispatch(registerUser({...data}))

      

    } catch (error) {
      console.error("Registration failed:", error);
      setApiError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-mono noise-background text-text-color">
      <div className="w-full max-w-sm p-8 space-y-6 backpack-card">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <UserPlus size={40} className="text-brand-red" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-400">Join the future of finance.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username Input with built-in validation */}
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="userName"
              type="text"
              placeholder="Username"
              {...register('userName', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' }
              })}
              className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.userName ? 'border-brand-red' : 'border-border-color'}`}
            />
            {errors.userName && <p className="mt-2 text-xs text-brand-red">{errors.userName.message}</p>}
          </div>

          {/* Email Input with built-in validation */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="emailId"
              type="email"
              placeholder="Email Address"
              {...register('emailId', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              })}
              className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.emailId ? 'border-brand-red' : 'border-border-color'}`}
            />
            {errors.emailId && <p className="mt-2 text-xs text-brand-red">{errors.emailId.message}</p>}
          </div>

          {/* Password Input with built-in validation */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.password ? 'border-brand-red' : 'border-border-color'}`}
            />
            {errors.password && <p className="mt-2 text-xs text-brand-red">{errors.password.message}</p>}
          </div>
          
          {/* API Error Display */}
          {apiError && (
             <div className="p-3 text-center text-sm text-brand-red bg-brand-red/10 rounded-lg border border-brand-red/30">
                {apiError}
             </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg backpack-button disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-red hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;