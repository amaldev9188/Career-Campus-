import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { districtsList } from '../data/colleges';
import { 
  Save, User, GraduationCap, MapPin, Heart, Sparkles, 
  CheckCircle2, Edit3, Camera, Trash2, Upload, X, ArrowRight, Info 
} from 'lucide-react';
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

// Canvas-based image compression to fit base64 in Firestore comfortably
const compressAndGetBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress quality at 0.7 to generate extremely lightweight payload (<15KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ProfileSection({ profile, onSave }: ProfileSectionProps) {
  // Mode states
  const [isEditing, setIsEditing] = useState(!profile.name);

  // Form Field States
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age || '');
  const [currentClass, setCurrentClass] = useState<StudentProfile['currentClass']>(profile.currentClass || '');
  const [district, setDistrict] = useState(profile.district || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || []);
  const [photoURL, setPhotoURL] = useState(profile.photoURL || '');
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('career_compass_avatar') || 'student1';
  });

  // UI States
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Synchronize with async profile updates from parent/database
  useEffect(() => {
    setName(profile.name || '');
    setAge(profile.age || '');
    setCurrentClass(profile.currentClass || '');
    setDistrict(profile.district || '');
    setSelectedInterests(profile.interests || []);
    setPhotoURL(profile.photoURL || '');
    
    // Default to read-only display mode if the profile already has a name
    if (profile.name) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [profile]);

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    try {
      setUploading(true);
      const compressedBase64 = await compressAndGetBase64(file);
      setPhotoURL(compressedBase64);
    } catch (err) {
      console.error('Error compressing image:', err);
      alert('Failed to process image. Please try another file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only images are supported for profile photos.');
      return;
    }

    try {
      setUploading(true);
      const compressedBase64 = await compressAndGetBase64(file);
      setPhotoURL(compressedBase64);
    } catch (err) {
      console.error('Error processing dropped image:', err);
      alert('Failed to process the dropped image.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoURL('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: StudentProfile = {
      name: name.trim(),
      age: age,
      currentClass: currentClass,
      district: district,
      interests: selectedInterests,
      photoURL: photoURL
    };
    onSave(updatedProfile);
    localStorage.setItem('career_compass_avatar', selectedAvatar);
    setIsSavedSuccessfully(true);
    setIsEditing(false);
    
    setTimeout(() => {
      setIsSavedSuccessfully(false);
    }, 3000);
  };

  const handleCancel = () => {
    // Reset back to initial prop values
    setName(profile.name || '');
    setAge(profile.age || '');
    setCurrentClass(profile.currentClass || '');
    setDistrict(profile.district || '');
    setSelectedInterests(profile.interests || []);
    setPhotoURL(profile.photoURL || '');
    setIsEditing(false);
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
          {photoURL ? (
            <div className="relative w-24 h-24 rounded-[24px] overflow-hidden border-2 border-white/40 shadow-lg group shrink-0">
              <img src={photoURL} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center text-5xl shadow-inner border border-white/20 shrink-0">
              {currentAvatarEmoji}
            </div>
          )}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-teal-200 fill-teal-200 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-white/15 px-3 py-1 rounded-full">Kerala Higher Ed Guide</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {profile.name ? `Welcome back, ${profile.name}.` : 'Set Up Your Career Profile'}
            </h1>
            <p className="mt-2 text-teal-50 text-xs md:text-sm max-w-xl font-medium opacity-90 leading-relaxed">
              Unlock highly personalized career maps, entrance exam schedules, and colleges recommendation filters aligned to Kerala's competitive workspace.
            </p>
          </div>
        </div>
      </motion.div>

      {/* SUCCESS ALERTS */}
      {isSavedSuccessfully && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Awesome! Your updated student profile has been synced with Career Compass Kerala.</span>
        </motion.div>
      )}

      {/* READ-ONLY DISPLAY MODE CONTAINER */}
      {!isEditing && profile.name ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-8 space-y-8">
            {/* Header with edit button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-800">Academic Profile Overview</h2>
                <p className="text-xs text-slate-400">Review your configured details and region status</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image View */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
                {photoURL ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-500 shadow-sm">
                    <img src={photoURL} alt={name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-4xl">
                    {currentAvatarEmoji}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Student</p>
                </div>
              </div>

              {/* Bio Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Age</span>
                  <p className="text-sm font-bold text-slate-700">{age} Years Old</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Current Class</span>
                  <p className="text-sm font-bold text-slate-700">{currentClass}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/60 col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">District</span>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {district}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Interests list */}
            <div className="space-y-3 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Configured Areas of Interest
              </h3>
              {selectedInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-teal-50 border border-teal-100/60 text-teal-800 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 text-xs text-center">
                  No explicit interests chosen yet. Click edit to customize recommendations.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        /* INTERACTIVE EDIT PROFILE FORM */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* PROFILE PHOTO UPLOAD BLOCK */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-500" />
                Profile Photo
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Image Preview Window */}
                <div className="relative w-24 h-24 rounded-[24px] bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group">
                  {photoURL ? (
                    <>
                      <img src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all cursor-pointer text-xs font-bold"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-5 h-5 text-rose-400" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-slate-300">
                      <User className="w-8 h-8 mx-auto" />
                      <span className="text-[9px] font-bold uppercase block mt-1 text-slate-400">None</span>
                    </div>
                  )}
                </div>

                {/* Drag-and-Drop Area & Upload Trigger */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex-1 w-full border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isDragging 
                      ? 'border-teal-500 bg-teal-50/20 scale-[0.99]' 
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                  onClick={() => document.getElementById('photo-upload-input')?.click()}
                >
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="space-y-2">
                      <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Processing image...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                      <p className="text-xs font-bold text-slate-700">Drag & drop your photo, or <span className="text-teal-600 hover:underline">browse</span></p>
                      <p className="text-[9px] text-slate-400 font-medium mt-1">Supports JPEG, PNG (Compressed automatically)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar Selection Row */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-teal-500" />
                Or Choose Backup Student Avatar Emoji
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

            {/* Save / Cancel Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div className="text-xs text-slate-400">
                Your profile is synchronized with Career Compass Kerala.
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {profile.name && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer w-full sm:w-auto text-center"
                  >
                    Cancel
                  </button>
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
      )}

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
