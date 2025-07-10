import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  LoaderCircle, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { registerUser } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';

// --- Helper for Password Validation ---
const passwordCriteria = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter (A–Z)', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter (a–z)', test: (v) => /[a-z]/.test(v) },
  { label: 'One number (0–9)', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character (!@#$%^&*)', test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];


const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState(null);
  const { isAuthenticated } = useSelector(state => state.auth);
  const errorFromGlob=useSelector(state=>state.auth.error)

  const {
    register,
    handleSubmit,
    watch, 
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' }); 

  const password = watch('password', '');


  const strengthScore = passwordCriteria.reduce((acc, criterion) => {
    return acc + (criterion.test(password) ? 1 : 0);
  }, 0);
  
  
  const getStrength = () => {
    if (strengthScore < 3) return { text: 'Weak', color: 'bg-brand-red', width: 'w-1/3' };
    if (strengthScore < 5) return { text: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
    return { text: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };
  const strength = getStrength();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/createWallet');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setApiError(null);
    try {
       dispatch(registerUser({ ...data }));
    } catch (error) {
      
      console.error("Registration failed:", error);
      setApiError(errorFromGlob.message || 'An unexpected error occurred.');
    }
  };
  useEffect(()=>{
    if (errorFromGlob?.message) {
      setApiError(errorFromGlob.message);
    }
  },[errorFromGlob])

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
          {/* Username Input */}
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

          {/* Email Input */}
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

          {/* Password Input with Strength Meter and Criteria */}
          <div className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  validate: {
                    allCriteriaMet: v => passwordCriteria.every(c => c.test(v)) || 'Password does not meet all criteria.',
                  }
                })}
                className={`w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input ${errors.password ? 'border-brand-red' : 'border-border-color'}`}
              />
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <p className="font-medium text-gray-300">Password Strength:</p>
                    <p className={`font-bold ${strength.text === 'Weak' ? 'text-brand-red' : strength.text === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{strength.text}</p>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-700">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
                </div>
              </div>
            )}
            
            {/* Final Validation Error Message from React Hook Form */}
            {errors.password && <p className="text-xs text-brand-red">{errors.password.message}</p>}

            {/* Dynamic Password Criteria Checklist */}
            <div className="text-xs text-gray-400 space-y-1 pl-1">
              {passwordCriteria.map((criterion, index) => {
                const isMet = criterion.test(password);
                return (
                  <div key={index} className={`flex items-center transition-colors duration-300 ${isMet ? 'text-green-400' : 'text-gray-500'}`}>
                    {isMet ? <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" /> : <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />}
                    <span>{criterion.label}</span>
                  </div>
                );
              })}
            </div>
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