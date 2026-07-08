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
  LucideIcon
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

  const handleStartQuiz = () => {
    setQuizState('active');
    setCurrentQuestionIdx(0);
    setScores({ Arts: 0, Science: 0, Commerce: 0, Vocational: 0 });
    setAnswersHistory([]);
  };

  const handleOptionSelect = (weights: { Arts: number; Science: number; Commerce: number; Vocational: number }) => {
    // Record history for potential back-tracking
    const answer = { questionId: aptitudeQuestions[currentQuestionIdx].id, weights };
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

    if (currentQuestionIdx < aptitudeQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate winner
      const recommended = getRecommendedStream(newScores);
      onQuizCompleted(recommended);
      setQuizState('results');
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
  };

  const totalQuestions = aptitudeQuestions.length;
  const progressPercent = Math.round(((currentQuestionIdx) / totalQuestions) * 100);

  // Calculate results info
  const winnerStream = getRecommendedStream(scores);
  const totalScoreWeight = Math.max(1, scores.Arts + scores.Science + scores.Commerce + scores.Vocational);
  const percentageArts = Math.round((scores.Arts / totalScoreWeight) * 100);
  const percentageScience = Math.round((scores.Science / totalScoreWeight) * 100);
  const percentageCommerce = Math.round((scores.Commerce / totalScoreWeight) * 100);
  const percentageVocational = Math.round((scores.Vocational / totalScoreWeight) * 100);

  const RecommendedIcon = STREAM_INFO[winnerStream]?.icon || Compass;

  return (
    <div id="quiz-container" className="w-full max-w-3xl mx-auto">
      
      {/* Intro State */}
      {quizState === 'intro' && (
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
              Take our interactive 10-question aptitude quiz designed to identify whether Arts, Science, Commerce, or Vocational pathways match your logical strengths and interests.
            </p>
          </div>

          <div className="bg-slate-50 rounded-[20px] p-5 max-w-md mx-auto text-left text-xs text-slate-500 space-y-3.5 border border-slate-100">
            <div className="flex gap-2">
              <span className="text-teal-500 font-bold text-sm leading-none">✓</span>
              <span className="font-semibold">10 objective questions with practical scenarios.</span>
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
                {aptitudeQuestions[currentQuestionIdx].text}
              </h2>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {aptitudeQuestions[currentQuestionIdx].choices.map((choice, oIdx) => {
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
