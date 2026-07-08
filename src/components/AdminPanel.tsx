import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { College, AdmissionDeadline } from '../types';
import { 
  Users, 
  School, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Check, 
  Search, 
  GraduationCap, 
  MapPin, 
  Sparkles,
  BarChart3,
  Filter,
  Phone,
  Mail,
  BookOpen,
  Info,
  ExternalLink,
  Award,
  Globe
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const COLLEGE_TYPES = [
  'Arts & Science', 'Engineering', 'Polytechnic', 'Medical', 'Technical/Vocational'
];

const CHART_COLORS = ['#0D9488', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6', '#EC4899'];

export default function AdminPanel() {
  // Sidebar Sub Tab
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'analytics' | 'colleges' | 'deadlines'>('students');
  
  // Datasets states
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [deadlines, setDeadlines] = useState<AdmissionDeadline[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search & Filter state for Student Directory
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDistrictFilter, setStudentDistrictFilter] = useState('');
  const [studentStreamFilter, setStudentStreamFilter] = useState('');

  // Search & Filter state for Colleges
  const [collegeSearch, setCollegeSearch] = useState('');
  const [collegeDistrictFilter, setCollegeDistrictFilter] = useState('');

  // Search & Filter state for Timelines
  const [timelineSearch, setTimelineSearch] = useState('');

  // Modals / Forms States for College
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    district: 'Thiruvananthapuram',
    type: 'Arts & Science',
    category: 'Government',
    imageUrl: '',
    email: '',
    phone: '',
    medium: 'English',
    notes: '',
    website: '',
    popularCoursesStr: ''
  });

  // Modals / Forms States for Deadline/Scholarships
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [editingDeadlineId, setEditingDeadlineId] = useState<string | null>(null);
  const [deadlineForm, setDeadlineForm] = useState({
    title: '',
    portal: '',
    date: '',
    status: 'Upcoming' as AdmissionDeadline['status'],
    link: '',
    category: 'All' as AdmissionDeadline['category']
  });

  // Fetch all datasets from Firestore
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Students (Users with role: "student")
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCol);
      const studentList: any[] = [];
      usersSnapshot.forEach((doc) => {
        const u = doc.data();
        if (u.role === 'student') {
          studentList.push({ id: doc.id, ...u });
        }
      });
      setStudents(studentList);

      // 2. Fetch Colleges
      const collegesCol = collection(db, 'colleges');
      const collegesSnapshot = await getDocs(collegesCol);
      const collegeList: College[] = [];
      collegesSnapshot.forEach((doc) => {
        collegeList.push({ id: doc.id, ...doc.data() } as College);
      });
      setColleges(collegeList);

      // 3. Fetch Deadlines
      const deadlinesCol = collection(db, 'deadlines');
      const deadlinesSnapshot = await getDocs(deadlinesCol);
      const deadlineList: AdmissionDeadline[] = [];
      deadlinesSnapshot.forEach((doc) => {
        deadlineList.push({ id: doc.id, ...doc.data() } as AdmissionDeadline);
      });
      setDeadlines(deadlineList);
    } catch (err: any) {
      console.error('Error loading admin panel datasets:', err);
      setError('Failed to fetch data from Firestore. Please verify security rules or network state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const triggerNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // --- College Actions ---
  const handleOpenAddCollege = () => {
    setEditingCollegeId(null);
    setCollegeForm({
      name: '',
      district: 'Thiruvananthapuram',
      type: 'Arts & Science',
      category: 'Government',
      imageUrl: '',
      email: '',
      phone: '',
      medium: 'English',
      notes: '',
      website: '',
      popularCoursesStr: ''
    });
    setShowCollegeModal(true);
  };

  const handleOpenEditCollege = (clg: College) => {
    setEditingCollegeId(clg.id);
    setCollegeForm({
      name: clg.name,
      district: clg.district,
      type: clg.type,
      category: clg.category || 'Government',
      imageUrl: clg.imageUrl || '',
      email: clg.email || clg.contactEmail || '',
      phone: clg.phone || clg.contactPhone || '',
      medium: clg.medium || 'English',
      notes: clg.notes || clg.address || '',
      website: clg.website || '',
      popularCoursesStr: clg.popularCourses ? clg.popularCourses.join(', ') : ''
    });
    setShowCollegeModal(true);
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeForm.name) {
      alert('Please fill out the Institution Name.');
      return;
    }

    try {
      const courses = collegeForm.popularCoursesStr
        ? collegeForm.popularCoursesStr.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const collegeId = editingCollegeId || `college_${Date.now()}`;
      
      const collegeDoc: College = {
        id: collegeId,
        name: collegeForm.name,
        district: collegeForm.district,
        type: collegeForm.type,
        category: collegeForm.category as 'Government' | 'Private',
        imageUrl: collegeForm.imageUrl || '',
        email: collegeForm.email,
        phone: collegeForm.phone,
        contactEmail: collegeForm.email, // backward compatibility
        contactPhone: collegeForm.phone, // backward compatibility
        medium: collegeForm.medium,
        notes: collegeForm.notes,
        address: collegeForm.notes, // backward compatibility for college address display
        website: collegeForm.website || '',
        popularCourses: courses
      };

      await setDoc(doc(db, 'colleges', collegeId), collegeDoc);
      setShowCollegeModal(false);
      triggerNotification(editingCollegeId ? 'College document updated' : 'New College document created');
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to save college: ' + err.message);
    }
  };

  const handleDeleteCollege = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this government college from the database?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'colleges', id));
      triggerNotification('College document deleted successfully');
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete college: ' + err.message);
    }
  };

  const handleSyncBaselineColleges = async () => {
    if (!window.confirm('This will restore all default institutions in the list to their real images and default information. Custom additions will be preserved. Proceed?')) {
      return;
    }
    setLoading(true);
    try {
      const { collegesData } = await import('../data/colleges');
      const { writeBatch, doc } = await import('firebase/firestore');
      const batch = writeBatch(db);
      collegesData.forEach((college) => {
        const collegeRef = doc(db, 'colleges', college.id);
        batch.set(collegeRef, college);
      });
      await batch.commit();
      triggerNotification('Successfully synchronized colleges list with real campus images!');
      await fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to sync colleges: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Deadline Actions ---
  const handleOpenAddDeadline = () => {
    setEditingDeadlineId(null);
    setDeadlineForm({
      title: '',
      portal: '',
      date: '',
      status: 'Upcoming',
      link: '',
      category: 'All'
    });
    setShowDeadlineModal(true);
  };

  const handleOpenEditDeadline = (dl: AdmissionDeadline) => {
    setEditingDeadlineId(dl.id);
    setDeadlineForm({
      title: dl.title,
      portal: dl.portal,
      date: dl.date,
      status: dl.status,
      link: dl.link || '',
      category: dl.category || 'All'
    });
    setShowDeadlineModal(true);
  };

  const handleSaveDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineForm.title || !deadlineForm.portal || !deadlineForm.date) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const id = editingDeadlineId || `deadline_${Date.now()}`;
      const deadlineDoc: AdmissionDeadline = {
        id,
        title: deadlineForm.title,
        portal: deadlineForm.portal,
        date: deadlineForm.date,
        status: deadlineForm.status,
        link: deadlineForm.link,
        category: deadlineForm.category
      };

      await setDoc(doc(db, 'deadlines', id), deadlineDoc);
      setShowDeadlineModal(false);
      triggerNotification(editingDeadlineId ? 'Deadline schedule updated' : 'Admission schedule launched');
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to save timeline entry: ' + err.message);
    }
  };

  const handleDeleteDeadline = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this admission timeline entry?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'deadlines', id));
      triggerNotification('Timeline entry deleted successfully');
      fetchAllData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete timeline entry: ' + err.message);
    }
  };

  // --- Search & Filters computation ---
  const filteredStudents = students.filter(std => {
    const q = studentSearch.toLowerCase();
    const matchSearch = (
      !q ||
      std.name?.toLowerCase().includes(q) ||
      std.email?.toLowerCase().includes(q) ||
      std.district?.toLowerCase().includes(q) ||
      std.recommendedStream?.toLowerCase().includes(q)
    );

    const matchDistrict = !studentDistrictFilter || std.district === studentDistrictFilter;
    
    let matchStream = true;
    if (studentStreamFilter) {
      if (studentStreamFilter === 'Pending') {
        matchStream = !std.recommendedStream;
      } else {
        matchStream = std.recommendedStream === studentStreamFilter;
      }
    }

    return matchSearch && matchDistrict && matchStream;
  });

  const filteredColleges = colleges.filter(clg => {
    const q = collegeSearch.toLowerCase();
    const matchSearch = (
      !q ||
      clg.name?.toLowerCase().includes(q) ||
      clg.notes?.toLowerCase().includes(q) ||
      clg.address?.toLowerCase().includes(q) ||
      clg.medium?.toLowerCase().includes(q) ||
      clg.type?.toLowerCase().includes(q)
    );
    const matchDistrict = !collegeDistrictFilter || clg.district === collegeDistrictFilter;
    return matchSearch && matchDistrict;
  });

  const filteredDeadlines = deadlines.filter(dl => {
    const q = timelineSearch.toLowerCase();
    return (
      !q ||
      dl.title?.toLowerCase().includes(q) ||
      dl.portal?.toLowerCase().includes(q) ||
      dl.category?.toLowerCase().includes(q) ||
      dl.status?.toLowerCase().includes(q)
    );
  });

  // --- LIVE ANALYTICS live computation ---
  const getStreamAnalyticsData = () => {
    const streamCounts: Record<string, number> = {
      Science: 0,
      Arts: 0,
      Commerce: 0,
      Vocational: 0,
      'Pending Quiz': 0
    };
    students.forEach(s => {
      const stream = s.recommendedStream || 'Pending Quiz';
      if (streamCounts[stream] !== undefined) {
        streamCounts[stream]++;
      } else {
        streamCounts[stream] = (streamCounts[stream] || 0) + 1;
      }
    });
    return Object.entries(streamCounts).map(([name, count]) => ({
      name,
      candidates: count
    }));
  };

  const getDistrictAnalyticsData = () => {
    const districtCounts: Record<string, number> = {};
    students.forEach(s => {
      const dist = s.district || 'Unspecified';
      districtCounts[dist] = (districtCounts[dist] || 0) + 1;
    });
    return Object.entries(districtCounts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value);
  };

  const streamAnalytics = getStreamAnalyticsData();
  const districtAnalytics = getDistrictAnalyticsData();

  return (
    <div className="space-y-8">
      
      {/* Intro Administrative Header */}
      <div className="bg-[#0F172A] text-white p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Administrative Command Center
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">System Control Panel</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl font-medium">
            Review registered student candidatures, update government college directories, monitor live analytical trends, and update admissions timeline boards.
          </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl shrink-0 flex items-center gap-4 relative z-10">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Total Students</span>
            <span className="text-xl font-black text-white">{students.length}</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Colleges</span>
            <span className="text-xl font-black text-teal-400">{colleges.length}</span>
          </div>
        </div>
      </div>

      {/* Global Success Banner */}
      {successMsg && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-300 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-teal-400" />
          {successMsg}
        </div>
      )}

      {/* Main Panel Content Area styled with Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
        
        {/* SIDEBAR NAVIGATION COLUMN */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto whitespace-nowrap lg:overflow-visible lg:whitespace-normal lg:bg-transparent lg:p-0">
          
          <button
            onClick={() => setActiveSubTab('students')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'students'
                ? 'bg-[#0F172A] text-teal-400 shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-[#0F172A] text-teal-400 shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Live Analytics</span>
          </button>

          <button
            onClick={() => setActiveSubTab('colleges')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'colleges'
                ? 'bg-[#0F172A] text-teal-400 shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
            }`}
          >
            <School className="w-4 h-4" />
            <span>College Management</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deadlines')}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === 'deadlines'
                ? 'bg-[#0F172A] text-teal-400 shadow-md'
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-100/80'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline Management</span>
          </button>

        </aside>

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm overflow-hidden">
          
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Secure Database...</p>
            </div>
          ) : (
            <div>
              
              {/* --- 1. STUDENT DIRECTORY TAB --- */}
              {activeSubTab === 'students' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Student Candidate Registry</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure Firestore Candidates List</p>
                    </div>
                  </div>

                  {/* Multi-Filter Search Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search student name, email..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal-500 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <select
                        value={studentDistrictFilter}
                        onChange={(e) => setStudentDistrictFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
                      >
                        <option value="">All Districts ({KERALA_DISTRICTS.length})</option>
                        {KERALA_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <select
                        value={studentStreamFilter}
                        onChange={(e) => setStudentStreamFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
                      >
                        <option value="">All Recommended Streams</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Vocational">Vocational</option>
                        <option value="Pending">Pending Quiz Completion</option>
                      </select>
                    </div>
                  </div>

                  {/* Candidates Data Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                          <th className="py-4 px-5">Candidate</th>
                          <th className="py-4 px-5">Age</th>
                          <th className="py-4 px-5">District</th>
                          <th className="py-4 px-5">Interests</th>
                          <th className="py-4 px-5">Stream Recommended</th>
                          <th className="py-4 px-5">Registration Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                              No student profiles matched the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((std) => (
                            <tr key={std.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-5">
                                <div className="space-y-0.5">
                                  <div className="font-extrabold text-slate-900">{std.name || 'Anonymous Candidate'}</div>
                                  <div className="text-[10px] text-slate-400 font-semibold">{std.email}</div>
                                </div>
                              </td>
                              <td className="py-4 px-5 font-bold text-slate-600">{std.age || 'N/A'}</td>
                              <td className="py-4 px-5 text-slate-500">{std.district || 'N/A'}</td>
                              <td className="py-4 px-5">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {std.interests && std.interests.length > 0 ? (
                                    std.interests.map((i: string) => (
                                      <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                        {i}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">None selected</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-5 font-black">
                                {std.recommendedStream ? (
                                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
                                    {std.recommendedStream}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">No Quiz Taken</span>
                                )}
                              </td>
                              <td className="py-4 px-5 text-slate-400 font-bold">
                                {std.createdAt || '2026-07-01'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- 2. LIVE ANALYTICS TAB --- */}
              {activeSubTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Demographics & Aptitude Analytics</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live Data Computed from Firestore</p>
                  </div>

                  {/* Analytics Overview Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-teal-50 p-5 rounded-2xl border border-teal-100/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Total Registered Candidates</span>
                      <span className="text-3xl font-black text-teal-900 mt-1 block">{students.length} Students</span>
                    </div>
                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Assessments Completed</span>
                      <span className="text-3xl font-black text-indigo-900 mt-1 block">
                        {students.filter(s => s.recommendedStream).length} Completed
                      </span>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100/50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Average User Age</span>
                      <span className="text-3xl font-black text-emerald-900 mt-1 block">
                        {(students.reduce((acc, s) => acc + (parseInt(s.age) || 17), 0) / (students.length || 1)).toFixed(1)} Yrs
                      </span>
                    </div>
                  </div>

                  {/* Recharts Graphical Charts Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                    
                    {/* Stream Distribution Bar Chart */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-teal-600 animate-pulse" />
                        <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Aptitude Streams Distribution</h4>
                      </div>
                      <div className="h-64 w-full text-xs font-semibold">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={streamAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                            <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '10px' }} />
                            <Bar dataKey="candidates" fill="#0D9488" radius={[6, 6, 0, 0]}>
                              {streamAnalytics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* District Distribution Pie Chart */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Geographical Distribution (Students)</h4>
                      </div>
                      <div className="h-64 w-full text-xs font-semibold">
                        {districtAnalytics.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-slate-400 uppercase font-bold tracking-wider">
                            No geographical data loaded
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={districtAnalytics}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {districtAnalytics.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '10px' }} />
                              <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* --- 3. COLLEGE MANAGEMENT TAB --- */}
              {activeSubTab === 'colleges' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Institution Directory Board</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Government Institutes CRUD Controller</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSyncBaselineColleges}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shrink-0"
                        title="Reset & Sync default colleges to real-life images"
                      >
                        <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                        Sync Real Images
                      </button>
                      <button
                        onClick={handleOpenAddCollege}
                        className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Add Institution Doc
                      </button>
                    </div>
                  </div>

                  {/* Colleges filter & search controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search institution name, type, medium..."
                        value={collegeSearch}
                        onChange={(e) => setCollegeSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal-500 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <select
                        value={collegeDistrictFilter}
                        onChange={(e) => setCollegeDistrictFilter(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-teal-500"
                      >
                        <option value="">All Districts ({KERALA_DISTRICTS.length})</option>
                        {KERALA_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Colleges Table view with actions */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                          <th className="py-4 px-5">Institution</th>
                          <th className="py-4 px-5">District</th>
                          <th className="py-4 px-5">Contacts</th>
                          <th className="py-4 px-5">Type / Medium</th>
                          <th className="py-4 px-5">Notes</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {filteredColleges.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                              No colleges currently match queries.
                            </td>
                          </tr>
                        ) : (
                          filteredColleges.map((clg) => (
                            <tr key={clg.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                    <img 
                                      src={clg.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&auto=format&fit=crop&q=60'} 
                                      alt="" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="font-extrabold text-slate-900 truncate max-w-[200px]" title={clg.name}>{clg.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate max-w-[200px] font-semibold">{clg.address}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5 font-bold text-slate-600">{clg.district}</td>
                              <td className="py-4 px-5 space-y-1">
                                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{clg.email || clg.contactEmail || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{clg.phone || clg.contactPhone || 'N/A'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-5 space-y-1">
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-150 text-slate-700 border border-slate-200">
                                    {clg.type}
                                  </span>
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                    clg.category === 'Private' 
                                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                      : 'bg-teal-50 text-teal-700 border-teal-200'
                                  }`}>
                                    {clg.category || 'Government'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Medium: {clg.medium || 'English'}</div>
                              </td>
                              <td className="py-4 px-5">
                                <p className="text-[11px] text-slate-500 line-clamp-2 max-w-[160px] leading-relaxed font-semibold">
                                  {clg.notes || clg.address || 'N/A'}
                                </p>
                              </td>
                              <td className="py-4 px-5 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditCollege(clg)}
                                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all border border-slate-100 cursor-pointer"
                                    title="Edit Document"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCollege(clg.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-slate-100 cursor-pointer"
                                    title="Delete Document"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* --- 4. TIMELINE & SCHOLARSHIP MANAGEMENT TAB --- */}
              {activeSubTab === 'deadlines' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Timeline & Scholarships Board</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage admissions closing dates and scholarship listings</p>
                    </div>
                    <button
                      onClick={handleOpenAddDeadline}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/10 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add Admission/Scholarship
                    </button>
                  </div>

                  {/* Timelines Search bar */}
                  <div className="relative max-w-md bg-slate-50 rounded-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search deadlines, portals or eligibility categories..."
                      value={timelineSearch}
                      onChange={(e) => setTimelineSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-teal-500 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Timelines Data Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                          <th className="py-4 px-5">Admission / Scholarship Title</th>
                          <th className="py-4 px-5">Admissions Board / Provider</th>
                          <th className="py-4 px-5">Closing Date</th>
                          <th className="py-4 px-5">Category Eligibility</th>
                          <th className="py-4 px-5">Portal Link</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                        {filteredDeadlines.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider">
                              No timelines or scholarship entries matches current filters.
                            </td>
                          </tr>
                        ) : (
                          filteredDeadlines.map((dl) => (
                            <tr key={dl.id} className="hover:bg-slate-50/50 transition-all">
                              <td className="py-4 px-5">
                                <div className="font-extrabold text-slate-900 max-w-[250px] leading-snug">
                                  {dl.title}
                                </div>
                              </td>
                              <td className="py-4 px-5 text-slate-500 font-semibold">{dl.portal}</td>
                              <td className="py-4 px-5 font-black text-slate-750">{dl.date}</td>
                              <td className="py-4 px-5">
                                <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded">
                                  {dl.category}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <a
                                  href={dl.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-teal-600 hover:text-teal-800 transition-all font-bold flex items-center gap-1"
                                >
                                  <span>Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  dl.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' :
                                  dl.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-150' :
                                  'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}>
                                  {dl.status}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditDeadline(dl)}
                                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all border border-slate-100 cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDeadline(dl.id)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-slate-100 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* --- COLLEGE ADD/EDIT MODAL BOARD --- */}
      {showCollegeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCollegeModal(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-black text-slate-950 mb-6">
              {editingCollegeId ? 'Edit College Document' : 'Add Institution Doc'}
            </h3>

            <form onSubmit={handleSaveCollege} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College Name</label>
                <input
                  type="text"
                  required
                  value={collegeForm.name}
                  onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                  placeholder="e.g. Government Engineering College, Barton Hill"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">District</label>
                  <select
                    value={collegeForm.district}
                    onChange={(e) => setCollegeForm({ ...collegeForm, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    {KERALA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institution Type</label>
                  <select
                    value={collegeForm.type}
                    onChange={(e) => setCollegeForm({ ...collegeForm, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    {COLLEGE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sector / Category</label>
                  <select
                    value={collegeForm.category}
                    onChange={(e) => setCollegeForm({ ...collegeForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Contact</label>
                  <input
                    type="text"
                    required
                    value={collegeForm.phone}
                    onChange={(e) => setCollegeForm({ ...collegeForm, phone: e.target.value })}
                    placeholder="0471-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Contact</label>
                  <input
                    type="email"
                    required
                    value={collegeForm.email}
                    onChange={(e) => setCollegeForm({ ...collegeForm, email: e.target.value })}
                    placeholder="office@college.ac.in"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teaching Medium</label>
                  <select
                    value={collegeForm.medium}
                    onChange={(e) => setCollegeForm({ ...collegeForm, medium: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="English">English Only</option>
                    <option value="Malayalam">Malayalam Only</option>
                    <option value="Both">Bilingual (English & Malayalam)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Website URL</label>
                  <input
                    type="url"
                    value={collegeForm.website}
                    onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popular Courses (Comma Separated)</label>
                <input
                  type="text"
                  value={collegeForm.popularCoursesStr}
                  onChange={(e) => setCollegeForm({ ...collegeForm, popularCoursesStr: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science, B.Tech Electronics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={collegeForm.imageUrl}
                    onChange={(e) => setCollegeForm({ ...collegeForm, imageUrl: e.target.value })}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  {collegeForm.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img 
                        src={collegeForm.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&auto=format&fit=crop&q=60';
                        }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 font-semibold">Paste an Unsplash image URL or any public image web link.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Address & Detailed Notes</label>
                <textarea
                  required
                  rows={3}
                  value={collegeForm.notes}
                  onChange={(e) => setCollegeForm({ ...collegeForm, notes: e.target.value })}
                  placeholder="Complete postal location, PIN, and general notes/amenities of the college..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none resize-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-wider rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/10"
              >
                <Save className="w-4 h-4" />
                {editingCollegeId ? 'Apply Update Document' : 'Submit College Document'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- DEADLINE & SCHOLARSHIP ADD/EDIT MODAL BOARD --- */}
      {showDeadlineModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-8 w-full max-w-xl shadow-2xl relative">
            <button
              onClick={() => setShowDeadlineModal(false)}
              className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-black text-slate-950 mb-6">
              {editingDeadlineId ? 'Edit Admissions / Scholarship Listing' : 'Create Admission/Scholarship Listing'}
            </h3>

            <form onSubmit={handleSaveDeadline} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Entrance / Scholarship Title</label>
                <input
                  type="text"
                  required
                  value={deadlineForm.title}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, title: e.target.value })}
                  placeholder="e.g. KEAM Engineering Portal OR Central Sector Scholarship Scheme"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portal Board / Provider</label>
                  <input
                    type="text"
                    required
                    value={deadlineForm.portal}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, portal: e.target.value })}
                    placeholder="e.g. CEE Kerala / Ministry of Education"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Closing Date</label>
                  <input
                    type="date"
                    required
                    value={deadlineForm.date}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                  <select
                    value={deadlineForm.status}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category Eligibility</label>
                  <select
                    value={deadlineForm.category}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="All">All Students</option>
                    <option value="Class 10">Class 10 Candidates</option>
                    <option value="Class 12">Class 12 Candidates</option>
                    <option value="Scholarships">Scholarship Window</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Reference Link</label>
                <input
                  type="url"
                  required
                  value={deadlineForm.link}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-wider rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/10"
              >
                <Save className="w-4 h-4" />
                {editingDeadlineId ? 'Apply Update Listing' : 'Launch New Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
