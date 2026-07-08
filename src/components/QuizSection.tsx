import React, { useState } from 'react';
import { StudentProfile, StreamType } from '../types';
import { aptitudeQuestions } from '../data/quiz';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  RotateCcw, 
  Map, 
  Award, 
  BrainCircuit, 
  Compass, 
  ChevronLeft,
  BookOpen,
  FlaskConical,
  Briefcase,
  Wrench,
  CheckCircle,
  LucideIcon,
  Sparkles,
  Cpu,
  Lightbulb,
  Loader2
} from 'lucide-react';

interface QuizSectionProps {
  profile: StudentProfile;
  onNavigateToTab: (tabId: string) => void;
  onQuizCompleted: (recommendedStream: StreamType) => void;
}

const STREAM_INFO: Record<StreamType, {
  title: string;
  icon: LucideIcon;
  color: string;
  bgLight: string;
  borderColor: string;
  explanation: string;
  subjects: string[];
}> = {
  Science: {
    title: 'Science & Technology (Group I / II)',
    icon: FlaskConical,
    color: 'text-blue-600 bg-blue-100',
    bgLight: 'bg-blue-50/50',
    borderColor: 'border-blue-200',
    explanation: 'You have a natural analytical mind and love discovering how things work! Your choices show a strong leaning towards logic, empirical research, technology, and engineering or medical concepts. This stream opens up prestigious pathways in medicine, aerospace, software development, biotechnology, and pure academic research in Kerala.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science']
  },
  Arts: {
    title: 'Humanities & Fine Arts',
    icon: BookOpen,
    color: 'text-rose-600 bg-rose-100',
    bgLight: 'bg-rose-50/50',
    borderColor: 'border-rose-200',
    explanation: 'You are highly creative, deeply empathetic, and curious about social structures, history, and human expression! Your responses show an appreciation for literature, social research, writing, media, and design. This stream offers extensive opportunities in Civil Services (IAS/IPS via KAS), journalism, corporate law, design (NID/NIFT), counseling, and creative media.',
    subjects: ['History', 'Political Science', 'Economics', 'Sociology', 'English/Malayalam Literature']
  },
  Commerce: {
    title: 'Commerce & Management',
    icon: Briefcase,
    color: 'text-emerald-600 bg-emerald-100',
    bgLight: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200',
    explanation: 'You have excellent organization, financial interest, and business logic! Your aptitude points heavily towards market systems, accounting, entrepreneurship, trade policies, and executive leadership. This stream serves as a launchpad for Chartered Accountancy (CA), MBA, corporate law, business consulting, and startup leadership in Kerala\'s growing economy.',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Computer Applications', 'Mathematics']
  },
  Vocational: {
    title: 'Vocational & Technical Studies',
    icon: Wrench,
    color: 'text-amber-600 bg-amber-100',
    bgLight: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    explanation: 'You are a practical learner who loves hands-on experimentation, building physical prototypes, and troubleshooting real devices! Your responses lean heavily towards industrial crafts, mechanical operations, hospitality, and specialized technical systems. This stream provides early career entry via Polytechnic Diplomas, VHSE, or B.Voc courses directly matching immediate employment sectors.',
    subjects: ['Automobile Tech', 'Software Development', 'Tourism & Hospitality', 'Electrical Sub-Systems', 'Livestock Management']
  }
};

export default function QuizSection({ profile, onNavigateToTab, onQuizCompleted }: QuizSectionProps) {
  const [quizState, setQuizState] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [scores, setScores] = useState({ Arts: 0, Science: 0, Commerce: 0, Vocational: 0 });
  const [answersHistory, setAnswersHistory] = useState<{ questionId: number; weights: any }[]>([]);

  // AI Integration States
  const [useAIQuestions, setUseAIQuestions] = useState(false);
  const [loadingAIQuestions, setLoadingAIQuestions] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Merge default questions with AI-generated questions when Adaptive Mode is active
  const activeQuestions = useAIQuestions && aiQuestions.length > 0 
    ? [...aptitudeQuestions, ...aiQuestions]
    : aptitudeQuestions;

  const handleStartQuiz = async () => {
    setErrorMsg(null);
    setAiEvaluation(null);
    setAiQuestions([]);

    if (useAIQuestions) {
      setLoadingAIQuestions(true);
      try {
        const res = await fetch('/api/ai/quiz-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interests: profile.interests,
            district: profile.district,
            currentClass: profile.currentClass
          })
        });
        if (!res.ok) {
          throw new Error('AI Question generator returned an error.');
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAiQuestions(data);
        } else {
          throw new Error('Empty AI questions received.');
        }
        setQuizState('active');
        setCurrentQuestionIdx(0);
        setScores({ Arts: 0, Science: 0, Commerce: 0, Vocational: 0 });
        setAnswersHistory([]);
      } catch (err: any) {
        console.error('Error fetching AI questions:', err);
        setErrorMsg('AI Service was busy. Starting the standard Kerala Aptitude test instead!');
        setUseAIQuestions(false);
        setQuizState('active');
        setCurrentQuestionIdx(0);
        setScores({ Arts: 0, Science: 0, Commerce: 0, Vocational: 0 });
        setAnswersHistory([]);
      } finally {
        setLoadingAIQuestions(false);
      }
    } else {
      setQuizState('active');
      setCurrentQuestionIdx(0);
      setScores({ Arts: 0, Science: 0, Commerce: 0, Vocational: 0 });
      setAnswersHistory([]);
    }
  };

  const triggerAIEvaluation = async (finalScores: typeof scores, recommended: StreamType) => {
    setLoadingEvaluation(true);
    setAiEvaluation(null);
    try {
      const res = await fetch('/api/ai/quiz-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          scores: finalScores,
          recommendedStream: recommended
        })
      });
      if (!res.ok) {
        throw new Error('AI Evaluation service returned an error.');
      }
      const data = await res.json();
      setAiEvaluation(data);
    } catch (err: any) {
      console.error('Error fetching AI counselor evaluation:', err);
    } finally {
      setLoadingEvaluation(false);
    }
  };

  const handleOptionSelect = (weights: { Arts: number; Science: number; Commerce: number; Vocational: number }) => {
    // Record history for potential back-tracking
    const answer = { questionId: activeQuestions[currentQuestionIdx].id, weights };
    const updatedHistory = [...answersHistory, answer];
    setAnswersHistory(updatedHistory);

    // Add weights to cumulative score
    const newScores = {
      Arts: scores.Arts + (weights.Arts || 0),
      Science: scores.Science + (weights.Science || 0),
      Commerce: scores.Commerce + (weights.Commerce || 0),
      Vocational: scores.Vocational + (weights.Vocational || 0)
    };
    setScores(newScores);

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate winner
      const recommended = getRecommendedStream(newScores);
      onQuizCompleted(recommended);
      setQuizState('results');
      triggerAIEvaluation(newScores, recommended);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx === 0) return;

    // Retrieve previous answer to subtract weights
    const lastAnswer = answersHistory[answersHistory.length - 1];
    const prevWeights = lastAnswer.weights;

    setScores({
      Arts: scores.Arts - (prevWeights.Arts || 0),
      Science: scores.Science - (prevWeights.Science || 0),
      Commerce: scores.Commerce - (prevWeights.Commerce || 0),
      Vocational: scores.Vocational - (prevWeights.Vocational || 0)
    });

    setAnswersHistory(answersHistory.slice(0, -1));
    setCurrentQuestionIdx(currentQuestionIdx - 1);
  };

  const getRecommendedStream = (currentScores: typeof scores): StreamType => {
    let maxScore = -1;
    let winner: StreamType = 'Science';

    const keys: StreamType[] = ['Science', 'Arts', 'Commerce', 'Vocational'];
    keys.forEach((key) => {
      if (currentScores[key] > maxScore) {
        maxScore = currentScores[key];
        winner = key;
      }
    });

    return winner;
  };

  const handleRetake = () => {
    setQuizState('intro');
    setAiEvaluation(null);
    setAiQuestions([]);
    setErrorMsg(null);
  };

  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round(((currentQuestionIdx) / totalQuestions) * 100);

  // Calculate results info
  const winnerStream = getRecommendedStream(scores);
  const totalScoreWeight = Math.max(1, scores.Arts + scores.Science + scores.Commerce + scores.Vocational);
  const percentageArts = Math.round((scores.Arts / totalScoreWeight) * 100);
  const percentageScience = Math.round((scores.Science / totalScoreWeight) * 100);
  const percentageCommerce = Math.round((scores.Commerce / totalScoreWeight) * 100);
  const percentageVocational = Math.round((scores.Vocational / totalScoreWeight) * 100);

  const RecommendedIcon = STREAM_INFO[winnerStream]?.icon || Compass;

  // Custom parser to format Gemini markdown-like responses into stylized elements safely
  const formatAIText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-extrabold text-slate-800 mt-4 mb-1.5 uppercase tracking-wider">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-black text-teal-800 mt-5 mb-2 border-b border-teal-100 pb-1">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return (
          <li key={idx} className="list-disc list-inside text-xs text-slate-650 font-medium ml-2 my-1 leading-relaxed">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      if (trimmed === '') return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-xs md:text-sm text-slate-605 leading-relaxed my-1.5 font-medium">{trimmed}</p>;
    });
  };

  return (
    <div id="quiz-container" className="w-full max-w-3xl mx-auto">
      
      {/* AI Questions Generation Loading State */}
      {loadingAIQuestions && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-12 text-center space-y-5">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-slate-100 border-t-teal-500 rounded-full animate-spin" />
            <Cpu className="w-8 h-8 text-teal-600 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600 fill-teal-100" />
              Dynamic AI Adaptive Engine
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Consulting Gemini to craft custom questions...</p>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed italic">
            "Generating interactive situational scenarios matching: {profile.interests?.length > 0 ? profile.interests.join(', ') : 'Kerala Career Tracks'}..."
          </p>
        </div>
      )}

      {/* Intro State */}
      {!loadingAIQuestions && quizState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-teal-600">
            <BrainCircuit className="w-9 h-9" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl serif-italic font-normal text-slate-950">
              Discover Your Academic Stream
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-xs md:text-sm leading-relaxed">
              Take our interactive aptitude quiz designed to identify whether Arts, Science, Commerce, or Vocational pathways match your logical strengths and interests.
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 font-semibold max-w-md mx-auto">
              ⚠️ {errorMsg}
            </p>
          )}

          <div className="bg-slate-50 rounded-[20px] p-5 max-w-md mx-auto text-left text-xs text-slate-500 space-y-3.5 border border-slate-100">
            <div className="flex gap-2">
              <span className="text-teal-500 font-bold text-sm leading-none">✓</span>
              <span className="font-semibold">Baseline objective questions with practical scenarios.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-teal-500 font-bold text-sm leading-none">✓</span>
              <span className="font-semibold">Takes less than 4 minutes to complete.</span>
            </div>
            <div className="flex gap-2">
              <span className="text-teal-500 font-bold text-sm leading-none">✓</span>
              <span className="font-semibold">Calculates real weights matching standard high school streams.</span>
            </div>
          </div>

          {/* Adaptive AI Mode Controller */}
          <div className="bg-slate-50 rounded-[20px] p-5 max-w-md mx-auto border border-slate-100 text-left space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="use-ai-toggle"
                checked={useAIQuestions}
                onChange={(e) => setUseAIQuestions(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <label htmlFor="use-ai-toggle" className="space-y-1 cursor-pointer select-none">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-100 animate-pulse" />
                  Enable Adaptive AI Situational Questions
                </span>
                <span className="text-[10px] text-slate-500 font-medium block leading-relaxed">
                  Toggle to have Gemini AI dynamically inject real-world scenarios tailored to your saved interests ({profile.interests?.length > 0 ? profile.interests.join(', ') : 'no current interests saved'})!
                </span>
              </label>
            </div>
            {profile.interests?.length === 0 && (
              <p className="text-[10px] text-amber-650 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 font-semibold leading-relaxed">
                💡 Tip: Add interests under your **Profile Tab** first to customize these adaptive AI questions to your passions!
              </p>
            )}
          </div>

          <button
            onClick={handleStartQuiz}
            id="start-quiz-btn"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-600/10 hover:shadow-lg hover:shadow-teal-600/20 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Aptitude Quiz
          </button>
        </motion.div>
      )}

      {/* Active State */}
      {quizState === 'active' && (
        <div className="space-y-6">
          
          {/* Header Info */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIdx === 0}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Aptitude Test</span>
                <h3 className="text-xs font-bold text-slate-700">Question {currentQuestionIdx + 1} of {totalQuestions}</h3>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Progress</span>
              <div className="text-xs font-black text-slate-700">{progressPercent}%</div>
            </div>
          </div>

          {/* Progress Tracker Line */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-teal-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6"
            >
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                {activeQuestions[currentQuestionIdx]?.text}
              </h2>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {activeQuestions[currentQuestionIdx]?.choices.map((choice, oIdx) => {
                  const labelLetter = String.fromCharCode(65 + oIdx); // A, B, C, D
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(choice.weights)}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 text-left bg-white hover:bg-teal-50/40 hover:border-teal-400 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-100 group-hover:text-teal-700 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 transition-all">
                        {labelLetter}
                      </div>
                      <span className="text-slate-600 group-hover:text-slate-800 text-xs md:text-sm font-semibold pt-1">
                        {choice.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Results State */}
      {quizState === 'results' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Recommendation Hero */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${STREAM_INFO[winnerStream]?.color} text-2xl font-bold`}>
                <RecommendedIcon className="w-8 h-8" />
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5 animate-bounce" />
                  Your Recommended Stream
                </div>
                <h2 className="text-2xl md:text-4xl serif-italic font-normal text-slate-900 leading-tight">
                  {STREAM_INFO[winnerStream]?.title}
                </h2>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                  {STREAM_INFO[winnerStream]?.explanation}
                </p>
              </div>
            </div>

            {/* Core Subject Highlights */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Core Subjects in this Stream</span>
              <div className="flex flex-wrap gap-2">
                {STREAM_INFO[winnerStream]?.subjects.map((sub, sIdx) => (
                  <span key={sIdx} className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 border border-slate-100">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Graphical Score Breakdown (Bespoke lightweight CSS representation) */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl serif-italic font-normal text-slate-950">Your Aptitude Profile</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Calculated weights across different subject combinations</p>
            </div>

            <div className="space-y-5">
              
              {/* Science Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-teal-700 flex items-center gap-1.5 font-bold">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Science & Technology
                  </span>
                  <span className="text-slate-600 font-bold">{percentageScience}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${percentageScience}%` }}
                  />
                </div>
              </div>

              {/* Arts Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-rose-700 flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    Humanities & Arts
                  </span>
                  <span className="text-slate-600 font-bold">{percentageArts}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${percentageArts}%` }}
                  />
                </div>
              </div>

              {/* Commerce Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                    <Briefcase className="w-3.5 h-3.5" />
                    Commerce & Finance
                  </span>
                  <span className="text-slate-600 font-bold">{percentageCommerce}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${percentageCommerce}%` }}
                  />
                </div>
              </div>

              {/* Vocational Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-700 flex items-center gap-1.5 font-bold">
                    <Wrench className="w-3.5 h-3.5" />
                    Vocational & Technical
                  </span>
                  <span className="text-slate-600 font-bold">{percentageVocational}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${percentageVocational}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* AI Counselor Report Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                  <Sparkles className="w-5 h-5 fill-teal-100 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                    CareerCompass AI Counselor Report
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Custom higher education matching powered by Gemini</p>
                </div>
              </div>
            </div>

            {loadingEvaluation && (
              <div className="py-12 text-center space-y-4">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Analyzing your Aptitude Matrix...</p>
                  <p className="text-[11px] text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
                    Connecting with our Gemini AI counselor to generate personalized pathways, matching Kerala government colleges, emerging careers, and action items!
                  </p>
                </div>
              </div>
            )}

            {!loadingEvaluation && !aiEvaluation && (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-slate-450 font-semibold">Could not load the AI report. Click below to retry generating your professional counseling assessment.</p>
                <button
                  onClick={() => triggerAIEvaluation(scores, winnerStream)}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200"
                >
                  Generate AI Report
                </button>
              </div>
            )}

            {!loadingEvaluation && aiEvaluation && (
              <div className="space-y-6">
                {/* 1. Summary Analysis */}
                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-teal-650 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Personalized Profile Assessment
                  </span>
                  <div className="text-slate-700 leading-relaxed font-semibold">
                    {formatAIText(aiEvaluation.analysis)}
                  </div>
                </div>

                {/* 2. Higher Education Pathway in Kerala */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Kerala-Specific Higher Education Roadmap</h4>
                  <div className="relative border-l-2 border-teal-150 pl-5 ml-2.5 space-y-6">
                    {Array.isArray(aiEvaluation.keralaRoadmap) && aiEvaluation.keralaRoadmap.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="relative">
                        {/* Bullet Circle */}
                        <span className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white ring-4 ring-teal-50 shrink-0" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black text-teal-650 uppercase tracking-widest">{step.milestone || `Phase ${sIdx + 1}`}</span>
                          <h5 className="text-xs font-extrabold text-slate-900">{step.pathway}</h5>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Hot Careers & Local Courses (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Hot Careers */}
                  <div className="space-y-3 bg-teal-50/20 p-5 rounded-2xl border border-teal-500/5">
                    <span className="text-[10px] font-black text-teal-705 uppercase tracking-widest block">📈 Emerging High-Demand Careers</span>
                    <ul className="space-y-2">
                      {Array.isArray(aiEvaluation.hotCareers) && aiEvaluation.hotCareers.map((car: string, cIdx: number) => (
                        <li key={cIdx} className="text-xs text-slate-750 font-bold flex items-start gap-2">
                          <span className="text-teal-500 font-bold">•</span>
                          <span>{car}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Local Courses */}
                  <div className="space-y-3 bg-rose-50/20 p-5 rounded-2xl border border-rose-500/5">
                    <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest block">🎓 Top Degree Courses & Institutes in Kerala</span>
                    <ul className="space-y-2.5">
                      {Array.isArray(aiEvaluation.localCourses) && aiEvaluation.localCourses.map((crs: any, cIdx: number) => (
                        <li key={cIdx} className="text-[11px] text-slate-650 space-y-0.5 font-medium leading-snug">
                          <div className="font-extrabold text-slate-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-450" />
                            {crs.course}
                          </div>
                          <div className="text-[10px] text-slate-500 pl-2.5 font-bold uppercase tracking-wider">{crs.institutes}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Actionable Tips */}
                <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-500/10 space-y-2.5">
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
                    Immediate Next Steps & Skill Building Advice
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.isArray(aiEvaluation.tips) && aiEvaluation.tips.map((tip: string, tIdx: number) => (
                      <li key={tIdx} className="bg-white p-2.5 rounded-xl border border-amber-500/5 text-[11px] text-slate-600 font-semibold flex items-start gap-2 shadow-sm">
                        <span className="text-amber-500 font-bold">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleRetake}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all w-full sm:w-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Aptitude Quiz
            </button>

            <button
              onClick={() => onNavigateToTab('careers')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-600/10 hover:shadow-lg active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              Explore Paths in Career Map
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
