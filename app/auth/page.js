'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Auth() {
  const supabase = createClientComponentClient();
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirectedFrom') || '/dashboard'

  const [email, setEmail] = useState("");
  const [password] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [authSession, setAuthSession] = useState(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle keyboard events for form submission
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (otpSent) {
          verifyOtp();
        } else if (isSigningUp) {
          handleEmailAuth();
        } else {
          sendOtp();
        }
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [otpSent, isSigningUp, email, password, otp]);

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const handleSuccessfulAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      localStorage.setItem('userData', JSON.stringify(session.user));
      router.push(redirectPath);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      showAlert("Please fill in all fields", "error");
      return;
    }
    setIsLoading(true);
    try {
      if (isSigningUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirectPath}` },
        });
        if (error) throw error;
        console.log('Signup data:', data);
        if (data?.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
          console.log('Stored user data:', JSON.parse(localStorage.getItem('userData')));
        }
        showAlert("Signup successful! Check your email for the verification link.", "success");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log('Login data:', data);
        if (data?.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
          console.log('Stored user data:', JSON.parse(localStorage.getItem('userData')));
        }
        showAlert("Login successful!", "success");
        handleSuccessfulAuth();
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!email) {
      showAlert("Please enter your email", "error");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      showAlert("OTP sent to your email. Please check your inbox.", "success");
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      showAlert("Please enter the OTP", "error");
      return;
    }
    if (!fullName.trim()) {
      showAlert("Please enter your full name", "error");
      return;
    }
    setIsLoading(true);
    try {
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });
      if (verifyError) throw verifyError;
      console.log('OTP verify data:', verifyData);

      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          user_name: fullName
        }
      });
      if (updateError) throw updateError;
      console.log('Update user data:', updateData);

      const userData = {
        ...verifyData.user,
        ...updateData.user
      };
      console.log('Combined user data:', userData);
      
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Stored user data:', JSON.parse(localStorage.getItem('userData')));
      }

      showAlert("Login successful!", "success");
      handleSuccessfulAuth();
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error.message);
      showAlert(error.message, "error");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  useEffect(() => {
    console.log('Auth page state:', {
      loading,
      isLoading,
      otpSent,
      isSigningUp,
      alert
    });
  }, [loading, isLoading, otpSent, isSigningUp, alert]);

  // Add these quotes
  const moodQuotes = [
    {
      quote: "Understanding your emotions is the first step to mastering them.",
      author: "Daniel Goleman"
    },
    {
      quote: "Your mood is a reflection of your thoughts, but not a definition of your future.",
      author: "Anonymous"
    },
    {
      quote: "Every emotion is a signal, every feeling a message.",
      author: "Marc Brackett"
    }
  ];

  if (loading && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-start p-4 relative overflow-hidden">
      {/* Enhanced Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-start md:pl-[15%]">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-[500px] md:w-[900px] h-[500px] md:h-[900px] rounded-full absolute"
          style={{
            background: 'linear-gradient(120deg, rgba(168, 85, 247, 0.1), rgba(255, 92, 0, 0.1))',
            border: '2px solid rgba(168, 85, 247, 0.2)'
          }}
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full absolute"
          style={{
            background: 'linear-gradient(120deg, rgba(255, 92, 0, 0.1), rgba(168, 85, 247, 0.1))',
            border: '2px solid rgba(255, 92, 0, 0.2)'
          }}
        />
      </div>

      {/* Alert Component */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 p-4 rounded-lg shadow-lg flex items-center justify-center md:justify-start ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white z-50`}
          >
            {alert.type === "success" ? (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm md:text-base">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add the right side content - hidden on mobile */}
      <div className="hidden lg:flex fixed right-0 top-0 w-1/3 h-screen bg-gradient-to-b from-purple-50 to-orange-50 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="p-8 space-y-8"
        >
          {/* Floating Mood Icons */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center space-x-4 mb-12"
          >
            {['😊', '😌', '🤔', '😔'].map((emoji, index) => (
              <motion.span
                key={index}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Animated Quote Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-serif bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Mood Analysis Insights
            </h2>
            
            {moodQuotes.map((quoteObj, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.2) }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg"
              >
                <p className="text-gray-700 italic mb-2">"{quoteObj.quote}"</p>
                <p className="text-sm text-gray-500">- {quoteObj.author}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="space-y-4 mt-8"
          >
            {[
              "Track your emotional journey",
              "Get personalized insights",
              "Build better mental habits"
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + (index * 0.2) }}
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Existing auth form content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-xl h-auto md:h-[800px] mx-auto lg:ml-[15%] text-center bg-white/80 backdrop-blur-sm p-6 md:p-12 rounded-3xl shadow-xl relative z-10 flex flex-col justify-between"
      >
        {/* Updated Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 md:mb-8">
            <svg viewBox="0 0 24 24" className="w-full h-full text-black">
              <path 
                fill="currentColor" 
                d="M12 14.5c1.9 0 3.5-1.6 3.5-3.5S13.9 7.5 12 7.5S8.5 9.1 8.5 11S10.1 14.5 12 14.5z"
              />
            </svg>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-serif mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent leading-tight"
          >
            Your Journey to Mental Well-being
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-medium text-gray-600 mb-3 md:mb-4"
          >
            Because Every Feeling Deserves a Friend
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base md:text-lg text-gray-500"
          >
            Choose a signup option below to get started.
          </motion.p>
        </div>

        {/* Form Elements with increased spacing */}
        <div className="space-y-4 md:space-y-6 flex-grow">
          {!otpSent ? (
            <>
              <motion.input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-base md:text-lg"
                placeholder="Full Name"
                disabled={isLoading}
              />
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-base md:text-lg"
                placeholder="Email Address"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendOtp}
                className="w-full px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#FF5C00] text-white text-base md:text-lg font-medium hover:bg-[#FF4500] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue with Email"}
              </motion.button>
            </>
          ) : (
            <>
              <motion.input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 md:px-6 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none text-base md:text-lg"
                placeholder="Enter OTP"
                disabled={isLoading}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={verifyOtp}
                className="w-full px-4 md:px-6 py-3 rounded-full bg-[#FF5C00] text-white text-base md:text-lg font-medium hover:bg-[#FF4500] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </motion.button>
              <div className="text-sm text-gray-600 mt-2">
                {timer > 0 ? (
                  <p>Resend OTP in {timer} seconds</p>
                ) : (
                  <button
                    onClick={sendOtp}
                    className="text-[#FF5C00] hover:underline"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Links with more spacing */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 text-sm md:text-base text-gray-500"
        >
          <p className="mb-4">
            Already have an account?{" "}
            <button 
              onClick={() => setIsSigningUp(false)} 
              className="text-[#FF5C00] hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
