import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Gen AI securely with environment variable key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Configure JSON body parsing
app.use(express.json());

// 1. AI Quiz Evaluation Endpoint
app.post("/api/ai/quiz-evaluation", async (req, res) => {
  try {
    const { profile, scores, recommendedStream } = req.body;

    if (!profile || !scores || !recommendedStream) {
      return res.status(400).json({ error: "Missing required profile, scores, or recommendedStream." });
    }

    const interestsStr = profile.interests && profile.interests.length > 0 
      ? profile.interests.join(", ") 
      : "General Academic Development";

    const prompt = `You are Kerala's leading high school career counsellor.
    Analyze the following student profile and aptitude quiz scores to provide a deeply personalized, highly engaging higher education and career roadmap.

    Student Profile:
    - Name: ${profile.name || "Student"}
    - Age: ${profile.age || "17"}
    - Current Grade/Class: ${profile.currentClass || "Plus One / Plus Two"}
    - Location (District in Kerala): ${profile.district || "Kerala"}
    - Stated Interests: ${interestsStr}

    Aptitude Quiz Scores (accumulated weights):
    - Science: ${scores.Science || 0}
    - Arts: ${scores.Arts || 0}
    - Commerce: ${scores.Commerce || 0}
    - Vocational: ${scores.Vocational || 0}

    Mathematical Recommendation: ${recommendedStream}

    Please generate a personalized analysis, a custom Kerala academic roadmap, high-demand careers, specific local courses in Kerala (focus on government/private colleges or entrance exams like KEAM, LBS, CAT), and practical advice. Use language that is warm, motivating, and specific to the Kerala context (e.g., DHSE Kerala boards, state universities like MG University, Kerala University, Calicut University, KTU, etc.).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { 
              type: Type.STRING, 
              description: "Engaging 2-3 paragraph personalized career counseling assessment of their scores and interests." 
            },
            keralaRoadmap: { 
              type: Type.STRING, 
              description: "A step-by-step higher education pathway inside Kerala (e.g., Plus Two stream choice, specific Bachelor/Diploma options, competitive entrance examinations like KEAM, LBS, CUSAT CAT, KAS, etc.)." 
            },
            hotCareers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 emerging high-paying career pathways ideal for this student profile."
            },
            localCourses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 popular courses or degree options in Kerala institutes matching their interests and district."
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 actionable skill-development tips they should start during school."
            }
          },
          required: ["analysis", "keralaRoadmap", "hotCareers", "localCourses", "tips"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    const evaluationData = JSON.parse(jsonText);
    res.json(evaluationData);
  } catch (error: any) {
    console.error("Error in /api/ai/quiz-evaluation:", error);
    res.status(500).json({ error: error.message || "Internal server error during AI evaluation." });
  }
});

// 2. AI Adaptive Quiz Questions Generator Endpoint
app.post("/api/ai/quiz-questions", async (req, res) => {
  try {
    const { interests, district, currentClass } = req.body;

    const interestsStr = interests && interests.length > 0 
      ? interests.join(", ") 
      : "general logic and reasoning";

    const prompt = `Create a custom 3-question career aptitude quiz specifically customized for a high school student in Kerala who is in grade "${currentClass || "Plus One"}" and is interested in "${interestsStr}".
    
    Each question must represent a highly creative real-life dilemma or practical scenario.
    For each question, provide 4 unique choices (A, B, C, D).
    Assign points/weights to each choice reflecting the 4 core streams in Kerala:
    1. "Science" (analytic, engineering, medical)
    2. "Arts" (creative, social sciences, humanities, law)
    3. "Commerce" (business, management, accountancy)
    4. "Vocational" (practical, technical skills, hospitality, hands-on trades)

    Return a clean JSON array containing exactly 3 custom question objects. Each object must strictly match the response schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER, description: "A sequential identifier starting from 11 (to append to the default 10 questions)" },
              text: { type: Type.STRING, description: "The scenario/question text, mentioning Kerala elements or practical daily choices." },
              choices: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Option text" },
                    weights: {
                      type: Type.OBJECT,
                      properties: {
                        Science: { type: Type.INTEGER, description: "Weight for Science stream (0 to 5)" },
                        Arts: { type: Type.INTEGER, description: "Weight for Arts stream (0 to 5)" },
                        Commerce: { type: Type.INTEGER, description: "Weight for Commerce stream (0 to 5)" },
                        Vocational: { type: Type.INTEGER, description: "Weight for Vocational stream (0 to 5)" }
                      },
                      required: ["Science", "Arts", "Commerce", "Vocational"]
                    }
                  },
                  required: ["text", "weights"]
                }
              }
            },
            required: ["id", "text", "choices"]
          }
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "[]";
    const questionsData = JSON.parse(jsonText);
    res.json(questionsData);
  } catch (error: any) {
    console.error("Error in /api/ai/quiz-questions:", error);
    res.status(500).json({ error: error.message || "Internal server error during question generation." });
  }
});

// 3. AI General Chat Coach Endpoint
app.post("/api/ai/general-chat", async (req, res) => {
  try {
    const { message, history, profile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const interestsStr = profile?.interests && profile.interests.length > 0 
      ? profile.interests.join(", ") 
      : "General Development";

    const systemInstruction = `You are "Compass AI", Kerala's premier interactive higher education and career mentor.
    The current student's name is ${profile?.name || "Student"}, aged ${profile?.age || "N/A"}, in class "${profile?.currentClass || "N/A"}" from ${profile?.district || "Kerala"}.
    Stated interests: ${interestsStr}.
    Your goal is to answer their career, college, course, scholarship, or study questions with extreme warmth and helpfulness.
    You MUST support BOTH English and Malayalam. If the student writes in Malayalam or asks for Malayalam, respond in Malayalam.
    If they ask about careers, colleges, scholarships, or competitive exams in Kerala (like KEAM, LBS, CAPS, K-DISC, ASAP, LBS, Poly allotments), provide highly specific, accurate local details. Keep responses structured, concise, and professional.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/general-chat:", error);
    res.status(500).json({ error: error.message || "Internal server error during chat processing." });
  }
});

// 4. AI Career Discovery Wizard Endpoint
app.post("/api/ai/discovery-wizard", async (req, res) => {
  try {
    const { wizardData } = req.body;

    if (!wizardData) {
      return res.status(400).json({ error: "Missing wizardData form values." });
    }

    const prompt = `You are "Compass AI Discovery Wizard".
    Generate a comprehensive, tailored higher-education discovery report for a student based on these inputs:
    - Current Class: ${wizardData.currentClass}
    - Interests: ${wizardData.interests}
    - Favorite Subjects: ${wizardData.subjects}
    - Custom Skills: ${wizardData.skills}
    - Budget Range (Fees): ${wizardData.budget}
    - Preferred District(s): ${wizardData.district}
    - Hostel Required: ${wizardData.hostel ? 'Yes' : 'No'}
    - Institution Type Preference: ${wizardData.prefType || 'Government / Aided'}

    Provide a highly realistic matched assessment containing:
    1. Best Stream (Arts, Science, Commerce, or Vocational) with reasons.
    2. Top 3 matched Degree/Diploma course suggestions.
    3. Top 3 matched career roles with expected salary.
    4. Top 3 colleges/universities in Kerala that match their district and budget.
    5. 2 suitable scholarship suggestions.
    6. A custom step-by-step sequential timeline roadmap (e.g., School -> Entrance Exam -> Degree/Polytechnic -> Internship -> Career).

    Return ONLY a JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bestStream: { type: Type.STRING, description: "Stream name (e.g. Science) and a brief justification." },
            courses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 customized degree or diploma courses in Kerala."
            },
            careers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 specific careers with salary expectation (e.g. 'Software Engineer in Infopark Kochi (INR 4L - 12L/yr)')."
            },
            colleges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 real, matching Kerala colleges/universities (e.g. College of Engineering Trivandrum, MG University)."
            },
            scholarships: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2 relevant scholarship schemes in Kerala they may qualify for."
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: "Phase title (e.g., Phase 1: Plus Two)" },
                  milestone: { type: Type.STRING, description: "Action step (e.g., Take KEAM Entrance Exam)" },
                  description: { type: Type.STRING, description: "Detailed strategy or advice." }
                },
                required: ["phase", "milestone", "description"]
              },
              description: "Step-by-step timeline milestone points."
            }
          },
          required: ["bestStream", "courses", "careers", "colleges", "scholarships", "roadmap"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("Error in /api/ai/discovery-wizard:", error);
    res.status(500).json({ error: error.message || "Internal server error during career discovery." });
  }
});

// 5. AI Scholarship Checker Endpoint
app.post("/api/ai/scholarship-check", async (req, res) => {
  try {
    const { income, marks, category, district } = req.body;

    const prompt = `You are a Kerala government scholarship coordinator.
    Find all matching scholarship and financial aid opportunities for a student with:
    - Annual Family Income: INR ${income || 'N/A'}
    - Academic Marks: ${marks || 'N/A'}%
    - Category: ${category || 'General'}
    - Home District: ${district || 'Kerala'}

    Recommend real, active state-level or national scholarships available to Kerala students (such as State Merit Scholarship, Post Matric Scholarship, Central Sector Scheme, CH Muhammed Koya Scholarship for girls, Single Girl Child, etc.).
    For each, state why they are eligible, maximum annual grant amount, and the online application website.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eligibilityScore: { type: Type.STRING, description: "Brief overview of their general eligibility chance (e.g. High, Medium, Low)." },
            matchedScholarships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Scholarship name (e.g. 'C.H. Muhammed Koya Scholarship')" },
                  benefit: { type: Type.STRING, description: "Annual financial aid amount (e.g. 'INR 10,000 per year')" },
                  eligibilityReason: { type: Type.STRING, description: "Why the student matches (e.g. 'Family income < 8 lakhs and marks > 50%')" },
                  website: { type: Type.STRING, description: "Official portal url (e.g. 'dcescholarship.kerala.gov.in')" }
                },
                required: ["name", "benefit", "eligibilityReason", "website"]
              }
            }
          },
          required: ["eligibilityScore", "matchedScholarships"]
        }
      }
    });

    const jsonText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("Error in /api/ai/scholarship-check:", error);
    res.status(500).json({ error: error.message || "Internal server error in scholarship checker." });
  }
});

// Start Node server & Mount Vite development server if not in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
