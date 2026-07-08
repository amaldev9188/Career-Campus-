import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Lock, CheckCircle, ShieldAlert, KeyRound } from 'lucide-react';

interface AdminChangePasswordProps {
  onPasswordChanged: () => void;
}

export default function AdminChangePassword({ onPasswordChanged }: AdminChangePasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword === 'Admin@123') {
      setError('Please choose a password different from the default "Admin@123".');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No admin user is currently logged in.');
      }

      // 1. Update Firebase Auth password
      await updatePassword(user, newPassword);

      // 2. Update isFirstLogin to false in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isFirstLogin: false
      });

      setSuccess(true);
      setTimeout(() => {
        onPasswordChanged();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update admin password. Try re-logging in first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/30 rounded-[32px] p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Decorative Alert Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500 animate-pulse" />
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-amber-500/15 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <h2 className="text-xl font-extrabold text-white">First-Time Login Verification</h2>
          <p className="text-xs text-slate-400 font-medium">
            For security reasons, you must change your default administrative password (<b className="text-slate-300">Admin@123</b>) before accessing the admin dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-bold text-center leading-relaxed">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-5 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-300 text-xs font-bold text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-teal-400 mx-auto animate-pulse" />
            <p>Password updated successfully!</p>
            <p className="text-slate-500 font-medium">Redirecting you to administrative dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs font-bold text-white outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-slate-950 font-black uppercase tracking-wider rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Secure Admin Account'
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
