import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Download, 
  BrainCircuit, 
  School, 
  Cpu, 
  BookOpen, 
  Award, 
  HelpCircle,
  Loader2
} from 'lucide-react';

interface CompassAICoachProps {
  profile: any;
  activeLanguage: 'EN' | 'ML';
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export default function CompassAICoach({ profile, activeLanguage }: CompassAICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceSim, setVoiceSim] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested quick prompts matching the architectural modules
  const promptSuggestions = activeLanguage === 'EN' ? [
    { label: "📚 Study Planner Generator", text: "Create a detailed 30-day study plan for Plus Two Science board exam preparation." },
    { label: "🏫 Govt College Recommendations", text: "Which are the top Government Polytechnic colleges in Kerala with good hostels?" },
    { label: "💼 Professional Resume Guide", text: "Provide a clean, standard 1-page resume template structure for an engineering graduate." },
    { label: "💰 Scholarship Guidance", text: "Explain eligibility criteria for state-level scholarships for girls in Kerala." },
    { label: "🏛️ Civil Services Exam Advice", text: "What degree should I take to best prepare for UPSC Civil Services exam in Kerala?" },
    { label: "🌱 Internship Suggestions", text: "Suggest some top entry-level internship platforms in Kochi and Trivandrum Infoparks." }
  ] : [
    { label: "📚 സ്റ്റഡി പ്ലാനർ തയ്യാറാക്കുക", text: "പ്ലസ് ടു സയൻസ് ബോർഡ് പരീക്ഷയ്ക്ക് 30 ദിവസത്തെ വിശദമായ സ്റ്റഡി പ്ലാൻ ഉണ്ടാക്കുക." },
    { label: "🏫 ഗവൺമെന്റ് കോളേജുകൾ", text: "കേരളത്തിലെ മികച്ച ഗവൺമെന്റ് പോളിടെക്നിക് കോളേജുകൾ ഏതെല്ലാമാണ്?" },
    { label: "💼 റെസ്യൂമെ തയ്യാറാക്കാൻ", text: "കേരളത്തിലെ വിദ്യാർത്ഥികൾക്ക് ഉപയോഗിക്കാവുന്ന ഒരു റെസ്യൂമെ ടെംപ്ലേറ്റ് പറഞ്ഞുതരിക." },
    { label: "💰 സ്കോളർഷിപ്പ് വിവരങ്ങൾ", text: "കേരളത്തിലെ വിദ്യാർത്ഥിനികൾക്കുള്ള മികച്ച സ്കോളർഷിപ്പുകൾ ഏതെല്ലാമാണ്?" },
    { label: "🏛️ സിവിൽ സർവീസ് കോച്ചിംഗ്", text: "കേരളത്തിൽ സിവിൽ സർവീസ് പരീക്ഷയ്ക്ക് തയ്യാറെടുക്കാൻ ഏത് ഡിഗ്രി തിരഞ്ഞെടുക്കണം?" },
    { label: "🌱 ഇന്റേൺഷിപ്പ് നിർദ്ദേശങ്ങൾ", text: "കൊച്ചി, ട്രിവാൻഡ്രം ഇൻഫോപാർക്കുകളിലെ മികച്ച ഇന്റേൺഷിപ്പുകൾ കണ്ടെത്താൻ സഹായിക്കുക." }
  ];

  useEffect(() => {
    // Set welcome message
    const welcomeText = activeLanguage === 'EN' 
      ? `Hello ${profile.name || 'Student'}! I am Compass AI, your personal higher education and career mentor. I support both English and Malayalam (മലയാളം). How can I guide you today?`
      : `ഹലോ ${profile.name || 'വിദ്യാർത്ഥി'}! ഞാൻ കരിയർ കോമ്പസ്സ് AI അസിസ്റ്റന്റ് ആണ്. നിങ്ങൾക്ക് ആവശ്യമായ കോഴ്സുകൾ, കരിയർ വിവരങ്ങൾ, കോളേജ് സെലക്ഷൻ, സ്കോളർഷിപ്പുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാവുന്നതാണ്.`;
    
    setMessages([
      { role: 'model', content: welcomeText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [activeLanguage, profile.name]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/ai/general-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          profile: profile
        })
      });

      if (!response.ok) {
        throw new Error('AI Coach is temporarily busy. Please retry.');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        role: 'model',
        content: data.text || "I apologize, I could not synthesize a proper response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      // Mark chat as active
      localStorage.setItem('career_compass_chat_active', 'true');
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: `⚠️ Error: ${err.message || "Failed to contact AI counselor. Please check your internet connection."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSimulate = () => {
    setVoiceSim(!voiceSim);
    if (!voiceSim) {
      alert("Voice input enabled (Simulation mode). Simply type or click quick prompts to talk to Compass AI!");
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Reset this counselling session chat history?')) {
      const welcomeText = activeLanguage === 'EN' 
        ? `Hello! I am Compass AI. How can I guide you today?`
        : `ഹലോ! ഞാൻ കരിയർ കോമ്പസ്സ് AI അസിസ്റ്റന്റ് ആണ്. നിങ്ങൾക്ക് എങ്ങനെയാണ് ഞാൻ സഹായം നൽകേണ്ടത്?`;
      setMessages([
        { role: 'model', content: welcomeText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }
  };

  const handleDownloadChat = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.role === 'user' ? 'Student' : 'Compass AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `career_compass_chat_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600 animate-pulse" />
            Compass AI Counselor
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Bilingual career counseling, study plans, and college recommendations
          </p>
        </div>

        {/* Action controls */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={handleVoiceSimulate}
            className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              voiceSim 
                ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
            title="Toggle simulated microphone speech mode"
          >
            {voiceSim ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Voice Mode</span>
          </button>
          
          <button
            onClick={handleDownloadChat}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            title="Download Chat Log"
          >
            <Download className="w-4 h-4" />
            <span>Save Chat</span>
          </button>

          <button
            onClick={handleClearChat}
            className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl transition-all border border-slate-200 cursor-pointer"
            title="Clear Chat History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CHAT INTERFACE WINDOW */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

        {/* Chat message listing viewport */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 scrollbar-thin">
          {messages.map((msg, idx) => {
            const isAI = msg.role === 'model';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs border shrink-0 ${
                  isAI ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-slate-900 text-teal-400 border-slate-800'
                }`}>
                  {isAI ? '🤖' : '👤'}
                </span>

                <div className="space-y-1 text-xs">
                  <div className={`p-4 rounded-3xl leading-relaxed whitespace-pre-wrap font-medium shadow-xs ${
                    isAI 
                      ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100' 
                      : 'bg-teal-500 text-slate-950 rounded-tr-none'
                  }`}>
                    {msg.content}
                  </div>
                  <span className={`text-[9px] text-slate-400 font-bold block ${isAI ? 'text-left pl-1' : 'text-right pr-1'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* LOADING STREAM SKELETON */}
          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-sm animate-bounce shrink-0">
                🤖
              </span>
              <div className="bg-slate-50 p-4 rounded-3xl rounded-tl-none border border-slate-100 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                Thinking & generating counseling pathway...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* VOICE PULSATING BAR */}
        {voiceSim && (
          <div className="px-6 py-2 bg-teal-50 border-t border-teal-100 flex items-center justify-between text-[10px] text-teal-800 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              Microphone Simulation Mode Active (Malayalam & English supported)
            </span>
            {/* Visualizer bars */}
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-0.5 bg-teal-500 h-2 animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-0.5 bg-teal-500 h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
              <div className="w-0.5 bg-teal-500 h-1 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="w-0.5 bg-teal-500 h-3 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        )}

        {/* SUGGESTED PILLS */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          {promptSuggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug.text)}
              className="inline-block px-3 py-1.5 bg-white hover:bg-slate-150 text-[10px] font-extrabold text-slate-700 rounded-full border border-slate-200 transition-all cursor-pointer"
            >
              {sug.label}
            </button>
          ))}
        </div>

        {/* INPUT SEND FORM BAR */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
          className="p-4 border-t border-slate-100 bg-white flex items-center gap-2.5 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={activeLanguage === 'EN' ? "Message Compass AI mentor..." : "കരിയർ കോമ്പസ്സ് ഉപദേഷ്ടാവിനോട് ചോദിക്കുക..."}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 transition-all text-slate-700 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
