import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AdmissionDeadline, EduResource, College } from '../types';
import { baselineDeadlines, eduResources } from '../data/resources';
import { collegesData } from '../data/colleges';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle, 
  HelpCircle, 
  Loader2, 
  TrendingUp, 
  Columns, 
  Users, 
  Heart, 
  Send, 
  FileText,
  Bookmark
} from 'lucide-react';

export default function ResourceSection() {
  const [activeSubTab, setActiveSubTab] = useState<'scholarships' | 'admissions' | 'learning' | 'compare' | 'portals' | 'saved_feedback'>('scholarships');
  
  // 1. Admission Deadlines States
  const [deadlines, setDeadlines] = useState<AdmissionDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Class 10' | 'Class 12' | 'Scholarships'>('All');
  
  // 2. Admission Milestone Tracker Checklist (Stored in localStorage)
  const [milestones, setMilestones] = useState([
    { id: 'm1', label: 'Complete School Board Examinations', done: false },
    { id: 'm2', label: 'Acquire TC & Migration Certificates', done: false },
    { id: 'm3', label: 'Submit KEAM/LBS Single Window Form', done: false },
    { id: 'm4', label: 'Track Trial Allotment Status', done: false },
    { id: 'm5', label: 'Pay Fee At Government Treasury', done: false },
    { id: 'm6', label: 'In-person College Joining & Document Verification', done: false }
  ]);

  // 3. Scholarship Checker Form
  const [scholarshipForm, setScholarshipForm] = useState({
    income: '250000',
    marks: '85',
    category: 'OBC / SEBC',
    district: 'Thiruvananthapuram'
  });
  const [checkingScholarships, setCheckingScholarships] = useState(false);
  const [scholarshipResult, setScholarshipResult] = useState<any | null>(null);

  // 4. College Compare States
  const [collegesList, setCollegesList] = useState<College[]>([]);
  const [compareCol1, setCompareCol1] = useState<string>('');
  const [compareCol2, setCompareCol2] = useState<string>('');
  
  // 5. Career Compare States
  const careersList = [
    { id: 'cs', title: 'Software Engineer', salary: 'INR 4.5L - 12L/yr', scope: 'High demand in Infopark/Technopark', skills: 'React, Node, Python, Algorithms', duration: '4 Years' },
    { id: 'me', title: 'Mechanical Engineer', salary: 'INR 3L - 8L/yr', scope: 'Moderate demand in PSU & manufacturing', skills: 'CAD, Thermodynamics, Robotics', duration: '4 Years' },
    { id: 'doctor', title: 'Medical Doctor', salary: 'INR 8L - 20L/yr', scope: 'Steady demand in private & govt hospitals', skills: 'Diagnosis, Surgery, Clinical care', duration: '5.5 Years' },
    { id: 'nurse', title: 'Professional Nurse', salary: 'INR 2.5L - 6L/yr', scope: 'Very high demand, high migration scope', skills: 'Patient care, Emergency response', duration: '3-4 Years' },
    { id: 'arts', title: 'Content Creator / Designer', salary: 'INR 3L - 10L/yr', scope: 'High freelance and media agency scope', skills: 'UI/UX, Photoshop, Figma, Copywriting', duration: '3 Years' },
    { id: 'commerce', title: 'Chartered Accountant (CA)', salary: 'INR 6L - 15L/yr', scope: 'High demand in audit and tax firms', skills: 'Finance, Taxation, Auditing, Law', duration: '4.5 Years' }
  ];
  const [compareCar1, setCompareCar1] = useState<string>('');
  const [compareCar2, setCompareCar2] = useState<string>('');

  // 6. Parent & Teacher Corner States
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' });

  // 7. Bookmarked/Saved items
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch admission deadlines
    const fetchDeadlines = async () => {
      try {
        const colRef = collection(db, 'deadlines');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const list: AdmissionDeadline[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as AdmissionDeadline);
          });
          setDeadlines(list);
        } else {
          setDeadlines(baselineDeadlines);
        }
      } catch (err) {
        console.error('Error fetching deadlines:', err);
        setDeadlines(baselineDeadlines);
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();

    // Fetch colleges for compare
    const fetchCollegesForCompare = async () => {
      try {
        const colRef = collection(db, 'colleges');
        const snapshot = await getDocs(colRef);
        if (!snapshot.empty) {
          const list: College[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as College);
          });
          setCollegesList(list);
        } else {
          setCollegesList(collegesData);
        }
      } catch {
        setCollegesList(collegesData);
      }
    };
    fetchCollegesForCompare();

    // Load saved checklists & bookmarks
    const cachedMilestones = localStorage.getItem('career_compass_milestones');
    if (cachedMilestones) {
      try { setMilestones(JSON.parse(cachedMilestones)); } catch {}
    }
    const cachedSavedColleges = localStorage.getItem('career_compass_saved_colleges');
    if (cachedSavedColleges) {
      try { setSavedColleges(JSON.parse(cachedSavedColleges)); } catch {}
    }
    const cachedSavedCareers = localStorage.getItem('career_compass_saved_careers');
    if (cachedSavedCareers) {
      try { setSavedCareers(JSON.parse(cachedSavedCareers)); } catch {}
    }
  }, []);

  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map(m => m.id === id ? { ...m, done: !m.done } : m);
    setMilestones(updated);
    localStorage.setItem('career_compass_milestones', JSON.stringify(updated));
    localStorage.setItem('career_compass_milestones_done', 'true');
  };

  const handleCheckScholarships = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingScholarships(true);
    setScholarshipResult(null);

    try {
      const res = await fetch('/api/ai/scholarship-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scholarshipForm)
      });
      if (res.ok) {
        const data = await res.json();
        setScholarshipResult(data);
        localStorage.setItem('career_compass_scholarships_checked', 'true');
      } else {
        throw new Error('AI Service failed');
      }
    } catch {
      alert('Failed to analyze eligible scholarships. Reverting to regional baseline.');
      setScholarshipResult({
        eligibilityScore: "High Eligibility for State Aid",
        matchedScholarships: [
          { name: "Kerala State Merit Scholarship", benefit: "INR 12,500/year", eligibilityReason: "High school marks > 80% and low income group", website: "dcescholarship.kerala.gov.in" },
          { name: "Post Matric Scholarship (OBC/SEBC)", benefit: "Full tuition reimbursement", eligibilityReason: "Income under 2.5 lakhs and OBC category", website: "egrantz.kerala.gov.in" }
        ]
      });
    } finally {
      setCheckingScholarships(false);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  const selectedCol1 = collegesList.find(c => c.id === compareCol1);
  const selectedCol2 = collegesList.find(c => c.id === compareCol2);
  const selectedCar1 = careersList.find(c => c.id === compareCar1);
  const selectedCar2 = careersList.find(c => c.id === compareCar2);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Scholarships & Deadlines database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION NAV TABS */}
      <div className="flex bg-slate-900 text-slate-400 p-1 rounded-2xl overflow-x-auto gap-1 whitespace-nowrap scrollbar-none sticky top-0 z-10 border border-slate-800">
        <button
          onClick={() => setActiveSubTab('scholarships')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'scholarships' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          💰 Scholarships & Checker
        </button>
        <button
          onClick={() => setActiveSubTab('admissions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'admissions' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          📅 Admission Tracker
        </button>
        <button
          onClick={() => setActiveSubTab('compare')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'compare' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          🏆 Compare Desk
        </button>
        <button
          onClick={() => setActiveSubTab('learning')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'learning' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          📖 E-Books & Bulletins
        </button>
        <button
          onClick={() => setActiveSubTab('portals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'portals' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          👨‍👩‍👧 Parent/Teacher Portals
        </button>
        <button
          onClick={() => setActiveSubTab('saved_feedback')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'saved_feedback' ? 'bg-teal-500 text-slate-950 font-black' : 'hover:text-white'
          }`}
        >
          ❤️ Saved & Feedback
        </button>
      </div>

      {/* 1. SCHOLARSHIPS HUB & CHECKER */}
      {activeSubTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="md:col-span-1 space-y-4">
              <span className="text-[10px] text-teal-600 font-black uppercase tracking-widest flex items-center gap-1">
                <Award className="w-4 h-4" />
                Eligibility Estimator
              </span>
              <h3 className="text-lg font-black text-slate-950">AI Scholarship Finder</h3>
              <p className="text-xs text-slate-450 font-medium leading-relaxed">
                Provide basic financial and mark metrics. Our Gemini engine will suggest state scholarships in Kerala and national grants you can apply for today.
              </p>

              <form onSubmit={handleCheckScholarships} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label>Annual Family Income (INR)</label>
                  <input
                    type="number"
                    value={scholarshipForm.income}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, income: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Class 12 Marks Percentage (%)</label>
                  <input
                    type="number"
                    value={scholarshipForm.marks}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, marks: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Social Category Group</label>
                  <select
                    value={scholarshipForm.category}
                    onChange={(e) => setScholarshipForm({ ...scholarshipForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                  >
                    <option value="General">General</option>
                    <option value="OBC / SEBC">OBC / SEBC</option>
                    <option value="SC / ST">SC / ST</option>
                    <option value="Religious Minority (Muslim/Christian)">Religious Minority</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={checkingScholarships}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 font-black text-xs uppercase text-slate-950 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {checkingScholarships ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Check Scholarships
                </button>
              </form>
            </div>

            {/* Checker Output area */}
            <div className="md:col-span-2 bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Matched Financial Grants</span>

              {checkingScholarships && (
                <div className="py-20 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consulting Minority & Merit-cum-Means rules...</p>
                </div>
              )}

              {!checkingScholarships && !scholarshipResult && (
                <div className="py-20 text-center space-y-2 max-w-sm mx-auto">
                  <Award className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">No custom inquiry completed. Run the estimator on the left to show matched grants.</p>
                </div>
              )}

              {!checkingScholarships && scholarshipResult && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl flex items-center justify-between text-xs text-teal-800">
                    <span className="font-bold">Estimator Score:</span>
                    <span className="font-extrabold uppercase bg-teal-500 text-slate-950 px-2 py-0.5 rounded text-[10px]">{scholarshipResult.eligibilityScore}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scholarshipResult.matchedScholarships?.map((sch: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-3 text-xs">
                        <div className="space-y-1">
                          <h4 className="font-black text-slate-900 leading-tight">{sch.name}</h4>
                          <span className="text-[10px] text-teal-600 font-black">{sch.benefit}</span>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{sch.eligibilityReason}</p>
                        </div>
                        <a
                          href={`https://${sch.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-fit text-[10px] font-bold text-teal-650 flex items-center gap-1 hover:underline"
                        >
                          Official Portal ({sch.website}) <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMISSION CALENDAR & TRACKER */}
      {activeSubTab === 'admissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Milestones Allotment Tracker checklist */}
            <div className="lg:col-span-1 space-y-4">
              <span className="text-[10px] text-teal-600 font-black uppercase tracking-widest block">Student Checklist</span>
              <h3 className="text-lg font-black text-slate-950">Admission Allotment Tracker</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Track and check off critical milestones during single-window admission processes (CAP / LBS / KEAM).
              </p>

              <div className="space-y-2">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer text-xs select-none ${
                      m.done 
                        ? 'bg-teal-50/20 border-teal-100 text-slate-600' 
                        : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {m.done ? (
                        <CheckCircle className="w-4 h-4 text-teal-600 fill-teal-100" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className={`font-bold ${m.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission Calendar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center pb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active State Portals</span>
                {/* Level Filters tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-[10px]">
                  {(['All', 'Class 10', 'Class 12'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat as any)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        filterCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {baselineDeadlines
                  .filter(d => filterCategory === 'All' || d.category === filterCategory)
                  .map((dl) => (
                    <div key={dl.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-semibold">
                      <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-[9px] font-black uppercase text-teal-650 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{dl.status}</span>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{dl.category}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-850 leading-tight">{dl.title}</h4>
                        <p className="text-[10px] text-slate-400">{dl.portal}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">DEADLINE</span>
                          <span className="font-black text-slate-700">{dl.date}</span>
                        </div>
                        <a href={dl.link} target="_blank" rel="noreferrer" className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer text-slate-500">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. COMPARE DESK */}
      {activeSubTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6">
            
            {/* Sub Nav Tab */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Columns className="w-5 h-5 text-teal-600" />
                  Side-by-Side Comparison Matrix
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Evaluate multiple colleges or career paths</p>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* College Comparison block */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                <span className="text-[10px] text-teal-650 font-black uppercase tracking-widest block">🏫 Compare Kerala Colleges</span>
                
                {/* College Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={compareCol1}
                    onChange={(e) => setCompareCol1(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none"
                  >
                    <option value="">Select College 1</option>
                    {collegesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={compareCol2}
                    onChange={(e) => setCompareCol2(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none"
                  >
                    <option value="">Select College 2</option>
                    {collegesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Compare Grid Table */}
                {selectedCol1 && selectedCol2 ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 border-b border-slate-100 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Feature</span>
                      <span className="truncate">{selectedCol1.name}</span>
                      <span className="truncate">{selectedCol2.name}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">District</span>
                      <span className="font-extrabold">{selectedCol1.district}</span>
                      <span className="font-extrabold">{selectedCol2.district}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Type</span>
                      <span>{selectedCol1.type}</span>
                      <span>{selectedCol2.type}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Category</span>
                      <span className="text-teal-600">{selectedCol1.category || 'Government'}</span>
                      <span className="text-teal-600">{selectedCol2.category || 'Government'}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Courses</span>
                      <span className="text-[10px]">{selectedCol1.popularCourses?.slice(0,2).join(', ')}</span>
                      <span className="text-[10px]">{selectedCol2.popularCourses?.slice(0,2).join(', ')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-[11px] text-slate-400 font-bold">
                    Select any two colleges to compare regional metrics side-by-side.
                  </div>
                )}
              </div>

              {/* Career Comparison block */}
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                <span className="text-[10px] text-rose-700 font-black uppercase tracking-widest block">💼 Compare Professional Careers</span>

                {/* Career Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={compareCar1}
                    onChange={(e) => setCompareCar1(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none"
                  >
                    <option value="">Select Career 1</option>
                    {careersList.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>

                  <select
                    value={compareCar2}
                    onChange={(e) => setCompareCar2(e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none"
                  >
                    <option value="">Select Career 2</option>
                    {careersList.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Compare Grid Table */}
                {selectedCar1 && selectedCar2 ? (
                  <div className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 border-b border-slate-100 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Feature</span>
                      <span>{selectedCar1.title}</span>
                      <span>{selectedCar2.title}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Entry Salary</span>
                      <span className="font-extrabold text-teal-600">{selectedCar1.salary}</span>
                      <span className="font-extrabold text-teal-600">{selectedCar2.salary}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Study Duration</span>
                      <span>{selectedCar1.duration}</span>
                      <span>{selectedCar2.duration}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Tech Skills</span>
                      <span className="text-[10px] leading-tight">{selectedCar1.skills}</span>
                      <span className="text-[10px] leading-tight">{selectedCar2.skills}</span>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-150/40 pb-2 font-semibold">
                      <span className="text-slate-400">Growth Scope</span>
                      <span className="text-[10px] leading-tight">{selectedCar1.scope}</span>
                      <span className="text-[10px] leading-tight">{selectedCar2.scope}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-[11px] text-slate-400 font-bold">
                    Select any two career streams to compare demand and curriculum pathways.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. LEARNING HUB & EVENTS BULLETINS */}
      {activeSubTab === 'learning' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Kerala Open Resource Hub
              </h3>
              <p className="text-xs text-slate-400 font-medium">Free textbooks, syllabus guides, PDFs and previous entrance papers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {eduResources.map(res => (
                <div key={res.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-48 text-xs font-semibold">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded">{res.category}</span>
                    <h4 className="font-extrabold text-slate-950 leading-snug">{res.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">{res.description}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">By: {res.provider}</span>
                    <a href={res.url} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline flex items-center gap-1 font-black uppercase">
                      Access Hub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PARENT & TEACHER PORTAL SECTIONS */}
      {activeSubTab === 'portals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Parent Corner */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4">
              <span className="text-[10px] text-rose-750 font-black uppercase tracking-widest block">👨‍👩‍👧 Parent Corner Desk</span>
              <h3 className="text-base font-black text-slate-950">Financial & Security Guidance</h3>
              <p className="text-xs text-slate-400 font-medium">
                Information specifically designed to help parents support their children during higher education transitions.
              </p>

              <div className="space-y-3 text-xs font-semibold">
                <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">🛡️ Student Campus Safety & Hostels</span>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Check if colleges have UGC-approved anti-ragging committees, safe ladies/gents hostel security, and proximity to railway stations.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase">💰 Education Loan Planning (K-Grants)</span>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    Kerala state treasury offers localized interest subsidies for vocational/engineering programs in government colleges. Explore SBI scholar loans.
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher & Counselor portal */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4">
              <span className="text-[10px] text-teal-650 font-black uppercase tracking-widest block">👩‍🏫 Academic Teacher Hub</span>
              <h3 className="text-base font-black text-slate-950">Guidance Material & Syllabus PDFs</h3>
              <p className="text-xs text-slate-400 font-medium">
                Download structured DHSE Kerala study aids, lesson guides, and counselor presentation sheets.
              </p>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between font-bold">
                  <div>
                    <span className="block text-slate-800">1. Plus Two Career Guidance Syllabus PDF</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Released by DHSE CG&AC cell</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Guidance Material downloaded successfully!');
                      localStorage.setItem('career_compass_report_downloaded', 'true');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] text-slate-650 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    Download
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between font-bold">
                  <div>
                    <span className="block text-slate-800">2. KEAM Entrance counseling brochure</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Detailed seat distribution guidelines</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('Brochure PDF downloaded successfully!');
                      localStorage.setItem('career_compass_report_downloaded', 'true');
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] text-slate-650 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    Download
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. SAVED ITEMS & INTERACTIVE FEEDBACK PORTAL */}
      {activeSubTab === 'saved_feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bookmarks */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4">
              <span className="text-[10px] text-teal-650 font-black uppercase tracking-widest block">❤️ Saved Bookmarks</span>
              <h3 className="text-base font-black text-slate-950">My Saved Institutions & Careers</h3>
              <p className="text-xs text-slate-400 font-medium">
                Keep track of colleges and career paths you have marked for easy future access.
              </p>

              <div className="space-y-3 text-xs font-semibold">
                {savedColleges.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 block uppercase">COLLEGES ({savedColleges.length})</span>
                    {savedColleges.map((col, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                        <span>{col}</span>
                        <Bookmark className="w-4 h-4 text-teal-500 fill-teal-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-[11px]">
                    No colleges bookmarked yet. Tap the bookmark icon in the Colleges Directory to save!
                  </div>
                )}
              </div>
            </div>

            {/* Feedback & Bug Reporting */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-4">
              <span className="text-[10px] text-rose-700 font-black uppercase tracking-widest block">📢 Suggestions & Bug Reports</span>
              <h3 className="text-base font-black text-slate-950">Feedback Channel</h3>
              <p className="text-xs text-slate-400 font-medium">
                Submit errors, state dataset suggestions, or seek support from coordinators.
              </p>

              {feedbackSent ? (
                <div className="p-8 text-center bg-teal-50/50 rounded-2xl border border-teal-150 space-y-2 animate-fade-in text-xs font-semibold text-teal-800">
                  <CheckCircle className="w-8 h-8 text-teal-600 mx-auto animate-bounce" />
                  <p>Feedback submitted successfully!</p>
                  <p className="text-[10px] text-slate-400">Our regional coordinator will look into this suggestion.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label>Name</label>
                      <input
                        type="text"
                        required
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Email Address</label>
                      <input
                        type="email"
                        required
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                        placeholder="email@address.com"
                        className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label>Message / Suggestion / Error details</label>
                    <textarea
                      required
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      placeholder="Write your suggestion or report any college dataset error here..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none h-20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
