import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  Sparkles, Mail, Lock, User, Calendar, MapPin, 
  Compass, ArrowRight, Eye, EyeOff, Shield, ArrowLeft 
} from 'lucide-react';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const CAREER_INTERESTS = [
  'Engineering & Tech', 'Medicine & Healthcare', 'Arts & Humanities', 
  'Business & Finance', 'Pure Sciences', 'Coding & Software', 
  'Social Work & Teaching', 'Design & Creativity', 'Agriculture & Farming'
];

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [currentClass, setCurrentClass] = useState<'Class 10' | 'Class 12' | ''>('');
  const [district, setDistrict] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isAdminMode) {
        // Admin Sign In
        if (!email || !password) {
          throw new Error('Please enter both your administrator email and password.');
        }
        await signInWithEmailAndPassword(auth, email, password);
      } else if (isLogin) {
        // Student Sign In
        if (!email || !password) {
          throw new Error('Please fill in all credentials.');
        }
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Student Sign Up
        if (!email || !password || !name || !age || !district || !currentClass) {
          throw new Error('Please fill in all registration fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save student profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          role: 'student',
          age,
          district,
          interests: selectedInterests,
          currentClass,
          isFirstLogin: false,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak. Choose at least 6 characters.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 md:p-8 selection:bg-teal-500 selection:text-slate-900 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      <div className={`w-full max-w-2xl rounded-[32px] p-6 md:p-10 shadow-2xl relative z-10 transition-all duration-300 border ${
        isAdminMode 
          ? 'bg-slate-950/90 border-teal-500/30 shadow-teal-950/20' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        
        {/* Branding Header */}
        <div className="text-center mb-8 space-y-2">
          {isAdminMode ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5 animate-pulse" />
                Administrative Access Portal
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Admin Control Console
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium max-w-md mx-auto">
                Secure management hub for system configurations, college database seeds, and entrance exam matrices.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Kerala Career Compass
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isLogin ? 'Welcome Back Student' : 'Begin Your Career Journey'}
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium max-w-md mx-auto">
                {isLogin 
                  ? 'Sign in to access personalized counseling, colleges database, and entrance timelines.'
                  : 'Create your academic profile to receive custom-tailored higher studies pathways.'}
              </p>
            </>
          )}
        </div>

        {/* Error Announcement */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-bold leading-relaxed flex items-start gap-2 animate-pulse">
            <span className="shrink-0 bg-rose-500 text-slate-950 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">!</span>
            <span>{error}</span>
          </div>
        )}

        {isAdminMode && (
          <div className="mb-6 p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-200/90 text-[11px] font-medium leading-relaxed flex items-center gap-2.5">
            <Shield className="w-4 h-4 shrink-0 text-yellow-500" />
            <span>This workspace is restricted to authorized department operators. Student credentials will not function here.</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* STUDENT REGISTRATION FIELDS */}
          {!isAdminMode && !isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    min="10"
                    max="30"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 17"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kerala District</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all"
                  >
                    <option value="" className="text-slate-600">Select District</option>
                    {KERALA_DISTRICTS.map(dist => (
                      <option key={dist} value={dist} className="bg-slate-900">{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Class */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Class</label>
                <div className="relative">
                  <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    required
                    value={currentClass}
                    onChange={(e) => setCurrentClass(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all"
                  >
                    <option value="" className="text-slate-600">Select Grade</option>
                    <option value="Class 10" className="bg-slate-900">Class 10 (Secondary)</option>
                    <option value="Class 12" className="bg-slate-900">Class 12 (Higher Secondary)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isAdminMode ? 'Administrator Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminMode ? "admin@careercompass.app" : "you@example.com"}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
              {!isAdminMode && isLogin && (
                <span className="text-[10px] text-slate-500 hover:text-teal-400 font-bold uppercase tracking-wider cursor-pointer transition-all" onClick={() => alert('Please contact system administrator (admin@careercompass.app) to request password assistance.')}>
                  Forgot Password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAdminMode ? "••••••••" : (isLogin ? "••••••••" : "At least 6 characters")}
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Student Career Interests */}
          {!isAdminMode && !isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Areas of Academic/Career Interest</label>
              <div className="flex flex-wrap gap-2">
                {CAREER_INTERESTS.map(interest => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        isSelected 
                          ? 'bg-teal-500 border-teal-500 text-slate-950' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-4 px-6 font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isAdminMode 
                ? 'bg-teal-500 hover:bg-teal-600 text-slate-950 hover:text-black shadow-teal-500/10' 
                : 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-slate-950 hover:text-black shadow-teal-500/10'
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isAdminMode ? 'Authenticate Admin Account' : (isLogin ? 'Secure Sign In' : 'Complete Registration')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center flex flex-col items-center justify-center gap-4">
          {isAdminMode ? (
            <button
              onClick={() => {
                setIsAdminMode(false);
                setError(null);
              }}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Student Access Portal
            </button>
          ) : (
            <>
              <p className="text-xs text-slate-500 font-semibold">
                {isLogin ? "Don't have an account in Kerala Career Compass yet?" : "Already registered with an academic profile?"}{' '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-teal-400 hover:text-teal-300 font-bold hover:underline transition-all cursor-pointer"
                >
                  {isLogin ? 'Create Student Account' : 'Sign In Now'}
                </button>
              </p>
              
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-teal-400/80 hover:text-teal-300 border border-teal-400/20 hover:border-teal-300/40 px-4 py-2 rounded-xl bg-slate-950/40 transition-all cursor-pointer mt-2"
              >
                <Shield className="w-3.5 h-3.5" />
                Access Administration Desk
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
