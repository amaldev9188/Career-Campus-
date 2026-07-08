import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { districtsList } from '../data/colleges';
import { Save, User, GraduationCap, MapPin, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileSectionProps {
  profile: StudentProfile;
  onSave: (updated: StudentProfile) => void;
}

const INTEREST_OPTIONS = [
  'Coding & Computers',
  'Writing & Journalism',
  'Painting & Sketching',
  'Math & Logical Puzzles',
  'Scientific Experiments',
  'Repairing Devices & Tinkering',
  'Cooking & Baking',
  'Agriculture & Gardening',
  'Business & Selling Things',
  'Public Speaking & Debating',
  'Helping People & Social Work',
  'Designing Graphics & UI/UX'
];

const AVATARS = [
  { id: 'student1', emoji: '🧑‍🎓', label: 'Student' },
  { id: 'student2', emoji: '👩‍🎓', label: 'Scholar' },
  { id: 'student3', emoji: '🎨', label: 'Artist' },
  { id: 'student4', emoji: '🔬', label: 'Researcher' },
  { id: 'student5', emoji: '💻', label: 'Coder' },
  { id: 'student6', emoji: '🌱', label: 'Grower' }
];

export default function ProfileSection({ profile, onSave }: ProfileSectionProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [currentClass, setCurrentClass] = useState<StudentProfile['currentClass']>(profile.currentClass);
  const [district, setDistrict] = useState(profile.district);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests);
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('career_compass_avatar') || 'student1';
  });
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: StudentProfile = {
      name: name.trim(),
      age: age,
      currentClass: currentClass,
      district: district,
      interests: selectedInterests
    };
    onSave(updatedProfile);
    localStorage.setItem('career_compass_avatar', selectedAvatar);
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
    }, 3000);
  };

  const currentAvatarEmoji = AVATARS.find(a => a.id === selectedAvatar)?.emoji || '🧑‍🎓';

  return (
    <div id="profile-container" className="w-full max-w-4xl mx-auto space-y-8">
      {/* Introduction Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[32px] p-6 md:p-8 text-white shadow-sm relative overflow-hidden border border-slate-100"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/10 rounded-full -ml-20 -mb-20 blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center text-5xl shadow-inner border border-white/20">
            {currentAvatarEmoji}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-teal-200 fill-teal-200 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-white/15 px-3 py-1 rounded-full">Kerala Higher Ed Guide</span>
            </div>
            <h1 className="text-3xl md:text-5xl serif-italic font-normal tracking-tight">
              {profile.name ? `Welcome back, ${profile.name}.` : 'Set Up Your Career Profile'}
            </h1>
            <p className="mt-2 text-teal-50 text-xs md:text-sm max-w-xl font-medium opacity-90 leading-relaxed">
              Fill in your details below to unlock personalized recommendations, aptitude tests, and career maps tailored to Kerala's academic landscape.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Setup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8"
      >
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Avatar Selection Row */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-teal-500" />
              Choose Your Student Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                    selectedAvatar === av.id
                      ? 'bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/20'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl mb-1">{av.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-500">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Student Name */}
            <div>
              <label htmlFor="student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="student-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Amal Dev"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-800 text-sm font-semibold"
                />
              </div>
            </div>

            {/* Student Age */}
            <div>
              <label htmlFor="student-age" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Age
              </label>
              <input
                id="student-age"
                type="number"
                min="12"
                max="25"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="E.g., 16"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-800 text-sm font-semibold"
              />
            </div>

            {/* Current Class Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-500" />
                Current Status / Class Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentClass('Class 10')}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${
                    currentClass === 'Class 10'
                      ? 'bg-teal-50/50 border-teal-500 text-teal-800 ring-2 ring-teal-500/10'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Completed Class 10
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Looking for Plus One/Polytechnic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentClass('Class 12')}
                  className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all text-left ${
                    currentClass === 'Class 12'
                      ? 'bg-teal-50/50 border-teal-500 text-teal-800 ring-2 ring-teal-500/10'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Completed Class 12
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Looking for Degrees/Diplomas</span>
                </button>
              </div>
            </div>

            {/* Kerala District Selection */}
            <div>
              <label htmlFor="student-district" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-500" />
                District in Kerala
              </label>
              <select
                id="student-district"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-850 text-sm font-semibold"
              >
                <option value="">Select your District</option>
                {districtsList.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Interests Checklist Section */}
          <div className="border-t border-slate-100 pt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              What are you interested in?
            </label>
            <p className="text-xs text-slate-500 mb-4">
              Select all hobbies, skills, or topics that you love. This helps us understand your natural inclination.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-500 text-teal-900 font-bold'
                        : 'bg-white border-slate-150 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 bg-slate-50'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="truncate">{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <div className="text-xs text-slate-400">
              Your profile is stored locally on this device.
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isSavedSuccessfully && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Profile updated!
                </motion.div>
              )}
              
              <button
                type="submit"
                id="save-profile-btn"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-95 transition-all w-full sm:w-auto text-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </div>

        </form>
      </motion.div>

      {/* Profile Overview Stats (if setup) */}
      {profile.name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white p-5 rounded-[24px] border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Active Profile</span>
            <div className="text-lg font-bold text-slate-800">{profile.name}</div>
            <span className="inline-block mt-2 bg-teal-50 text-teal-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              {profile.currentClass || 'Class Not Set'}
            </span>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Native Region</span>
            <div className="text-lg font-bold text-slate-800">{profile.district || 'Not Set'}</div>
            <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Kerala State
            </span>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Areas of Interest</span>
            <div className="text-lg font-bold text-slate-800">{profile.interests.length} Fields</div>
            <span className="inline-block mt-2 bg-rose-50 text-rose-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Curated Selection
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
