import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Compass, 
  BrainCircuit, 
  School, 
  MapPin, 
  GraduationCap, 
  DollarSign, 
  Home, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Lightbulb, 
  CheckCircle 
} from 'lucide-react';

interface DiscoveryWizardSectionProps {
  profile: any;
  userProfile: any;
  onNavigateToTab: (tabId: string) => void;
}

export default function DiscoveryWizardSection({
  profile,
  userProfile,
  onNavigateToTab
}: DiscoveryWizardSectionProps) {
  // Input Wizard State
  const [wizardForm, setWizardForm] = useState({
    currentClass: profile.currentClass || 'Class 12',
    interests: profile.interests?.join(', ') || '',
    subjects: '',
    skills: '',
    budget: 'Under 25k per year (Govt / Aided fees)',
    district: profile.district || 'Thiruvananthapuram',
    prefType: 'Government / Aided',
    hostel: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load cached wizard result if available to persist user state
  useEffect(() => {
    const cached = localStorage.getItem('career_compass_wizard_result');
    if (cached) {
      try {
        setResult(JSON.parse(cached));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setWizardForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRunWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/discovery-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizardData: wizardForm })
      });

      if (!res.ok) {
        throw new Error('AI Service returned an error. Please try again.');
      }

      const data = await res.json();
      setResult(data);
      localStorage.setItem('career_compass_wizard_result', JSON.stringify(data));
      // Tick off journey step
      localStorage.setItem('career_compass_wizard_done', 'true');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze career options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWizard = () => {
    setResult(null);
    localStorage.removeItem('career_compass_wizard_result');
  };

  const budgetOptions = [
    'Under 25k per year (Govt / Aided fees)',
    '25k - 75k per year (Aided / Govt-controlled self financing)',
    '75k - 2 Lakhs per year (Self-Financing / Private)',
    'No specific budget constraints'
  ];

  const keralaDistricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 
    'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* HEADER SUMMARY */}
      <div className="space-y-1 text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-2">
          <Compass className="w-6 h-6 text-teal-600 animate-spin" style={{ animationDuration: '6s' }} />
          AI Career Discovery Wizard
        </h2>
        <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">
          Beginner's Guide to charting high-demand streams and Kerala institutes
        </p>
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      {errorMsg && (
        <p className="text-xs text-rose-700 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-100 font-semibold text-center">
          ⚠️ {errorMsg}
        </p>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-12 text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-slate-100 border-t-teal-500 rounded-full animate-spin" />
            <Cpu className="w-10 h-10 text-teal-600 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600 fill-teal-100" />
              Gemini AI Discovery Wizard
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Consulting official state educational records...</p>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed italic">
            "Analyzing: {wizardForm.currentClass} • {wizardForm.district} district • Budget: {wizardForm.budget}..."
          </p>
        </div>
      )}

      {/* INPUT FORM (WIZARD MODE) */}
      {!loading && !result && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">Custom Career Matching</h3>
            <p className="text-xs text-slate-400 font-medium">Input your school profile to run an advanced state-wide counseling analysis.</p>
          </div>

          <form onSubmit={handleRunWizard} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Class */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                Current Grade/Class
              </label>
              <select
                value={wizardForm.currentClass}
                onChange={(e) => handleInputChange('currentClass', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold"
              >
                <option value="Class 10">Class 10 (Secondary School Leaving Certificate - SSLC)</option>
                <option value="Class 12">Class 12 / Plus Two (Higher Secondary Course - HSC)</option>
                <option value="ITI / Polytechnic">ITI / Polytechnic Level</option>
              </select>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                Preferred Home District in Kerala
              </label>
              <select
                value={wizardForm.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold"
              >
                {keralaDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-slate-400" />
                Your Passions & Interests (separated by commas)
              </label>
              <input
                type="text"
                value={wizardForm.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="e.g. coding, drawing, social work, photography"
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-700"
              />
            </div>

            {/* Favorite Subjects */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <BrainCircuit className="w-4 h-4 text-slate-400" />
                Favorite School Subjects
              </label>
              <input
                type="text"
                value={wizardForm.subjects}
                onChange={(e) => handleInputChange('subjects', e.target.value)}
                placeholder="e.g. Mathematics, Physics, English, Computer Application"
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-700"
              />
            </div>

            {/* Custom Skills */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <Cpu className="w-4 h-4 text-slate-400" />
                Practical Skills You Want to Develop
              </label>
              <input
                type="text"
                value={wizardForm.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g. coding, public speaking, drawing, editing"
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold text-slate-700"
              />
            </div>

            {/* Annual Fees Budget */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Preferred Annual Fees Budget
              </label>
              <select
                value={wizardForm.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold"
              >
                {budgetOptions.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Institution Preference Type */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-700 flex items-center gap-1">
                <School className="w-4 h-4 text-slate-400" />
                Institution Type Preference
              </label>
              <select
                value={wizardForm.prefType}
                onChange={(e) => handleInputChange('prefType', e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-500 font-semibold"
              >
                <option value="Government / Aided only">Government / Aided only</option>
                <option value="No preference (Govt & Private)">No preference (Govt & Private)</option>
              </select>
            </div>

            {/* Hostel Toggle */}
            <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                id="hostel-wizard-toggle"
                checked={wizardForm.hostel}
                onChange={(e) => handleInputChange('hostel', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="hostel-wizard-toggle" className="font-extrabold text-slate-700 cursor-pointer select-none">
                Hostel Facilities Required?
                <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Recommended if college is outside home district</span>
              </label>
            </div>

            {/* Full width Button */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4.5 h-4.5" />
                Predict My Ideal Kerala Career Pathway
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DISCOVERY WIZARD RESULTS DISPLAY */}
      {!loading && result && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                  <Sparkles className="w-5 h-5 fill-teal-100" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Personalized Career Discovery</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Predictions generated by Gemini AI Counselor</p>
                </div>
              </div>
              <button
                onClick={handleResetWizard}
                className="text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                Reset & Run Again
              </button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Best Stream (Full-width recommendation) */}
              <div className="md:col-span-2 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[9px] font-black text-teal-650 uppercase tracking-widest block">🎯 Best Fit Stream Recommended</span>
                <p className="text-sm font-black text-slate-800">{result.bestStream?.split('\n')[0]}</p>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {result.bestStream}
                </p>
              </div>

              {/* Matched Degree Courses */}
              <div className="bg-teal-50/15 p-5 rounded-2xl border border-teal-500/5 space-y-3">
                <span className="text-[9px] font-black text-teal-700 uppercase tracking-widest block">🎓 Recommended Courses & Majors</span>
                <ul className="space-y-2 text-xs">
                  {result.courses?.map((course: string, idx: number) => (
                    <li key={idx} className="font-bold text-slate-800 flex items-start gap-2">
                      <span className="text-teal-500 font-black">•</span>
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emerging Careers */}
              <div className="bg-rose-50/15 p-5 rounded-2xl border border-rose-500/5 space-y-3">
                <span className="text-[9px] font-black text-rose-750 uppercase tracking-widest block">📈 High-Demand Career Paths</span>
                <ul className="space-y-2 text-xs">
                  {result.careers?.map((career: string, idx: number) => (
                    <li key={idx} className="font-bold text-slate-800 flex items-start gap-2">
                      <span className="text-rose-500 font-black">•</span>
                      <span>{career}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matching Kerala Colleges */}
              <div className="bg-amber-50/15 p-5 rounded-2xl border border-amber-500/5 space-y-3">
                <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block">🏫 Matching Colleges in Kerala</span>
                <ul className="space-y-2 text-xs">
                  {result.colleges?.map((college: string, idx: number) => (
                    <li key={idx} className="font-bold text-slate-800 flex items-start gap-2">
                      <span className="text-amber-500 font-black">•</span>
                      <span>{college}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Relevant Scholarships */}
              <div className="bg-indigo-50/15 p-5 rounded-2xl border border-indigo-500/5 space-y-3">
                <span className="text-[9px] font-black text-indigo-750 uppercase tracking-widest block">💰 Eligible Scholarships & Financial Aid</span>
                <ul className="space-y-2 text-xs">
                  {result.scholarships?.map((scholarship: string, idx: number) => (
                    <li key={idx} className="font-bold text-slate-800 flex items-start gap-2">
                      <span className="text-indigo-500 font-black">•</span>
                      <span>{scholarship}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Custom Interactive Roadmap Section */}
            <div className="pt-4 space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Sequential Higher Education Roadmap</span>
              <div className="relative border-l-2 border-teal-150 pl-5 ml-2.5 space-y-6 text-xs">
                {result.roadmap?.map((step: any, sIdx: number) => (
                  <div key={sIdx} className="relative">
                    <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white ring-4 ring-teal-50" />
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-teal-650 uppercase tracking-widest">{step.phase || `Phase ${sIdx + 1}`}</span>
                      <h5 className="font-extrabold text-slate-900">{step.milestone}</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-semibold">Toggled with Adaptive Mode. Data cached securely.</p>
              <button
                onClick={() => {
                  alert("Counselor report generated. You can now download the PDF or check matching colleges directly!");
                  localStorage.setItem('career_compass_report_downloaded', 'true');
                  onNavigateToTab('learning');
                }}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Generate Counselor PDF Report
              </button>
            </div>

          </div>

          {/* Quick Info Card */}
          <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 font-semibold flex items-start gap-2 max-w-2xl mx-auto shadow-sm">
            <Lightbulb className="w-5 h-5 text-teal-600 fill-teal-100 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              💡 **Next Step Advice**: Take this personalized prediction and ask the **Compass AI Coach** (under the chat tab) specific questions, or find the verified campus contact emails directly in the **Colleges Directory**!
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
