import React, { useState } from 'react';
import { Eye, EyeOff, Loader, User } from 'lucide-react';

function LoginPage() {
  const [username, setUsername] = useState('@kce.ac.in');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation error states
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  // Handle Input Changes and clear specific validation errors
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  // Basic Form Validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim() || username.trim() === '@kce.ac.in') {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Login Handler (Simulates API latency & logs credentials)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay of 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Console log for credentials (temporary, for future JWT Spring Boot integration)
      console.log('Login credentials submitted:', {
        username,
        password,
        rememberMe,
      });

      // API Integration Point:
      // const response = await authService.login({ username, password });
      // handleJwtToken(response.token);

    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Disable Login button if either fields are empty or username is just the default domain
  const isFormEmpty = !username.trim() || username.trim() === '@kce.ac.in' || !password;

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col justify-between font-sans text-gray-800 antialiased">

      {/* Main Login Form Card Area */}
      <main className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-gray-100/50 p-8 sm:p-12 flex flex-col items-center">
          
          {/* Circular Profile Icon */}
          <div className="w-20 h-20 rounded-full bg-[#ffebd9] flex items-center justify-center mb-6">
            <User className="w-9 h-9 text-[#ea580c]" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-medium text-gray-800 mb-8 tracking-tight">Log In</h2>

          {/* Form */}
          <form className="w-full space-y-5" onSubmit={handleLogin}>
            {/* Username/Email Field */}
            <div className="space-y-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={handleUsernameChange}
                placeholder="@kce.ac.in"
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#ea580c] transition-all duration-200 text-gray-900 placeholder-gray-400 text-base ${
                  errors.username 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-orange-200 focus:border-orange-500'
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-500 pl-1 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="......"
                  className={`w-full pl-4 pr-12 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#ea580c] transition-all duration-200 text-gray-900 placeholder-gray-400 text-base ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-orange-200 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ea580c] hover:opacity-85 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 pl-1 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Action Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 font-semibold text-[#ea580c] rounded-lg bg-[#ffebd9] transition-all duration-200 flex items-center justify-center gap-2 select-none border border-transparent cursor-pointer ${
                  isLoading
                    ? 'opacity-60 cursor-not-allowed shadow-none'
                    : 'hover:bg-[#ffd1b3] hover:text-[#c2410c] hover:shadow-[0_4px_15px_rgba(234,88,12,0.08)] active:bg-[#ffbe94]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 text-[#ea580c]" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-6 text-center text-xs text-gray-400 font-normal">
        Copyright 2025©{' '}
        <a href="#byteforge" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">
          ByteForge
        </a>{' '}
        |{' '}
        <a href="#contact" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">
          Contact
        </a>{' '}
        |{' '}
        <a href="#about" onClick={(e) => e.preventDefault()} className="text-blue-500 hover:underline">
          About
        </a>
      </footer>
    </div>
  );
}

export default LoginPage;