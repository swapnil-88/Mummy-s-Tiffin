import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  MapPin,
  Building,
  ChefHat,
  Sparkles,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  KeyRound,
  ArrowRight,
  RefreshCw,
  UtensilsCrossed,
  HeartHandshake,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { VADODARA_AREAS } from '../data/mockData';
import { UserRole, Profession } from '../types';

type AuthLoginMethod = 'password' | 'otp' | 'quick';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, loginAsChef, signup, mothers, addToast } =
    useAppStore();

  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScgxOdVt-gXWTV_iDeWx6Uu7T-KSNtP3W4pGmunF4KGMuzICA/viewform';

  // Main navigation tab: 'login' | 'signup' | 'forgot'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loginMethod, setLoginMethod] = useState<AuthLoginMethod>('password');

  // Role
  const [role, setRole] = useState<UserRole>('customer');
  const [selectedMotherId, setSelectedMotherId] = useState('mother-1');

  // Form fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [otpPhone, setOtpPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Sign up fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [profession, setProfession] = useState<Profession>('Student');
  const [dietaryPref, setDietaryPref] = useState<
    'Pure Veg' | 'Pure Jain' | 'Kathiyawadi / Gujarati' | 'Regular'
  >('Pure Veg');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(VADODARA_AREAS[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  if (!isAuthModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Enter password', color: 'bg-stone-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Strong', color: 'bg-emerald-500' };
    return { score: 100, label: 'Bank-Grade Secure', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(signupPassword);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNumber = otpPhone.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      addToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }
    setOtpSent(true);
    setOtpTimer(30);
    setEnteredOtp('4321'); // Pre-fill for ease of demonstration
    addToast(`🔒 Security Code 4321 sent to +91 ${cleanNumber}`, 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== '4321' && enteredOtp.length < 4) {
      addToast('Invalid Security OTP. Use demo code: 4321', 'error');
      return;
    }
    setIsVerifyingOtp(true);
    setTimeout(() => {
      setIsVerifyingOtp(false);
      login(`+91 ${otpPhone}`, role);
    }, 600);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      addToast('Please enter your email or mobile number', 'error');
      return;
    }
    if (role === 'chef') {
      loginAsChef(selectedMotherId, emailOrPhone);
    } else {
      login(emailOrPhone, role);
    }
  };

  const handleQuickDemoLogin = (profileType: 'student' | 'employee' | 'chef') => {
    if (profileType === 'chef') {
      loginAsChef('mother-1', 'lina.patel@mummystiffin.com');
    } else if (profileType === 'employee') {
      login('pooja.shah@lt.com', 'customer');
    } else {
      login('karan.mehta@msu.ac.in', 'customer');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!signupEmail.trim() && !signupPhone.trim()) {
      addToast('Please provide an email or phone number', 'error');
      return;
    }
    if (!agreeTerms) {
      addToast('Please accept the Food Safety and Confidentiality Terms', 'error');
      return;
    }

    signup({
      name,
      email: signupEmail || `${signupPhone.replace(/\D/g, '')}@user.mummystiffin.in`,
      phone: signupPhone.startsWith('+91') ? signupPhone : `+91 ${signupPhone || '9876543210'}`,
      role,
      profession,
      dietaryPreference: dietaryPref,
      address: address || `${area}, Vadodara`,
      area,
      authMethod: 'password',
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier) {
      addToast('Please enter your registered email or phone', 'error');
      return;
    }
    setForgotSent(true);
    addToast('🔒 Password reset link & OTP sent to your registered contact.', 'success');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2C1810]/80 backdrop-blur-md overflow-hidden"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#FFFDF9] border border-[#E5C3A6] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5C3A6]/60 bg-[#F5EBE1] shrink-0 z-20">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted & Confidential</span>
              </div>
              <h2 className="font-rozha text-xl sm:text-2xl text-[#2C1810] leading-tight">
                {activeTab === 'signup'
                  ? "Create Verified Account"
                  : activeTab === 'forgot'
                  ? "Recover Your Account"
                  : "Sign In to Mummy's Tiffin"}
              </h2>
              <p className="text-[11px] text-[#8C6B53]">
                {activeTab === 'signup'
                  ? 'Join 500+ MSU students & working professionals in Vadodara'
                  : activeTab === 'forgot'
                  ? 'Enter your phone or email to securely restore access'
                  : 'Ghar jaisa swad delivered fresh every day'}
              </p>
            </div>
            <button
              onClick={closeAuthModal}
              className="w-9 h-9 rounded-full bg-white text-[#2C1810] shadow-sm border border-[#E5C3A6] hover:bg-[#F5EBE1] active:scale-95 transition-all shrink-0 ml-3 flex items-center justify-center"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-[#2C1810]" />
            </button>
          </div>

          {/* Confidentiality & Security Assurance Pill */}
          <div className="bg-emerald-950 text-emerald-100 px-4 py-2 text-[11px] flex items-center justify-between gap-2 border-b border-emerald-900">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Confidentiality Guarantee:</strong> Address & contact details are never shared or spammed.
              </span>
            </div>
            <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full font-mono text-emerald-200 shrink-0 hidden sm:inline-block">
              FSSAI Verified
            </span>
          </div>

          {/* Main Scrollable Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {/* Primary Tab Switcher (Log In vs Sign Up) */}
            {activeTab !== 'forgot' && (
              <div className="grid grid-cols-2 p-1 bg-[#F5EBE1] rounded-2xl border border-[#E5C3A6]/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-[#D97706] shadow-sm'
                      : 'text-[#6B3A19] hover:text-[#2C1810]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-[#D97706] shadow-sm'
                      : 'text-[#6B3A19] hover:text-[#2C1810]'
                  }`}
                >
                  Create New Account
                </button>
              </div>
            )}

            {/* Role Switcher (Customer / Mother Chef) */}
            {activeTab !== 'forgot' && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFFDF9] rounded-2xl border border-[#E5C3A6]">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    role === 'customer'
                      ? 'bg-[#2C1810] text-amber-200 shadow-sm'
                      : 'text-[#6B3A19] hover:text-[#2C1810] bg-[#F5EBE1]/40'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" /> Customer (Eater)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('chef')}
                  className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                    role === 'chef'
                      ? 'bg-[#2C1810] text-amber-200 shadow-sm'
                      : 'text-[#6B3A19] hover:text-[#2C1810] bg-[#F5EBE1]/40'
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5" /> Mother Chef (Partner)
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 1: LOG IN */}
            {/* ========================================================================= */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                {/* Login Method Sub-Tabs */}
                {role === 'customer' && (
                  <div className="flex border-b border-[#E5C3A6]/60 gap-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('password')}
                      className={`pb-2 transition-colors relative ${
                        loginMethod === 'password'
                          ? 'text-[#D97706] border-b-2 border-[#D97706]'
                          : 'text-[#8C6B53] hover:text-[#2C1810]'
                      }`}
                    >
                      Password Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('otp')}
                      className={`pb-2 transition-colors relative flex items-center gap-1.5 ${
                        loginMethod === 'otp'
                          ? 'text-[#D97706] border-b-2 border-[#D97706]'
                          : 'text-[#8C6B53] hover:text-[#2C1810]'
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>Instant Phone OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('quick')}
                      className={`pb-2 transition-colors relative flex items-center gap-1.5 ${
                        loginMethod === 'quick'
                          ? 'text-[#D97706] border-b-2 border-[#D97706]'
                          : 'text-[#8C6B53] hover:text-[#2C1810]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>1-Click Test</span>
                    </button>
                  </div>
                )}

                {/* Sub-Method 1: Password Login */}
                {loginMethod === 'password' && (
                  <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                    {role === 'chef' && (
                      <div>
                        <label className="block text-xs font-bold text-[#2C1810] mb-1">
                          Select Registered Mother Chef Kitchen
                        </label>
                        <div className="relative">
                          <ChefHat className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3 z-10" />
                          <select
                            value={selectedMotherId}
                            onChange={(e) => setSelectedMotherId(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                          >
                            {mothers.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.area} Kitchen)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#2C1810] mb-1">
                        {role === 'chef' ? 'Kitchen Email or Phone' : 'Email Address or Mobile Number'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder={
                            role === 'chef'
                              ? 'lina.patel@mummystiffin.com or 98250 11223'
                              : 'karan@msu.ac.in or 98765 43210'
                          }
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-[#2C1810]">Password</label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('forgot')}
                          className="text-[11px] font-semibold text-[#D97706] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your confidential password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8C6B53]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-[#D97706] focus:ring-[#D97706]"
                        />
                        <span>Remember me on this device</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {role === 'chef' ? 'Secure Log In to Kitchen Portal' : 'Secure Log In'}
                      </span>
                    </button>
                  </form>
                )}

                {/* Sub-Method 2: Phone OTP Verification */}
                {loginMethod === 'otp' && role === 'customer' && (
                  <div className="space-y-3.5">
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-[#2C1810] mb-1">
                            10-Digit Mobile Number (+91)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-stone-500">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              required
                              value={otpPhone}
                              onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="9876543210"
                              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs font-bold tracking-wider text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                            />
                          </div>
                          <span className="text-[10px] text-[#8C6B53] mt-1 block">
                            We'll send a 4-digit verification code via SMS / WhatsApp.
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Send 4-Digit Security Code</span>
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-3">
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Code sent to +91 {otpPhone}</span>
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="text-[11px] text-[#D97706] underline font-bold"
                            >
                              Change
                            </button>
                          </div>
                          <p className="text-[11px] text-amber-800">
                            Demo Code: <strong className="text-emerald-700 font-mono">4321</strong>
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#2C1810] mb-1">
                            Enter 4-Digit Security Code
                          </label>
                          <div className="relative">
                            <KeyRound className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                            <input
                              type="text"
                              maxLength={4}
                              required
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="4321"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-center text-lg font-mono font-bold tracking-widest text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#8C6B53]">
                          <span>
                            {otpTimer > 0 ? (
                              `Resend in ${otpTimer}s`
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSendOtp()}
                                className="font-bold text-[#D97706] underline flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" /> Resend Code
                              </button>
                            )}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Secure
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={isVerifyingOtp}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          {isVerifyingOtp ? (
                            <span>Verifying Credentials...</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Sign In</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Sub-Method 3: 1-Click Test Demo Logins */}
                {loginMethod === 'quick' && role === 'customer' && (
                  <div className="space-y-2.5">
                    <span className="text-[11px] text-[#8C6B53] block">
                      Instantly test the verified user experience with one click:
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('student')}
                      className="w-full p-3 rounded-2xl bg-[#F5EBE1] border border-[#E5C3A6] text-left hover:border-[#D97706] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-xs">
                          🎓
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#2C1810]">Karan Mehta</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                              Verified Student
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8C6B53] block">
                            MSU Tech Campus • Fatehgunj Hostel
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('employee')}
                      className="w-full p-3 rounded-2xl bg-[#F5EBE1] border border-[#E5C3A6] text-left hover:border-[#D97706] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-xs">
                          💼
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#2C1810]">Pooja Shah</span>
                            <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                              Working Pro
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8C6B53] block">
                            L&T Knowledge City • Akota Resident
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('chef')}
                      className="w-full p-3 rounded-2xl bg-[#F5EBE1] border border-[#E5C3A6] text-left hover:border-[#D97706] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-xs">
                          👩‍🍳
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-[#2C1810]">Lina Patel</span>
                            <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                              Mother Chef
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8C6B53] block">
                            Fatehgunj Kitchen • Gujarati Specialty
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: SIGN UP */}
            {/* ========================================================================= */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2C1810] mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Devanshi Bhatt"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>
                </div>

                {/* Mobile & Email in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="devanshi@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                      />
                    </div>
                  </div>
                </div>

                {/* Password with Strength Meter */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#2C1810]">Create Password</label>
                    <span className="text-[10px] font-bold text-stone-500">{strength.label}</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full h-1 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>

                {/* Profession & Dietary Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">Profession</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                      <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value as Profession)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                      >
                        <option value="Student">Student (MSU / Parul / ITM)</option>
                        <option value="Employee">Working Professional</option>
                        <option value="Other">Vadodara Resident</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Dietary Preference
                    </label>
                    <div className="relative">
                      <UtensilsCrossed className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                      <select
                        value={dietaryPref}
                        onChange={(e) => setDietaryPref(e.target.value as any)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                      >
                        <option value="Pure Veg">Pure Veg (Standard)</option>
                        <option value="Pure Jain">Pure Jain (No Onion/Garlic)</option>
                        <option value="Kathiyawadi / Gujarati">Kathiyawadi / Gujarati</option>
                        <option value="Regular">Regular Homestyle</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Vadodara Area & Detailed Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Vadodara Area / Locality
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full pl-10 pr-2 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                      >
                        {VADODARA_AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2C1810] mb-1">
                      Hostel Room / Flat / Society
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Room 204, MSU Hostel No. 4"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>
                </div>

                {/* Confidentiality & Food Safety Agreement */}
                <div className="p-3 rounded-2xl bg-[#F5EBE1]/60 border border-[#E5C3A6]/80 text-[11px] text-[#6B3A19] space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#D97706] focus:ring-[#D97706]"
                    />
                    <span>
                      I agree to the <strong>Confidentiality Policy & Food Safety Guidelines</strong> of Mummy's Tiffin Vadodara. My details will remain 100% private.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] hover:from-[#B45309] hover:to-[#C05621] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Start Ordering</span>
                </button>
              </form>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: FORGOT PASSWORD / ACCOUNT RECOVERY */}
            {/* ========================================================================= */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                {!forgotSent ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-3.5">
                    <p className="text-xs text-[#8C6B53]">
                      Enter the email or 10-digit mobile number associated with your Mummy's Tiffin account. We'll send you an instant verification code to safely recover your account.
                    </p>

                    <div>
                      <label className="block text-xs font-bold text-[#2C1810] mb-1">
                        Registered Email or Mobile Number
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#B45309] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="e.g. karan@msu.ac.in or 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5C3A6] text-xs text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D97706] to-[#E07A5F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Send Recovery Instructions</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-900">Recovery Code Dispatched</h4>
                      <p className="text-xs text-emerald-800">
                        We sent a secure 6-digit recovery PIN to <strong>{forgotIdentifier}</strong>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setForgotSent(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#2C1810] text-amber-200 text-xs font-bold hover:bg-[#3D2218]"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-full text-center text-xs font-bold text-[#8C6B53] hover:text-[#2C1810]"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Mother Chef Partner Registration Callout */}
            {role === 'chef' && activeTab === 'login' && (
              <div className="mt-4 pt-3 border-t border-[#E5C3A6]/60 text-center space-y-2">
                <span className="text-xs text-[#8C6B53] block font-medium">
                  Want to register a new mother kitchen in Vadodara?
                </span>
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#2C1810] text-amber-200 text-xs font-bold hover:bg-[#3D2218] transition-colors"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                  <span>Register Your Mother Kitchen (FSSAI Verified)</span>
                </a>
              </div>
            )}

            {/* Tab switch footer helper */}
            {activeTab !== 'forgot' && (
              <div className="pt-2 text-center text-xs text-[#8C6B53]">
                {activeTab === 'signup' ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="font-bold text-[#D97706] underline"
                    >
                      Sign In here
                    </button>
                  </p>
                ) : (
                  <p>
                    New to Mummy's Tiffin?{' '}
                    <button
                      onClick={() => setActiveTab('signup')}
                      className="font-bold text-[#D97706] underline"
                    >
                      Create a free account
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
