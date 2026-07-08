import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, seedDatabase } from './lib/firebase';
import { StudentProfile, StreamType, AdmissionDeadline } from './types';
import { baselineDeadlines } from './data/resources';
import ProfileSection from './components/ProfileSection';
import QuizSection from './components/QuizSection';
import CareerMapSection from './components/CareerMapSection';
import CollegeDirectorySection from './components/CollegeDirectorySection';
import ResourceSection from './components/ResourceSection';
import AuthScreen from './components/AuthScreen';
import AdminChangePassword from './components/AdminChangePassword';
import AdminPanel from './components/AdminPanel';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  BrainCircuit, 
  Map, 
  School, 
  Calendar, 
  Compass, 
  Sparkles,
  CheckCircle,
  Menu,
  X,
  MapPin,
  GraduationCap,
  Shield,
  LogOut,
  Clock
} from 'lucide-react';

export default function App() {
  // Firebase Auth & User States
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Logout confirmation state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Synchronize active tab based on user role when profile loads
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') {
        setActiveTab('admin_panel');
      } else {
        if (!['profile', 'quiz', 'careers', 'colleges', 'resources'].includes(activeTab)) {
          setActiveTab('profile');
        }
      }
    }
  }, [userProfile]);

  // Local state fallbacks mapped to student profiles
  const [profile, setProfile] = useState<StudentProfile>({
    name: '',
    age: '',
    currentClass: '',
    district: '',
    interests: []
  });

  const [recommendedStream, setRecommendedStream] = useState<StreamType | null>(null);

  // Seed the database with the admin account and baseline documents on initial boot
  useEffect(() => {
    seedDatabase();
  }, []);

  // Listen to Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecking(true);
      if (user) {
        setFirebaseUser(user);
        
        // Fetch user profile document from Firestore
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            
            // Sync values with the app's local section states
            setProfile({
              name: data.name || '',
              age: data.age || '',
              currentClass: data.currentClass || '',
              district: data.district || '',
              interests: data.interests || []
            });
            if (data.recommendedStream) {
              setRecommendedStream(data.recommendedStream);
            }
          } else {
            // Document does not exist yet (e.g. newly created OAuth or partial registration)
            const fallbackProfile = {
              uid: user.uid,
              name: user.displayName || '',
              email: user.email || '',
              role: 'student',
              age: '',
              district: '',
              interests: [],
              currentClass: '',
              isFirstLogin: false
            };
            await setDoc(docRef, fallbackProfile);
            setUserProfile(fallbackProfile);
            setProfile({
              name: fallbackProfile.name,
              age: '',
              currentClass: '',
              district: '',
              interests: []
            });
          }
        } catch (err) {
          console.error('Error fetching student profile from Firestore:', err);
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    
    // Persist to Firestore under current user's UID
    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          name: updatedProfile.name,
          age: updatedProfile.age,
          district: updatedProfile.district,
          currentClass: updatedProfile.currentClass,
          interests: updatedProfile.interests
        }, { merge: true });
        
        // Update userProfile state
        setUserProfile((prev: any) => ({
          ...prev,
          ...updatedProfile
        }));
      } catch (err) {
        console.error('Error saving profile to Firestore:', err);
        alert('Failed to save profile to cloud storage. Please check connectivity.');
      }
    }
  };

  const handleQuizCompleted = async (stream: StreamType) => {
    setRecommendedStream(stream);
    
    // Persist recommended stream to Firestore
    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, {
          recommendedStream: stream
        }, { merge: true });
        
        setUserProfile((prev: any) => ({
          ...prev,
          recommendedStream: stream
        }));
      } catch (err) {
        console.error('Error updating quiz stream recommendation in Firestore:', err);
      }
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
      setActiveTab('profile');
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const handlePasswordChanged = async () => {
    // Reload user profile to fetch isFirstLogin = false
    if (firebaseUser) {
      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Custom Avatar Emoji resolver
  const avatarEmoji = () => {
    if (userProfile?.role === 'admin') return '⚙️';
    const storedAvatar = localStorage.getItem('career_compass_avatar') || 'student1';
    switch (storedAvatar) {
      case 'student1': return '🧑‍🎓';
      case 'student2': return '👩‍🎓';
      case 'student3': return '🎨';
      case 'student4': return '🔬';
      case 'student5': return '💻';
      case 'student6': return '🌱';
      default: return '🧑‍🎓';
    }
  };

  // Build navigation items based on user authentication and role
  const getNavItems = () => {
    if (userProfile?.role === 'admin') {
      return [
        {
          id: 'admin_panel',
          label: 'Admin Control Panel',
          icon: Shield,
          status: 'Management Desk'
        }
      ];
    }

    return [
      { id: 'profile', label: 'Student Profile', icon: User, status: profile.name ? 'Completed' : 'Setup Required' },
      { id: 'quiz', label: 'Aptitude Quiz', icon: BrainCircuit, status: recommendedStream ? `Rec: ${recommendedStream}` : 'Not Started' },
      { id: 'careers', label: 'Career Map', icon: Map, status: 'Interactive Paths' },
      { id: 'colleges', label: 'Colleges Directory', icon: School, status: 'Government Lists' },
      { id: 'resources', label: 'Resources & Timelines', icon: Calendar, status: 'Entrance Hub' }
    ];
  };

  const navItems = getNavItems();

  // Loading indicator for Firebase authentication state verification
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-teal-400 font-bold uppercase tracking-widest animate-pulse">Establishing Secure Credentials...</p>
        </div>
      </div>
    );
  }

  // FORCE AUTHENTICATION SCREEN FOR UNAUTHENTICATED USERS
  if (!firebaseUser) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  // FORCE FIRST-TIME ADMIN PASSWORD RESET BLOCK
  if (userProfile?.role === 'admin' && userProfile?.isFirstLogin === true) {
    return <AdminChangePassword onPasswordChanged={handlePasswordChanged} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP ONLY */}
      <aside id="desktop-sidebar" className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0F172A] border-r border-slate-800 shrink-0 sticky top-0 h-screen p-6 justify-between text-slate-300">
        <div className="space-y-8 overflow-y-auto pr-1">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-lg shadow-teal-500/10 shrink-0">
              CC
            </div>
            <div>
              <h1 className="text-xs font-black text-white uppercase tracking-[0.15em] leading-none">Career Compass</h1>
              <span className="text-[9px] font-bold text-teal-400 tracking-[0.2em] uppercase mt-1 block">Kerala State</span>
            </div>
          </div>

          {/* User Profile Info Card */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-slate-700/50 shrink-0">
                {avatarEmoji()}
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-[0.15em]">
                  {userProfile?.role === 'admin' ? 'Administrator' : 'Current Student'}
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {userProfile?.role === 'admin' ? 'System Administrator' : (profile.name || userProfile?.email)}
                </span>
              </div>
            </div>
            {profile.district && userProfile?.role !== 'admin' && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-800/60">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">{profile.district}</span>
                {profile.currentClass && (
                  <span className="flex items-center gap-1 pl-1.5 border-l border-slate-800 ml-1 shrink-0">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                    {profile.currentClass}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all group cursor-pointer ${
                    isSelected
                      ? 'bg-slate-850 text-teal-400 border-l-4 border-teal-500 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all ${
                    isSelected ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <div className="min-w-0">
                    <span className="text-xs block leading-none">{item.label}</span>
                    <span className={`text-[9px] block mt-0.5 font-semibold ${
                      isSelected ? 'text-teal-400/80' : 'text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="border-t border-slate-850 pt-4 space-y-4 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-rose-500/20 hover:border-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Secure Log Out
          </button>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
              Empowering Kerala Students
            </p>
            <span className="text-[9px] text-slate-500 block mt-0.5">Version 1.0 (Artistic Flair)</span>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOP HEADER */}
      <header id="mobile-header" className="md:hidden bg-[#0F172A] border-b border-slate-800 px-4 py-3 shrink-0 flex items-center justify-between sticky top-0 z-30 shadow-sm text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
            CC
          </div>
          <div>
            <h1 className="text-xs font-black text-white uppercase tracking-wider leading-none">Career Compass</h1>
            <span className="text-[9px] font-bold text-teal-400 tracking-wider uppercase">Kerala State</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-800">
            <span className="text-base leading-none">{avatarEmoji()}</span>
            <span className="max-w-[80px] truncate font-bold text-slate-200">
              {userProfile?.role === 'admin' ? 'Admin' : (profile.name ? profile.name.split(' ')[0] : 'Student')}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-900 cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. MOBILE TAB SCROLLABLE CAROUSEL */}
      {userProfile?.role !== 'admin' && (
        <div id="mobile-tab-carousel" className="md:hidden bg-[#0F172A] border-b border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 px-4 py-2 sticky top-[53px] z-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`w-full h-full ${userProfile?.role === 'admin' ? 'pb-4' : 'pb-16'} md:pb-0`}
          >
            {activeTab === 'profile' && (
              <ProfileSection 
                profile={profile} 
                onSave={handleSaveProfile} 
              />
            )}
            
            {activeTab === 'quiz' && (
              <QuizSection 
                profile={profile} 
                onNavigateToTab={(tabId) => setActiveTab(tabId)}
                onQuizCompleted={handleQuizCompleted}
              />
            )}
            
            {activeTab === 'careers' && (
              <CareerMapSection 
                recommendedStream={recommendedStream} 
              />
            )}
            
            {activeTab === 'colleges' && (
              <CollegeDirectorySection />
            )}
            
            {activeTab === 'resources' && (
              <ResourceSection 
                deadlines={[]} // Pass empty list as ResourceSection handles its own Firestore query dynamically
                onSaveDeadlines={() => {}}
                onResetDeadlines={() => {}}
              />
            )}

            {activeTab === 'admin_panel' && userProfile?.role === 'admin' && (
              <AdminPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. MOBILE ERGONOMIC STICKY BOTTOM NAVIGATION BAR */}
      {userProfile?.role !== 'admin' && (
        <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800/80 shadow-2xl py-2 px-3 z-30 flex items-center justify-around text-slate-400">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                  isSelected ? 'text-teal-400 scale-105' : 'text-slate-400 hover:text-slate-300'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-semibold mt-0.5 truncate max-w-[65px]">
                  {item.id === 'profile' ? 'Profile' : 
                   item.id === 'quiz' ? 'Quiz' : 
                   item.id === 'careers' ? 'Careers' : 
                   item.id === 'colleges' ? 'Colleges' : 
                   item.id === 'resources' ? 'Hub' : 'Admin'}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* 6. LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4"
          >
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Sign Out</h3>
              <p className="text-xs text-slate-500 font-medium">Are you sure you want to sign out of Career Compass Kerala?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
