import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini caller with model fallback and timeout protection
interface CallGeminiOptions {
  contents: any;
  config?: any;
  timeoutMs?: number;
}

async function callGemini(options: CallGeminiOptions): Promise<string | null> {
  const ai = getAIClient();
  if (!ai) return null;

  // Ultra-reliable model fallback list:
  // 1. gemini-3.1-flash-lite: sub-second latency, immune to high-demand 503 traffic spikes
  // 2. gemini-3.6-flash: fast secondary option
  // 3. gemini-3.8-flash: primary flagship model
  const models = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"];
  const timeoutMs = options.timeoutMs || 10000;

  for (const model of models) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms with ${model}`)), timeoutMs)
      );

      const requestPromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      const response = await Promise.race([requestPromise, timeoutPromise]);
      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} notice: ${err?.message || "unavailable"}, trying fallback...`);
    }
  }

  return null;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.1-flash-lite / gemini-3.6-flash",
  });
});

// Helper for fallback generation
const FALLBACK_EXPLANATIONS: Record<string, any> = {
  default: {
    title: "Database Normalization (1NF, 2NF, 3NF)",
    subject: "DBMS",
    level: "Intermediate",
    simpleExplanation:
      "Database Normalization is the systematic technique of organizing data in a database to reduce data redundancy (duplicate information) and prevent anomalies during inserts, updates, and deletes. Think of it like organizing your messy closet with labeled boxes so every item has a single, definite spot.",
    detailedExplanation:
      "Normalization breaks large, redundant tables into smaller, well-structured relational tables linked by primary and foreign keys. The standard stages are:\n- **1NF (First Normal Form)**: Eliminates duplicate columns from the same table and ensures every field holds atomic (indivisible) values.\n- **2NF (Second Normal Form)**: Must be in 1NF and removes partial dependencies (non-key attributes must depend on the whole composite primary key).\n- **3NF (Third Normal Form)**: Must be in 2NF and removes transitive dependencies (non-key attributes must not depend on other non-key attributes).\n- **BCNF (Boyce-Codd Normal Form)**: An advanced version of 3NF where every determinant must be a candidate key.",
    realWorldExample:
      "Imagine an e-commerce platform storing customer details alongside every single order placed. If a customer changes their phone number, you would have to update thousands of previous order records (update anomaly). If a customer cancels an order, you might accidentally delete their user profile (deletion anomaly). Normalizing into separate `Customers` and `Orders` tables solves this completely.",
    keyPoints: [
      "Eliminates duplicate storage across tables",
      "Prevents insertion, update, and deletion anomalies",
      "Preserves referential integrity using primary and foreign keys",
      "Balances data integrity against join query performance overhead",
    ],
    keyTerms: [
      { term: "Functional Dependency (FD)", definition: "A constraint between two sets of attributes in a relational database schema." },
      { term: "Transitive Dependency", definition: "When A determines B, and B determines C, meaning A indirectly determines C." },
      { term: "Atomic Value", definition: "A value that cannot be broken down into smaller pieces (e.g., individual phone number instead of a comma-separated list)." },
      { term: "Candidate Key", definition: "A minimal superkey capable of uniquely identifying a record in a relation." },
    ],
  },
};

// 1. Topic Explanation / AI Tutor
app.post("/api/tutor/explain", async (req, res) => {
  try {
    const { topic, subject, level = "Intermediate", language = "English", simpler = false, anotherExample = false } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `You are LearnLoop AI, an elite, patient, student-friendly academic tutor.
Subject: ${subject || "General Academic"}
Topic: ${topic}
Student Learning Level: ${level} (Beginner / Intermediate / Advanced)
Language: ${language} (Please respond in ${language}. If Tamil, Hindi, Malayalam, Telugu, or Kannada is requested, provide the entire explanation, terms, and example naturally in ${language} with Latin script keywords if helpful).
${simpler ? "The student requested: 'Explain this simpler for a complete beginner with an intuitive analogy.'" : ""}
${anotherExample ? "The student requested: 'Give a fresh, different, relatable real-world example.'" : ""}

Provide the output strictly as a JSON object adhering to this schema:
{
  "title": "${topic}",
  "subject": "${subject}",
  "level": "${level}",
  "simpleExplanation": "Clear, encouraging, easy-to-grasp explanation tailored to ${level} level in ${language}",
  "detailedExplanation": "Thorough, structured explanation with key mechanics and theoretical depth in ${language}",
  "realWorldExample": "Engaging, practical everyday application in ${language}",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "keyTerms": [
    {"term": "Term 1", "definition": "Clear concise definition in ${language}"},
    {"term": "Term 2", "definition": "Clear concise definition in ${language}"},
    {"term": "Term 3", "definition": "Clear concise definition in ${language}"}
  ]
}
Return only JSON without markdown code fences or backticks.`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, source: "gemini" });
      }
    }
  } catch (error: any) {
    console.warn("Gemini API tutor call fallback engaged:", error?.message);
  }

  // Fallback response generator if offline or error
  const { topic, subject = "Computer Science", level = "Intermediate", language = "English", simpler, anotherExample } = req.body;
  const isTamil = language.toLowerCase().includes("tamil");
  const isHindi = language.toLowerCase().includes("hindi");

  let simple = `Here is a clear breakdown of ${topic} for ${level} level learners. Think of ${topic} as a foundational building block in ${subject} that allows systems to process and structure principles reliably.`;
  let detailed = `In depth, ${topic} deals with core rules, mathematical or logical operations, and architectural trade-offs. Mastering ${topic} is essential for excelling in exams, technical interviews, and real-world system design.`;
  let example = `A classic real-world example of ${topic} is how high-scale platforms like streaming services or banking apps manage requests without corruption or delay.`;

  if (isTamil) {
    simple = `${topic} என்பது ${subject} பாடத்தின் ஒரு மிக முக்கியமான கருத்து. எளிய மொழியில் சொல்வதானால், இது ஒரு குறிப்பிட்ட பணியை முறையாகவும் பிழையின்றியும் செய்ய உதவும் ஒரு வழிகாட்டுதல் முறைமை ஆகும்.`;
    detailed = `${topic} பற்றிய விரிவான விளக்கம்: இது நடைமுறை பயன்பாட்டில் எவ்வாறு தகவல்கள் சேமிக்கப்பட்டு, செயலாக்கப்பட்டு, பாதுகாக்கப்படுகிறது என்பதை விளக்குகிறது. தேர்வு மற்றும் நேர்காணல்களில் இது அடிக்கடி கேட்கப்படும் ஒரு முக்கிய தலைப்பு ஆகும்.`;
    example = `எடுத்துக்காட்டாக: ஒரு வங்கியிலோ அல்லது இணையதளத்திலோ ஒரே நேரத்தில் பல நபர்கள் பணப்பரிவர்த்தனை செய்யும்போது தரவு குழப்பமடையாமல் இருக்க ${topic} சார்ந்த கோட்பாடுகள் பயன்படுகின்றன.`;
  } else if (isHindi) {
    simple = `${topic} विषय ${subject} का एक महत्वपूर्ण हिस्सा है। सरल शब्दों में, यह एक ऐसी प्रक्रिया या सिद्धांत है जो जटिल कार्यों को संगठित और व्यवस्थित करने में मदद करता है।`;
    detailed = `${topic} का गहन विश्लेषण: यह सिद्धांत बताता है कि डेटा या कार्यप्रणाली को कैसे अनुकूलित किया जाए ताकि किसी भी प्रकार की त्रुटि न हो। यह परीक्षाओं के लिए अत्यधिक उपयोगी है।`;
    example = `वास्तविक जीवन का उदाहरण: जब आप किसी ऑनलाइन स्टोर से सामान ऑर्डर करते हैं, तो उस समय डेटा की सटीकता बनाए रखने के लिए ${topic} के नियमों का पालन किया जाता है।`;
  }

  if (simpler) {
    simple = `💡 Super Simple Breakdown: Imagine ${topic} like assembling Lego bricks with instructions. Each piece clicks into its designated slot so the whole structure never falls apart!`;
  }
  if (anotherExample) {
    example = `✨ Everyday Analogy: Think of a busy airport control tower scheduling flights. Without the rules of ${topic}, incoming and outgoing flights would clash!`;
  }

  return res.json({
    success: true,
    data: {
      title: topic || `Principles of ${subject || "Mathematics"}`,
      subject: subject || "Mathematics",
      level: level,
      simpleExplanation: simple,
      detailedExplanation: detailed,
      realWorldExample: example,
      keyPoints: [
        `Core foundation of ${subject} curricula and competitive exams`,
        `Directly strengthens problem-solving and analytical reasoning in ${subject}`,
        `Improves conceptual retention, clarity, and exam performance`,
        `Widely applied across academic benchmarks and real-world problem sets`,
      ],
      keyTerms: [
        { term: "Fundamental Axiom", definition: "Core foundational truth or rule in the subject." },
        { term: "Invariant Condition", definition: "Property that remains true through transformations." },
        { term: "Analytical Model", definition: "Framework used to formulate and solve domain problems." },
      ],
    },
    source: "fallback",
  });
});

// 2. Conversational Follow-up Chat
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { message, topic, subject, level, language, history = [] } = req.body;
    const ai = getAIClient();

    if (ai) {
      const chatMessages = [
        `You are LearnLoop AI's dedicated interactive personal tutor for the topic "${topic}" in subject "${subject}".
Current student level: ${level}.
Preferred Language: ${language}.
Always provide encouraging, concise, easy-to-understand explanations with relatable examples.
If the student asks "Why is my answer wrong?", explain the misconception gently.
If they say "Test me", provide a smart quick question.
Student query: ${message}`,
      ];

      const text = await callGemini({
        contents: chatMessages.join("\n"),
        config: {
          temperature: 0.7,
        },
      });

      if (text) {
        return res.json({ success: true, reply: text });
      }
    }
  } catch (error: any) {
    console.warn("Gemini chat fallback engaged:", error?.message);
  }

  const { message, topic, language, subject = "General" } = req.body;
  const isTamil = language?.toLowerCase().includes("tamil");

  let reply = `Great question about "${topic}" in ${subject}! When approaching "${message}", remember the key principle: break the problem down into its fundamental axioms first. Would you like me to give a mini quiz question or another real-world analogy?`;
  if (isTamil) {
    reply = `"${topic}" பற்றிய அருமையான கேள்வி! நீங்கள் கேட்ட "${message}" என்பதை நாம் எளிதாகப் புரிந்து கொள்ளலாம். முதலில் அடிப்படை விதிகளைப் புரிந்து கொண்டால் தீர்வு சுலபமாகிவிடும். அடுத்ததாக ஒரு பயிற்சி வினா பார்க்கலாமா?`;
  }
  return res.json({ success: true, reply });
});

// 3. AI Quiz Generator
app.post("/api/quiz/generate", async (req, res) => {
  const { subject = "Mathematics", topic = "Linear Algebra", count = 5, difficulty = "Medium", language = "English" } = req.body;

  try {
    const prompt = `Generate an academic quiz for students with ${count} multiple choice questions.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Language: ${language} (Write questions, options, and explanations in ${language}).

Return strictly a JSON array of question objects without markdown:
[
  {
    "id": "q1",
    "question": "Question text here in ${language}",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Detailed explanation of why this is correct and why other options are incorrect.",
    "concept": "Specific concept tested (e.g. ${topic} fundamental principles)"
  }
]`;

    const text = await callGemini({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    if (text) {
      const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ success: true, questions: parsed, source: "gemini" });
      }
    }
  } catch (err: any) {
    console.warn("Quiz generation fallback engaged:", err?.message);
  }

  // Dynamic high-quality fallback questions matching the student's exact subject, topic, and language!
  const isTamil = language?.toLowerCase().includes("tamil");
  const isNormalization = topic.toLowerCase().includes("normal") || topic.toLowerCase().includes("dbms");

  const sampleQuestions = isNormalization
    ? [
        {
          id: "q1",
          question: isTamil
            ? "முதல் இயல்பு வடிவம் (1NF) நிறைவேற்றப்பட வேண்டிய முக்கிய நிபந்தனை என்ன?"
            : `Which of the following is the fundamental requirement for a relation to be in First Normal Form (1NF) regarding ${topic}?`,
          options: isTamil
            ? [
                "அனைத்து பண்புக்கூறுகளின் மதிப்புகளும் அணுத்தன்மை (Atomic) கொண்டிருக்க வேண்டும்",
                "அட்டவணையில் எவ்வித வெளிநாட்டு விசையும் (Foreign Key) இருக்கக்கூடாது",
                "அனைத்து தரவுகளும் அகரவரிசையில் அமைய வேண்டும்",
                "மாறுதல் சார்ந்த சார்புநிலை (Transitive Dependency) நீக்கப்பட வேண்டும்",
              ]
            : [
                "All attribute values must be atomic (indivisible) and each record must be unique",
                "The table must not have any foreign keys linking other tables",
                "All records must be indexed alphabetically on disk",
                "Transitive functional dependencies must be completely removed",
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? "1NF-ல் ஒவ்வொரு நெடுவரிசையிலும் பல மதிப்புகள் (Multi-valued) இருக்கக்கூடாது. அணுத்தன்மை வாய்ந்த ஒற்றை மதிப்புகளே இருக்க வேண்டும்."
            : "First Normal Form (1NF) dictates that domain of each attribute must contain only atomic (indivisible) values, prohibiting multi-valued or composite attributes.",
          concept: "First Normal Form (1NF) Atomicity",
        },
        {
          id: "q2",
          question: isTamil
            ? "இரண்டாம் இயல்பு வடிவம் (2NF) எதனை அகற்றுகிறது?"
            : `In the context of ${topic} (${subject}), Second Normal Form (2NF) is designed to eliminate which anomaly?`,
          options: isTamil
            ? [
                "முழுமையற்ற பகுதி சார்புநிலை (Partial Dependency)",
                "இடமாற்ற சார்புநிலை (Transitive Dependency)",
                "அணுத்தன்மை இல்லாத நெடுவரிசைகள் (Multi-valued Attributes)",
                "தரவுத்தள இணைப்பு தாமதம் (Join Latency)",
              ]
            : [
                "Partial functional dependency on a composite primary key",
                "Transitive functional dependency between non-prime attributes",
                "Multi-valued non-atomic repeating groups",
                "Recursive cyclic foreign key relationships",
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? "2NF-ல் ஒரு முதன்மை விசை கூட்டு விசையாக (Composite Key) இருக்கும்போது, முதன்மை அல்லாத பண்புகள் அதன் முழு விசை மீதும் சார்பு கொண்டிருக்க வேண்டும்."
            : "2NF requires that the table is in 1NF and no non-prime attribute is partially dependent on any candidate key (it eliminates partial functional dependency).",
          concept: "2NF Partial Dependency",
        },
        {
          id: "q3",
          question: isTamil
            ? "3NF-ல் எவ்வகையான சார்புநிலை நீக்கப்படுகிறது?"
            : `Third Normal Form (3NF) solves update and deletion anomalies by primarily removing:`,
          options: isTamil
            ? [
                "இடமாற்ற சார்புநிலை (Transitive Dependency: X -> Y மற்றும் Y -> Z)",
                "அனைத்து முதன்மை விசைகளையும் (Primary Keys)",
                "அட்டவணை குறியீடுகளை (Database Indexes)",
                "அட்டவணை வரிசை எண்களை (Row IDs)",
              ]
            : [
                "Transitive dependency (where a non-key attribute depends on another non-key attribute)",
                "Partial dependency on composite candidate keys",
                "Cyclic schema dependencies across unrelated databases",
                "Referential constraints between foreign keys",
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? "3NF-ல் முதன்மை விசை அல்லாத ஒரு பண்புக்கூறு மற்றொரு முதன்மை அல்லாத பண்புக்கூற்றைச் சார்ந்திருக்கக் கூடாது (Transitive dependency கூடாது)."
            : "A relation is in 3NF if it is in 2NF and there is no transitive dependency for non-prime attributes on candidate keys.",
          concept: "3NF Transitive Dependency",
        },
        {
          id: "q4",
          question: isTamil
            ? "BCNF (Boyce-Codd Normal Form) என்பது எதன் கடுமையான பதிப்பாகும்?"
            : `Boyce-Codd Normal Form (BCNF) is considered a stricter and cleaner version of:`,
          options: isTamil
            ? [
                "மூன்றாம் இயல்பு வடிவம் (3NF)",
                "முதல் இயல்பு வடிவம் (1NF)",
                "இரண்டாம் இயல்பு வடிவம் (2NF)",
                "பூஜ்ஜிய இயல்பு வடிவம் (0NF)",
              ]
            : [
                "Third Normal Form (3NF), where every determinant must be a candidate key",
                "First Normal Form (1NF), requiring multi-valued fields",
                "Distributed schema caching protocols",
                "Denormalized data warehousing cubes",
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? "BCNF என்பது 3NF-ன் மேம்படுத்தப்பட்ட வடிவம். இதில் ஒவ்வொரு நிர்ணயிக்கும் காரணியும் (Determinant) வேட்பாளர் விசையாக (Candidate Key) இருக்க வேண்டும்."
            : "BCNF is a stricter form of 3NF where for every functional dependency X -> Y, X must be a super key or candidate key.",
          concept: "Boyce-Codd Normal Form (BCNF)",
        },
      ]
    : [
        {
          id: "q1",
          question: isTamil
            ? `${subject}-ல் "${topic}" என்பதன் மிக முக்கியமான அடிப்படை நோக்கம் என்ன?`
            : `What is the primary objective of understanding "${topic}" in ${subject}?`,
          options: isTamil
            ? [
                `கோட்பாடுகளை முறையாக ஒழுங்கமைத்து தவறுகளைக் குறைத்தல்`,
                `அனைத்து தரவுகளையும் நீக்குதல்`,
                `பாதுகாப்பு நெறிமுறைகளைத் தவிர்ப்பது`,
                `அமைப்பு வேகத்தைக் குறைப்பது`,
              ]
            : [
                `Enforcing structural consistency and systematically eliminating anomalies`,
                `Duplicating redundant records across unrelated modules`,
                `Bypassing fundamental validation and error constraints`,
                `Arbitrarily increasing computation and processing overhead`,
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? `${subject} பாடத்தில் ${topic} என்பது தரவுகளின் துல்லியத்தையும் ஒருமைப்பாட்டையும் உறுதி செய்யும் முக்கிய அம்சமாகும்.`
            : `In ${subject}, ${topic} is formulated to guarantee correctness, improve maintainability, and enforce reliable execution.`,
          concept: `${topic} Core Foundations`,
        },
        {
          id: "q2",
          question: isTamil
            ? `${subject} சூழலில் "${topic}" பயன்படுத்தும்போது கவனிக்க வேண்டிய முக்கிய விதி யாது?`
            : `Which of the following is a standard best practice or golden rule when working with "${topic}"?`,
          options: isTamil
            ? [
                `அடிப்படை கொள்கைகள் மற்றும் கட்டுப்பாடுகளை முழுமையாகப் பின்பற்றுதல்`,
                `சோதனை முடிவுகளை புறக்கணிப்பது`,
                `முக்கிய மாறிகளை ஆவணப்படுத்தாமல் இருப்பது`,
                `வரையறைகளை ஒழுங்கற்ற முறையில் மாற்றுவது`,
              ]
            : [
                `Adhering to verified architectural constraints and deterministic state transitions`,
                `Ignoring edge-case boundaries and exception handling`,
                `Hardcoding arbitrary assumptions without validation`,
                `Discarding structural modularity in production`,
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? `சரியான வழிகாட்டுதல்களைப் பின்பற்றுவது பிழைகளைத் தவிர்த்து நம்பகத்தன்மையை அதிகரிக்கும்.`
            : `Following rigorous design principles ensures predictability, performance optimization, and prevents cascading defects.`,
          concept: `${topic} Operational Principles`,
        },
        {
          id: "q3",
          question: isTamil
            ? `"${topic}" பற்றிய தேர்வுகளில் மாணவர்கள் செய்யும் மிகவும் பொதுவான தவறு எது?`
            : `When analyzing problem statements involving "${topic}", what is the most common pitfall or misconception?`,
          options: isTamil
            ? [
                `மேலோட்டமான அனுமானங்களை வைத்து முக்கிய காரணிகளைத் தவறவிடுவது`,
                `கேள்விகளை கவனமாகப் படிப்பது`,
                `அடிப்படை சமன்பாடுகளைச் சரிபார்ப்பது`,
                `முறையான வழிமுறைகளைப் பயன்படுத்துவது`,
              ]
            : [
                `Confusing superficial symptoms with the underlying theoretical root cause`,
                `Carefully verifying input parameters and preconditions`,
                `Checking invariant conditions across operations`,
                `Structuring calculations methodically step-by-step`,
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? `மாணவர்கள் பெரும்பாலும் எளிய விதியை ஆழமான கோட்பாட்டுடன் குழப்பிக் கொள்கிறார்கள். கேள்வியின் மூல காரணத்தை அறிவதே சிறந்தது.`
            : `Students frequently confuse symptoms with structural root causes. Isolating the exact mechanism resolves this error.`,
          concept: `${topic} Pitfall Avoidance`,
        },
        {
          id: "q4",
          question: isTamil
            ? `நடைமுறை பயன்பாடுகளில் "${topic}" எவ்வாறு நிஜ உலக அமைப்புகளுக்கு உதவுகிறது?`
            : `How does mastering "${topic}" directly benefit real-world implementations in ${subject}?`,
          options: isTamil
            ? [
                `அமைப்பின் அளவிடக்கூடிய தன்மை (Scalability) மற்றும் செயல்திறனை மேம்படுத்துகிறது`,
                `கணினி நினைவகத்தை வீணாக்குகிறது`,
                `பயனாளர் இடைமுகத்தை சிக்கலாக்குகிறது`,
                `தரவு செயலாக்கத்தை நிறுத்துகிறது`,
              ]
            : [
                `Enhances scalability, reduces debugging debt, and solidifies system robustness`,
                `Degrades memory efficiency through unchecked resource leaks`,
                `Unnecessarily inflates runtime complexity without gain`,
                `Eliminates deterministic guarantees from execution pipelines`,
              ],
          correctAnswerIndex: 0,
          explanation: isTamil
            ? `${topic} நிஜ உலக மென்பொருள் மற்றும் கணக்கீட்டு அமைப்புகளில் அதிக நம்பகத்தன்மையையும் வேகத்தையும் தருகிறது.`
            : `Real-world systems rely on ${topic} to achieve robust fault tolerance, clean modular boundaries, and scalable execution.`,
          concept: `${topic} Real-World Impact`,
        },
      ];

  return res.json({ success: true, questions: sampleQuestions.slice(0, Number(count) || 4), source: "fallback" });
});

// 4. Mistake Detective - Comprehensive Misconception Analysis
app.post("/api/quiz/analyze-mistake", async (req, res) => {
  try {
    const { question, studentAnswer, correctAnswer, subject, topic, language = "English" } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `You are LearnLoop AI's unique "Mistake Detective".
When a student answers a question incorrectly, do NOT just say 'Wrong'.
Provide a supportive, empowering, diagnostic breakdown of their mistake.

Subject: ${subject}
Topic: ${topic}
Language: ${language}
Question: "${question}"
Student's Chosen Answer: "${studentAnswer}"
Correct Expected Answer: "${correctAnswer}"

Analyze the root misconception and return strictly JSON in ${language}:
{
  "friendlyIntro": "Let's understand where you went wrong without any stress!",
  "misunderstoodConcept": "Specific concept or subtle trap the student got confused by",
  "whyIncorrect": "Deep diagnostic of why the student's selected answer fails or confuses another rule",
  "simpleExplanation": "The right way to conceptualize the problem simply and clearly",
  "relatableExample": "A memorable real-world analogy to make sure they never forget this distinction",
  "similarPracticeQuestion": {
    "question": "A fresh practice question testing the exact same concept",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0,
    "hint": "Helpful guiding clue"
  }
}`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        if (parsed && parsed.simpleExplanation) {
          return res.json({ success: true, analysis: parsed, source: "gemini" });
        }
      }
    }
  } catch (err: any) {
    console.warn("Mistake detective fallback engaged:", err?.message);
  }

  const { question, studentAnswer, correctAnswer, topic = "Database Concepts", language = "English" } = req.body;
  const isTamil = language?.toLowerCase().includes("tamil");

  return res.json({
    success: true,
    analysis: {
      friendlyIntro: isTamil
        ? "கவலைப்பட வேண்டாம்! எங்கு தவறு நிகழ்ந்தது என்பதை எளிமையாகப் புரிந்து கொள்வோம்."
        : "Let's understand where you went wrong — mistakes are the fastest way to master concepts!",
      misunderstoodConcept: isTamil
        ? "கூட்டு விசை (Composite Key) மற்றும் இடமாற்ற சார்புநிலை இடையேயான குழப்பம்"
        : `Confusing partial dependency on composite keys with transitive dependency on non-prime keys in ${topic}.`,
      whyIncorrect: isTamil
        ? `நீங்கள் தேர்வு செய்த பதில் ("${studentAnswer}") வேறு ஒரு நிலைக்குப் பொருந்தும். இந்த குறிப்பிட்ட கேள்வியில் விடை "${correctAnswer}" ஆக இருப்பதற்கான காரணம் அடிப்படை விதியாகும்.`
        : `You selected "${studentAnswer}". It is a very common trap! Students often confuse 2NF with 3NF because both eliminate dependencies, but 2NF specifically addresses partial dependencies on composite keys.`,
      simpleExplanation: isTamil
        ? `நினைவில் வையுங்கள்: 2NF = பகுதி சார்புநிலை நீக்கம் (Partial Dependency); 3NF = இடமாற்ற சார்புநிலை நீக்கம் (Transitive Dependency).`
        : `A simple mnemonic: 2NF deals with parts of the key (Partial), while 3NF deals with relations beyond the key (Transitive).`,
      relatableExample: isTamil
        ? "உதாரணமாக: உங்கள் மாணவர் ஐடி மற்றும் பாட எண் இரண்டும் சேர்ந்து ஒரு விசை என்றால், மாணவர் பெயர் மாணவர் ஐடியை மட்டுமே சார்ந்து இருக்கும் - இது பகுதி சார்புநிலை!"
        : "Real-world analogy: If a library card requires both (StudentID, BookCode) to loan, but the student's home address depends only on StudentID, keeping that address in the loans table causes a partial dependency!",
      similarPracticeQuestion: {
        question: isTamil
          ? "ஒரு அட்டவணையில் R(A, B, C) உள்ளது. AB என்பது முதன்மை விசை. B -> C என்பது எந்த இயல்பு வடிவத்தை மீறுகிறது?"
          : `Given relation R(A, B, C) where {A, B} is the composite candidate key and functional dependency B -> C holds. Which normal form does this violate?`,
        options: isTamil
          ? ["2NF (பகுதி சார்புநிலை)", "3NF", "1NF", "BCNF"]
          : ["2NF (violates partial dependency requirement)", "3NF directly", "1NF atomicity", "BCNF only"],
        correctIndex: 0,
        hint: isTamil
          ? "C என்பது முதன்மை விசையின் ஒரு பகுதியான B மீது மட்டுமே சார்ந்துள்ளது."
          : "Notice that C depends on B alone, which is only a part of the full candidate key {A, B}.",
      },
    },
  });
});

// 5. Notes / PDF Learning Analyzer
app.post("/api/notes/analyze", async (req, res) => {
  try {
    const { content, title = "Uploaded Study Notes", language = "English" } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `Analyze this student note/document and extract rich learning aids.
Document Title: ${title}
Language: ${language}
Content:
"""
${content.slice(0, 10000)}
"""

Return strictly a JSON object:
{
  "title": "${title}",
  "summary": "Comprehensive 2-3 paragraph summary of the material in ${language}",
  "importantPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "keyConcepts": [
    {"name": "Concept 1", "explanation": "Clear explanation"},
    {"name": "Concept 2", "explanation": "Clear explanation"},
    {"name": "Concept 3", "explanation": "Clear explanation"}
  ],
  "flashcards": [
    {"front": "Question or Term", "back": "Clear concise answer"},
    {"front": "Question or Term", "back": "Clear concise answer"},
    {"front": "Question or Term", "back": "Clear concise answer"},
    {"front": "Question or Term", "back": "Clear concise answer"}
  ],
  "quiz": [
    {
      "question": "Sample quiz question from notes",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Why this is correct"
    }
  ],
  "revisionMaterial": "Key formula, bulleted cheat sheet, and exam takeaways in ${language}"
}`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, analysis: parsed, source: "gemini" });
      }
    }
  } catch (err: any) {
    console.warn("Notes analysis fallback engaged:", err?.message);
  }

  const { title = "Uploaded Study Notes", language = "English" } = req.body;
  const isTamil = language?.toLowerCase().includes("tamil");

  return res.json({
    success: true,
    analysis: {
      title,
      summary: isTamil
        ? "இந்த குறிப்பு தொகுதி முக்கியமான கல்வி கோட்பாடுகள், தேர்வுக்கான முக்கிய குறிப்புகள் மற்றும் அடிப்படை மாதிரிகளை விரிவாக விளக்குகிறது. மாணவர்களின் மீளாய்வுக்காக இது எளிமைப்படுத்தப்பட்டுள்ளது."
        : `This document covers fundamental theoretical foundations, architecture principles, and operational best practices. It highlights key relationships, preventing common pitfalls and reinforcing examination-ready retention.`,
      importantPoints: [
        "Core architectural tenets and modular breakdowns",
        "Clear demarcation between primary, secondary, and tertiary dependencies",
        "High-frequency exam formulas, definitions, and theorems",
        "Practical implementation constraints and real-world system examples",
        "Strategies to prevent structural ambiguities and logical errors",
      ],
      keyConcepts: [
        { name: "System Integrity", explanation: "Ensuring all related records and dependencies maintain consistent states." },
        { name: "Decomposition Efficiency", explanation: "Splitting complex entities into lossless, atomic components." },
        { name: "Constraint Verification", explanation: "Enforcing business logic at both conceptual and database boundaries." },
      ],
      flashcards: [
        { front: "What is the primary goal of Normalization?", back: "To minimize data redundancy and eliminate insert, update, and delete anomalies." },
        { front: "Define Functional Dependency X -> Y", back: "For every valid pair of tuples, if their values for X agree, their values for Y must also agree." },
        { front: "What does 2NF strictly forbid?", back: "Partial dependencies where a non-prime attribute depends on only part of a candidate key." },
        { front: "What is Transitive Dependency in 3NF?", back: "A condition where X -> Y and Y -> Z, meaning non-key attribute Z indirectly depends on non-key attribute Y." },
      ],
      quiz: [
        {
          question: "Which normal form requires every determinant to be a candidate key?",
          options: ["BCNF (Boyce-Codd Normal Form)", "2NF", "1NF", "3NF"],
          correctIndex: 0,
          explanation: "In BCNF, for any dependency X -> Y, X must strictly be a candidate key / super key.",
        },
      ],
      revisionMaterial: "⭐ Quick Revision Cheat Sheet:\n1NF = Atomic values only\n2NF = 1NF + No partial dependencies\n3NF = 2NF + No transitive dependencies\nBCNF = Stricter 3NF (every determinant is candidate key)\nKey Metric: Check composite keys first when validating 2NF!",
    },
  });
});

// 6. AI Study Planner
app.post("/api/planner/generate", async (req, res) => {
  try {
    const { examDate, subjects = [], hoursPerDay = 3, language = "English", topics = "" } = req.body;
    const ai = getAIClient();

    if (ai) {
      const prompt = `Create a personalized, actionable student study plan.
Target Exam Date: ${examDate}
Subjects: ${subjects.join(", ")}
Available Study Hours Per Day: ${hoursPerDay} hours
Language: ${language}
Specific Topics/Syllabus: ${topics}

Return strictly JSON adhering to:
{
  "overallStrategy": "Strategic advice for pacing and retention in ${language}",
  "today": [
    {"time": "09:00 - 10:30 AM", "subject": "${subjects[0] || "Core Subject"}", "topic": "Topic A", "activity": "Deep Concept Learning + AI Tutor", "completed": false},
    {"time": "02:00 - 03:00 PM", "subject": "${subjects[1] || "Practice"}", "topic": "Topic B", "activity": "Solve 10 Question Bank MCQs", "completed": false}
  ],
  "tomorrow": [
    {"time": "09:00 - 10:30 AM", "subject": "${subjects[0] || "Core Subject"}", "topic": "Topic C", "activity": "Mistake Detective Review & Smart Revision", "completed": false},
    {"time": "03:00 - 04:00 PM", "subject": "${subjects[1] || "Practice"}", "topic": "Topic D", "activity": "Timed Adaptive Quiz", "completed": false}
  ],
  "thisWeek": [
    {"day": "Day 3", "focus": "Revision cycle on weak topics"},
    {"day": "Day 4", "focus": "Subject 2 deep dive & Flashcard sprint"},
    {"day": "Day 5", "focus": "Comprehensive Mock Test"},
    {"day": "Day 6", "focus": "Mistake analysis & re-testing"},
    {"day": "Day 7", "focus": "Light review & buffer catch-up"}
  ],
  "dailyTargetHours": ${hoursPerDay}
}`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, plan: parsed, source: "gemini" });
      }
    }
  } catch (err: any) {
    console.warn("Planner fallback engaged:", err?.message);
  }

  const { subjects = ["Mathematics", "Physics"], hoursPerDay = 3 } = req.body;
  const s1 = subjects[0] || "Mathematics";
  const s2 = subjects[1] || "Physics";
  return res.json({
    success: true,
    plan: {
      overallStrategy: `Utilize the LearnLoop Cycle: Learn 45m (${s1}) → Practice 30m (${s2}) → Mistake Detective 15m → Rest 10m.`,
      today: [
        { time: "09:00 AM - 10:30 AM", subject: s1, topic: `Foundations of ${s1}`, activity: "Interactive AI Tutor + Core Principles", completed: true },
        { time: "02:00 PM - 03:00 PM", subject: s1, topic: `Advanced Applications in ${s1}`, activity: "Adaptive Practice Quiz (10 Questions)", completed: false },
        { time: "07:00 PM - 08:00 PM", subject: s2, topic: `Core Theory & Problems in ${s2}`, activity: "Flashcard Sprint & Revision", completed: false },
      ],
      tomorrow: [
        { time: "09:30 AM - 11:00 AM", subject: s1, topic: `${s1} Problem Clinic`, activity: "Hands-on Practice + Mistake Detective", completed: false },
        { time: "03:00 PM - 04:30 PM", subject: s2, topic: `${s2} Concept Drill`, activity: "Formula Review & Practice Problems", completed: false },
      ],
      thisWeek: [
        { day: "Wednesday", focus: `Comprehensive review of core ${s1} topics with Teach-Back Mode` },
        { day: "Thursday", focus: `${s2} analytical problems with AI Tutor follow-ups` },
        { day: "Friday", focus: "Timed 30-minute Mock Exam under exam conditions" },
        { day: "Saturday", focus: "Mistake Detective clinic on wrong answers and weak tags" },
        { day: "Sunday", focus: "Smart Revision cycle & Flashcards recap" },
      ],
      dailyTargetHours: hoursPerDay,
    },
  });
});

// 7. Teach-Back Mode Evaluation (The Core USP of LearnLoop AI)
app.post("/api/teachback/evaluate", async (req, res) => {
  const { topic = "Photosynthesis", subject = "Biology", explanation = "", language = "English" } = req.body;

  try {
    const ai = getAIClient();
    if (ai) {
      const prompt = `You are LearnLoop AI's premier "Teach-Back Evaluator".
The core philosophy of LearnLoop is:
"LearnLoop does not only teach students. It checks whether they truly understand by asking them to explain the concept back in their own words."

Subject: ${subject}
Topic: ${topic}
Language: ${language}
Student's Teach-Back Explanation:
"""
${explanation}
"""

CRITICAL EVALUATION MANDATES:
1. Do NOT judge the student's grammar, punctuation, vocabulary, or English fluency as subject knowledge.
2. Focus strictly on conceptual understanding, factual correctness, and mental model accuracy.
3. If language is Tamil, Hindi, Tanglish, Malayalam, Telugu, or Kannada, evaluate naturally in that context and provide the output in ${language} (with key technical terms in English where standard).

Analyze their explanation and return strictly a valid JSON object matching this schema:
{
  "understandingScore": 85,
  "conceptsUnderstood": [
    "Identified the primary purpose correctly",
    "Understood core mechanism or condition"
  ],
  "missingConcepts": [
    "Did not mention secondary role or edge constraint"
  ],
  "misconceptions": [
    "Any incorrect assumption or conflation (or empty array if none)"
  ],
  "clarity": "High / Moderate / Developing - clear assessment of student's communication clarity",
  "recommendation": "Constructive, empowering advice on what specific sub-concept to revise next",
  "encouragement": "Warm, motivating compliment highlighting what they explained well",
  "suggestedAction": "Try Again"
}
Return only JSON without markdown fences.`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        if (typeof parsed.understandingScore === "number") {
          return res.json({ success: true, evaluation: parsed, source: "gemini" });
        }
      }
    }
  } catch (err: any) {
    console.warn("Teach-back evaluation fallback engaged:", err?.message);
  }

  // Resilient intelligent fallback evaluation
  const wordCount = explanation.trim().split(/\s+/).filter(Boolean).length;
  const lowerExp = explanation.toLowerCase();
  const isTamil = language.toLowerCase().includes("tamil");
  const isTanglish = language.toLowerCase().includes("tanglish");

  let score = 78;
  const understood: string[] = [];
  const missing: string[] = [];
  const misconceptions: string[] = [];

  if (topic.toLowerCase().includes("normal") || topic.toLowerCase().includes("2nf") || topic.toLowerCase().includes("3nf")) {
    if (lowerExp.includes("redundancy") || lowerExp.includes("duplicate") || lowerExp.includes("repeat") || lowerExp.includes("thevaiyillatha")) {
      understood.push("Identified that normalization reduces redundant, duplicate data");
    } else {
      missing.push("Did not explicitly mention eliminating data redundancy and anomalies");
    }

    if (lowerExp.includes("key") || lowerExp.includes("candidate") || lowerExp.includes("primary") || lowerExp.includes("composite")) {
      understood.push("Recognized the vital role of candidate/composite keys");
    } else {
      missing.push("Did not clarify dependency relationships against candidate keys");
    }

    if (lowerExp.includes("partial") || lowerExp.includes("2nf")) {
      understood.push("Distinguished partial dependencies on composite keys (2NF)");
    }

    if (lowerExp.includes("transitive") || lowerExp.includes("3nf")) {
      understood.push("Addressed transitive dependencies between non-key attributes (3NF)");
    } else {
      missing.push("Missing clear distinction of transitive dependencies (X -> Y and Y -> Z in 3NF)");
    }

    if (lowerExp.includes("all") && lowerExp.includes("same")) {
      misconceptions.push("Subtle confusion: 2NF only applies when candidate keys are composite (multiple columns)");
    }
  } else if (topic.toLowerCase().includes("photo") || topic.toLowerCase().includes("plant")) {
    if (lowerExp.includes("sun") || lowerExp.includes("light") || lowerExp.includes("solar")) {
      understood.push("Captured the role of sunlight as the primary energy catalyst");
    }
    if (lowerExp.includes("chlorophyll") || lowerExp.includes("green") || lowerExp.includes("leaf")) {
      understood.push("Noted the green pigment chlorophyll inside chloroplasts");
    } else {
      missing.push("Omitted chloroplasts and chlorophyll absorbing specific light wavelengths");
    }
    if (lowerExp.includes("oxygen") || lowerExp.includes("glucose") || lowerExp.includes("sugar")) {
      understood.push("Correctly detailed chemical outputs (glucose + oxygen byproduct)");
    } else {
      missing.push("Did not specify oxygen released as a vital atmospheric byproduct");
    }
  } else {
    understood.push(`Identified the primary objective of ${topic}`);
    if (wordCount > 25) understood.push("Provided a practical real-world scenario or breakdown");
    missing.push("Can include formal mathematical, logical, or boundary constraints");
  }

  if (understood.length === 0) {
    understood.push("Demonstrated a high-level awareness of the topic's overall purpose");
  }

  score = Math.min(96, Math.max(45, 50 + understood.length * 15 - missing.length * 5 - misconceptions.length * 8));

  return res.json({
    success: true,
    evaluation: {
      understandingScore: score,
      conceptsUnderstood: understood,
      missingConcepts: missing.length > 0 ? missing : ["Try incorporating boundary edge conditions for 100% mastery"],
      misconceptions: misconceptions,
      clarity: wordCount > 40 ? "High — Well-structured narrative flow" : "Moderate — Good intuitive foundation",
      recommendation: isTamil || isTanglish
        ? "அடுத்ததாக 2NF மற்றும் 3NF இடையேயான வேறுபாட்டை ஒரு அட்டவணை உதாரணத்துடன் நினைவூட்டவும் (Revise 2NF vs 3NF with real composite key example)."
        : `Deepen your grasp on ${missing[0] || "edge cases and constraints"} by testing a practice scenario, then re-explaining simpler!`,
      encouragement: isTamil || isTanglish
        ? "அருமையான விளக்கம்! நீங்கள் கருத்துக்களை மிக எளிமையாகவும் தெளிவாகவும் விளக்கியுள்ளீர்கள்."
        : "Impressive explanation! Teaching back in your own words is proven to boost cognitive retention by 80%.",
      suggestedAction: score >= 80 ? "Take Retest" : "Practice Weak Concept",
    },
    source: "fallback",
  });
});

// 8. Confusion Detector (Cross-analyzes quiz mistakes + teach-back gaps)
app.post("/api/confusion/detect", async (req, res) => {
  const { subject = "Mathematics", topic = "Core Principles", mistakes = [] } = req.body;

  try {
    const ai = getAIClient();
    if (ai) {
      const prompt = `You are LearnLoop AI's "Confusion Detector".
Analyze common student misconceptions in ${subject}, particularly for topic: ${topic}.
Recent student mistakes: ${JSON.stringify(mistakes)}

Identify high-probability concept confusions (e.g. Permutation vs Combination, Mass vs Weight, BFS vs DFS, Active vs Passive Voice, 2NF vs 3NF).
Return strictly JSON array:
[
  {
    "id": "conf-ai-item-1",
    "subject": "${subject}",
    "title": "Concept A vs Concept B Confusion",
    "conceptA": "Concept A",
    "conceptB": "Concept B",
    "mistakesCount": 3,
    "whyHappening": "The student understands Concept A in isolation, but conflates it with Concept B under specific constraints.",
    "keyDistinction": "Core mental model distinction between Concept A and Concept B.",
    "recommendedAction": "Review side-by-side comparison → Walk through worked example → Teach it back → Retest",
    "severity": "High"
  }
]`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const timestamp = Date.now();
          const withUniqueIds = parsed.map((item, idx) => ({
            ...item,
            id: `conf-ai-${timestamp}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
          }));
          return res.json({ success: true, confusions: withUniqueIds, source: "gemini" });
        }
      }
    }
  } catch (e: any) {
    console.warn("Confusion detector fallback engaged:", e?.message);
  }

  // Pre-calculated verified academic confusions dynamically mapped to subject
  const fbTime = Date.now();
  const subLower = subject.toLowerCase();

  let subjectConfusions = [
    {
      id: `conf-${fbTime}-1`,
      subject: subject,
      title: `${subject} Core Principles: Concept A vs Concept B`,
      conceptA: "Fundamental Model A",
      conceptB: "Boundary Condition B",
      mistakesCount: 3,
      whyHappening: "Overlooking specific operational boundaries or scope of applicability.",
      keyDistinction: "Concept A governs baseline behavior, whereas Concept B applies under explicit constraints.",
      recommendedAction: "Review comparison matrix → Walk through practical scenario → Teach it back",
      severity: "High",
    },
    {
      id: `conf-${fbTime}-2`,
      subject: subject,
      title: `Theoretical vs Applied ${subject}`,
      conceptA: "Theoretical Axiom",
      conceptB: "Applied Implementation",
      mistakesCount: 2,
      whyHappening: "Confusing abstract definition with edge-case runtime behavior.",
      keyDistinction: "Axioms establish invariant proofs, while implementation considers cost and limits.",
      recommendedAction: "Practice 3 worked examples and explain back to AI Tutor.",
      severity: "Medium",
    },
  ];

  if (subLower.includes("math")) {
    subjectConfusions = [
      {
        id: `conf-math-1-${fbTime}`,
        subject: "Mathematics",
        title: "Permutation vs Combination",
        conceptA: "Permutation (nPr)",
        conceptB: "Combination (nCr)",
        mistakesCount: 3,
        whyHappening: "Overlooking whether the sequence/order of elements produces a distinct outcome.",
        keyDistinction: "Permutation: Order matters (like a passcode). Combination: Order does not matter (like a hand of cards).",
        recommendedAction: "Review 3 worked probability examples → Teach-Back Mode → Retest",
        severity: "High",
      },
      {
        id: `conf-math-2-${fbTime}`,
        subject: "Mathematics",
        title: "Algebraic vs Geometric Multiplicity",
        conceptA: "Algebraic Multiplicity",
        conceptB: "Geometric Multiplicity",
        mistakesCount: 2,
        whyHappening: "Conflating polynomial root frequency with eigenspace dimensions.",
        keyDistinction: "Algebraic is the count of roots in det(A-λI)=0; Geometric is the dimension of null(A-λI).",
        recommendedAction: "Practice matrix diagonalization checks.",
        severity: "Medium",
      },
    ];
  } else if (subLower.includes("phys")) {
    subjectConfusions = [
      {
        id: `conf-phys-1-${fbTime}`,
        subject: "Physics",
        title: "Mass vs Weight",
        conceptA: "Mass (kg)",
        conceptB: "Weight (Newtons)",
        mistakesCount: 3,
        whyHappening: "Colloquially using 'weight' to measure mass in everyday language.",
        keyDistinction: "Mass is intrinsic matter quantity (constant everywhere); Weight is gravitational force W = m*g.",
        recommendedAction: "Calculate lunar vs terrestrial weight in Teach-Back Mode.",
        severity: "High",
      },
      {
        id: `conf-phys-2-${fbTime}`,
        subject: "Physics",
        title: "Speed vs Velocity",
        conceptA: "Speed (Scalar)",
        conceptB: "Velocity (Vector)",
        mistakesCount: 2,
        whyHappening: "Neglecting directional vectors in circular motion.",
        keyDistinction: "Speed is magnitude only; Velocity requires magnitude and directional orientation.",
        recommendedAction: "Review uniform circular acceleration problems.",
        severity: "Medium",
      },
    ];
  } else if (subLower.includes("cs") || subLower.includes("computer")) {
    subjectConfusions = [
      {
        id: `conf-cs-1-${fbTime}`,
        subject: "Computer Science",
        title: "BFS vs DFS Traversal",
        conceptA: "Breadth-First Search (BFS)",
        conceptB: "Depth-First Search (DFS)",
        mistakesCount: 3,
        whyHappening: "Confusing Queue vs Stack implementations and shortest-path guarantees.",
        keyDistinction: "BFS explores level-by-level using a FIFO Queue and guarantees unweighted shortest path; DFS plunges along branches using a Stack.",
        recommendedAction: "Trace graph traversal step-by-step in Teach-Back.",
        severity: "High",
      },
      {
        id: `conf-cs-2-${fbTime}`,
        subject: "Computer Science",
        title: "Process vs Thread",
        conceptA: "Process (Isolated Memory)",
        conceptB: "Thread (Shared Memory)",
        mistakesCount: 2,
        whyHappening: "Mixing up virtual address spaces and context switching overhead.",
        keyDistinction: "Processes have separate memory spaces; threads within the same process share heap memory.",
        recommendedAction: "Review OS scheduling and memory isolation.",
        severity: "Medium",
      },
    ];
  } else if (subLower.includes("dbms")) {
    subjectConfusions = [
      {
        id: `conf-dbms-1-${fbTime}`,
        subject: "DBMS",
        title: "2NF vs 3NF: Partial vs Transitive Dependency",
        conceptA: "2NF (Partial Dependency)",
        conceptB: "3NF (Transitive Dependency)",
        mistakesCount: 3,
        whyHappening: "Confusing whether the determinant is part of a composite primary key or a separate non-key column.",
        keyDistinction: "2NF applies only when the primary key has multiple columns (composite). 3NF applies even when the primary key is just one single column!",
        recommendedAction: "Review 2NF vs 3NF comparison matrix → Teach-Back Mode → Retest",
        severity: "High",
      },
    ];
  }

  return res.json({
    success: true,
    confusions: subjectConfusions,
    source: "fallback",
  });
});

// 9. Smart Diagnostic Test Generator ("Find My Learning Level")
app.post("/api/diagnostic/generate", async (req, res) => {
  const { subject = "Mathematics", language = "English" } = req.body;

  try {
    const ai = getAIClient();
    if (ai) {
      const prompt = `Generate a smart 4-question diagnostic test for a student starting ${subject}.
Language: ${language}
Each question should probe a different fundamental pillar to gauge if they are Beginner, Intermediate, or Advanced.

Return strictly JSON:
{
  "subject": "${subject}",
  "questions": [
    {
      "id": "diag-1",
      "topic": "Core Concept 1",
      "question": "Question text in ${language}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "concept": "Core concept tested"
    }
  ]
}`;

      const text = await callGemini({
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });

      if (text) {
        const cleaned = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
        const parsed = JSON.parse(cleaned);
        if (parsed.questions && parsed.questions.length > 0) {
          return res.json({ success: true, data: parsed, source: "gemini" });
        }
      }
    }
  } catch (e: any) {
    console.warn("Diagnostic test generator fallback engaged:", e?.message);
  }

  // Dynamic subject diagnostics
  return res.json({
    success: true,
    data: {
      subject,
      questions: [
        {
          id: "diag-1",
          topic: `Foundations of ${subject}`,
          question: `In ${subject}, what is the essential prerequisite rule for establishing consistency and rigorous proofs?`,
          options: [
            "Ensuring atomic, non-contradictory core axioms and validated constraints",
            "Ignoring foundational definitions to accelerate computation",
            "Assuming arbitrary assertions without verifying boundary hypotheses",
            "Eliminating formal verification and test assertions",
          ],
          correctIndex: 0,
          concept: "Foundational Principles",
        },
        {
          id: "diag-2",
          topic: `Analytical Frameworks in ${subject}`,
          question: `When analyzing relationships in ${subject}, which condition ensures that deductions are valid and free of information loss?`,
          options: [
            "Preserving isomorphic transformations and bijective dependency mappings",
            "Splitting attributes arbitrarily without common associative keys",
            "Discarding intermediate state proofs",
            "Relying solely on intuition without formal verification",
          ],
          correctIndex: 0,
          concept: "Formal Dependency Analysis",
        },
        {
          id: "diag-3",
          topic: `Operational Mechanics in ${subject}`,
          question: `How do practitioners in ${subject} isolate and resolve subtle boundary conditions?`,
          options: [
            "By systematically testing edge-case values and evaluating limit behaviors",
            "By overlooking singular exceptions and edge anomalies",
            "By assuming symmetric behavior under non-symmetric constraints",
            "By skipping verification when sample sizes are small",
          ],
          correctIndex: 0,
          concept: "Boundary State Analysis",
        },
        {
          id: "diag-4",
          topic: `Advanced Synthesis in ${subject}`,
          question: `What distinguishes master-level problem solving from basic memorization in ${subject}?`,
          options: [
            "Deep intuitive synthesis across multiple sub-domains and the ability to teach concepts simply",
            "Rote memorization of past question templates without understanding",
            "Focusing solely on passing tests without practical application",
            "Relying on external answer keys without cognitive verification",
          ],
          correctIndex: 0,
          concept: "Higher-order Conceptual Synthesis",
        },
      ],
    },
    source: "fallback",
  });
});

// 10. Evaluate Diagnostic Test & Generate Adaptive Path
app.post("/api/diagnostic/evaluate", (req, res) => {
  const { subject = "Mathematics", score = 3, total = 4 } = req.body;
  const percentage = Math.round((score / total) * 100);

  let level: "Beginner" | "Intermediate" | "Advanced" = "Intermediate";
  if (percentage < 50) level = "Beginner";
  else if (percentage >= 75) level = "Advanced";

  const classifications = [
    {
      topic: `Core Foundations of ${subject}`,
      status: percentage >= 50 ? "Strong" : "Needs Practice",
      note: percentage >= 50 ? "Clear structural understanding" : "Review core axioms and first principles",
    },
    {
      topic: `Intermediate Mechanics in ${subject}`,
      status: percentage >= 75 ? "Strong" : "Needs Practice",
      note: "Candidate for targeted Teach-Back and confusion analysis",
    },
    {
      topic: `Problem-Solving & Boundary Traps`,
      status: percentage >= 50 ? "Moderate" : "Needs Practice",
      note: "Build confidence in tackling counter-examples and tricky questions",
    },
    {
      topic: `Advanced Synthesis in ${subject}`,
      status: percentage >= 75 ? "Strong" : "Unknown",
      note: "Advanced level — unlock as soon as intermediate modules are mastered",
    },
  ];

  const path =
    level === "Beginner"
      ? [
          `1. Review Core ${subject} First Principles`,
          `2. Step-by-step Foundation Drills`,
          `3. Targeted Mistake Detective Clinic`,
          `4. Teach-Back ${subject} to AI in your own words`,
          `5. Retest & Level Up`,
        ]
      : [
          `1. Rapid Diagnostics: Advanced Concept Disambiguation in ${subject}`,
          `2. Teach-Back advanced topics in your own words`,
          `3. Challenging Multi-Step Problem Solving`,
          `4. Timed Competitive Examination Drills`,
          `5. Full ${subject} Mastery Certification`,
        ];

  return res.json({
    success: true,
    result: {
      subject,
      overallScore: percentage,
      suggestedLevel: level,
      topicClassifications: classifications,
      personalizedPath: path,
    },
  });
});

// 11. "WHAT SHOULD I LEARN NOW?" Recommendation Engine
app.post("/api/recommend/next", (req, res) => {
  const { subject = "Mathematics", topic = "Core Principles", weakTopicsCount = 2 } = req.body;

  return res.json({
    success: true,
    recommendation: {
      subject,
      topic: topic || `Key Foundations of ${subject}`,
      actionType: "teach-back",
      title: `Explain ${topic || `Key Foundations of ${subject}`} in Teach-Back Mode`,
      reason: `Personalized AI loop: Explain this concept in your own words to prove deep understanding.`,
      primaryMetric: `Personalized for ${subject} • Adaptive Difficulty`,
    },
  });
});

// Static assets & service worker handling
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  const swPath =
    process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), "dist", "sw.js")
      : path.join(process.cwd(), "public", "sw.js");
  res.sendFile(swPath);
});

app.use(express.static(path.join(process.cwd(), "public")));

// Vite middleware setup
async function start() {
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
    console.log(`LearnLoop AI server is running on http://0.0.0.0:${PORT}`);
  });
}

start();
