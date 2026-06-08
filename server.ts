import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});
const PORT = 3000;

app.use(express.json());

// In-memory Database
const db = {
  users: [] as any[], // { id, name, role, subject, isOnline }
  classes: [] as any[], // { id, teacherId, teacherName, subject, title, link }
  exams: [] as any[], // { id, teacherId, title, duration, questions: [] }
  content: {
    aarti: [] as any[],
    stotra: [] as any[],
    puja: [] as any[]
  }
};

// API Routes
app.get('/api/content', (req, res) => res.json(db.content));
app.post('/api/content', (req, res) => {
  const { type, item } = req.body;
  if (db.content[type as keyof typeof db.content]) {
    db.content[type as keyof typeof db.content].push({ ...item, id: Date.now().toString() });
  }
  res.json({ success: true, content: db.content });
});

// Gemini Scripture Generator Route
app.post('/api/gemini/generate-scripture', async (req, res) => {
  try {
    const { title, category, adminPassword } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required.' });
    }

    if (adminPassword !== 'admin123') {
      return res.status(403).json({ error: 'Unauthorized: Invalid admin password.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is not configured in Secrets.' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Write a highly detailed, authentic, traditional Jain devotional text for a "${category}" titled "${title}".
    Provide the content in beautiful Devnagari Hindi (with standard formatting, multiple stanzas, and traditional verses/chants as applicable) and also provide optional english subtitle translations or explanations of key terms if helpful.
    Make sure the text is lengthy, devotionally rich, and is completely structured with a traditional layout. Do not write any preamble or notes, output only the actual scripture content.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini Scripture Generation Error:", error);
    res.status(500).json({ error: error.message || 'Failed to generate scripture' });
  }
});

// Admin AI Agent multilingual DB generator
app.post('/api/admin/ai-generate-data', async (req, res) => {
  try {
    const { targetCollection, prompt, language } = req.body;
    if (!targetCollection || !prompt) {
      return res.status(400).json({ error: 'targetCollection and prompt are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const schemaInfo = {
      knowledge: `{ "question": { "en": "question english", "hi": "question hindi" }, "jainReason": { "en": "spiritual basis and traditional jain explanation in english", "hi": "spiritual basis and traditional jain explanation in hindi" }, "scienceReason": { "en": "scientific logic or medical analysis in english", "hi": "scientific logic or medical analysis in hindi" }, "category": "custom category" }`,
      tirthankars: `{ "name": { "en": "", "hi": "" }, "symbol": { "en": "", "hi": "" }, "color": { "en": "", "hi": "" }, "birthPlace": { "en": "", "hi": "" }, "height": { "en": "", "hi": "" }, "age": { "en": "", "hi": "" }, "desc": { "en": "", "hi": "" }, "image": "https://images.unsplash.com/photo-1609137144814-7f1543faf743?auto=format&fit=crop&q=80&w=600" }`,
      aagams: `{ "title": { "en": "", "hi": "" }, "author": { "en": "", "hi": "" }, "sect": { "en": "", "hi": "" }, "category": { "en": "", "hi": "" }, "desc": { "en": "", "hi": "" }, "content": { "en": "", "hi": "" } }`,
      history: `{ "title": { "en": "", "hi": "" }, "era": { "en": "", "hi": "" }, "desc": { "en": "", "hi": "" }, "detailedText": { "en": "", "hi": "" }, "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" }`,
      festivals: `{ "name": { "en": "", "hi": "" }, "tithi": { "en": "", "hi": "" }, "desc": { "en": "", "hi": "" }, "significance": { "en": "", "hi": "" }, "rituals": { "en": "", "hi": "" }, "image": "https://images.unsplash.com/photo-1561037404-61cd96ad61db?auto=format&fit=crop&q=80&w=600" }`,
      saints: `{ "name": { "en": "", "hi": "" }, "sect": { "en": "", "hi": "" }, "type": "Digambar", "desc": { "en": "", "hi": "" }, "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" }`,
      vichaar: `{ "hi": "hindi quote", "en": "english quote", "source": "author/source" }`,
      media: `{ "title": { "en": "", "hi": "" }, "type": "story", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "author": { "en": "", "hi": "" }, "desc": { "en": "", "hi": "" } }`,
      quiz: `{ "q": { "en": "", "hi": "" }, "options": { "hi": ["", "", "", ""], "en": ["", "", "", ""] }, "answer": 0, "explanation": { "en": "", "hi": "" } }`
    };

    const targetSchema = schemaInfo[targetCollection as keyof typeof schemaInfo] || schemaInfo.knowledge;

    const systemInstruction = `You are an expert autonomous AI Developer Agent for Jainism. Your task is to generate and return a single valid JSON object representing accurate, high-quality, authentic information to append to the database for the collection "${targetCollection}" based on the user's instructions.
    
    Languages to support/generate in: ${language || 'Hindi, English, Hinglish, etc.'}.
    You support 20+ languages natively including Hindi, English, Hinglish, Sanskrit, Prakrit, Gujarati, etc. If the instruction asks for translations, generate them with high academic precision.
    Return ONLY a single valid JSON object under the layout definition of this schema:
    ${targetSchema}
    
    Do not wrap the JSON object inside any Markdown code blocks or write extra words. Just output the clean JSON object directly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Data Generation Error:", error);
    res.status(500).json({ error: error.message || 'Failed to generate AI data content' });
  }
});

// AI Centralized NLP Maintenance Agent Endpoint
app.post('/api/admin/nlp-agent-execute', async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is not configured' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const nlpSystemInstruction = `You are the ultimate super-powered master autonomous Jainism GPT AI Admin Agent. Your task is to parse the developer prompt (which handles natural language instructions, potentially with attached files, screenshots, images, transcripts, or PDF books/granths) and determine which database transformation to perform on the Firestore database.

Multimodal Capabilities:
1. PDFs & Uploaded Books: If the user provides an attached PDF document (mimeType application/pdf), image (image/*), or audio/text file, read and analyze all pages containing holy Sanskrit, Prakrit, Devnagari Hindi, or English text of Jain Stotras, Granths, Puranas, fast guidelines, or historical details. Extract and structure them with deep theological accuracy.
2. YouTube Video & Audio Links: If the user inputs a YouTube video link (e.g. youtube.com or youtu.be link) and asks to add it to a media category:
   - Extract the embed code format URL (e.g., https://www.youtube.com/embed/{video_id}) or use the YouTube web URL.
   - Detect whether the target category is 'stories', 'bhajans', or 'audiobooks'.
   - Generate a beautiful Unsplash thumbnail URL relating to Jainism/spirituality, set a duration (like "12:15"), auto-assign an artist/author name, and output a valid entry for the 'media' collection.
3. Local/Device Media Clips: If the user uploads a video file, clip, or audio clip, analyze its metadata or content description, choose a professional mock or standby audio streaming URL (like stable audio archives or SoundHelix streams), create a premium card with custom title, and commit it to the corresponding collection.

You support these collections with their schemas:
1. 'knowledge': { "question": { "en": "str", "hi": "str" }, "jainReason": { "en": "str", "hi": "str" }, "scienceReason": { "en": "str", "hi": "str" }, "category": "str" }
2. 'tirthankars': { "name": { "en": "str", "hi": "str" }, "symbol": { "en": "str", "hi": "str" }, "desc": { "en": "str", "hi": "str" }, "number": 1-24, "kaal": "Past"|"Present"|"Future", "details": { "en": "str", "hi": "str" } }
3. 'aagams': { "title": "str", "category": "Pujan"|"Stuti"|"Vidhan"|"Chalisa"|"Bhajan"|"Aarti", "content": "str" }
4. 'history': { "title": { "en": "str", "hi": "str" }, "desc": { "en": "str", "hi": "str" }, "era": { "en": "str", "hi": "str" }, "detailedText": { "en": "str", "hi": "str" }, "image": "str" }
5. 'festivals': { "name": { "en": "str", "hi": "str" }, "tithi": { "en": "str", "hi": "str" }, "desc": { "en": "str", "hi": "str" }, "significance": { "en": "str", "hi": "str" }, "rituals": { "en": "str", "hi": "str" }, "image": "str" }
6. 'saints': { "name": { "en": "str", "hi": "str" }, "sect": { "en": "str", "hi": "str" }, "desc": { "en": "str", "hi": "str" }, "period": { "en": "str", "hi": "str" }, "image": "str" }
7. 'vichaar': { "hi": "str", "en": "str", "source": "str" }
8. 'media': { "title": "str (e.g., beautiful Hindi title)", "type": "stories"|"audiobooks"|"bhajans", "thumbnail": "Unsplash image URL representing spiritual Jain theme", "url": "audio/video stream URL or Youtube embed URL", "artist": "artist/author string", "duration": "string representation like MM:SS" }
9. 'quiz': { "q": { "en": "str", "hi": "str" }, "options": { "hi": ["", "", "", ""], "en": ["", "", "", ""] }, "answer": 0-3, "explanation": { "en": "str", "hi": "str" } }
10. 'panchang': { "tithi": "str", "paksha": "str", "festivals": ["str", ...], "kalyanak": ["str", ...], "acharyaDarpan": ["str", ...], "shubhMuhurat": ["str", ...], "vrat": ["str", ...], "sunrise": "str", "sunset": "str", "samvat": "str", "vns": "str" }

Your action mapping:
- If the instruction wants to add an event/item, set action: "add".
- If the instruction wants to edit/update an item, set action: "update" and set targetId to that document id or key.
- If the user explicitly asks to delete an item (e.g. "delete bhajan called X" or "remove story Y"), set action: "delete". In payload, provide "title": other field identifiers to help search-delete on client side.
- If the instruction is a direct chat, question on scriptures, generic query, or status audit, set action: "reply".

Return ONLY a single valid JSON object under this layout:
{
  "action": "add" | "update" | "delete" | "reply",
  "targetCollection": "knowledge" | "tirthankars" | "aagams" | "history" | "festivals" | "saints" | "vichaar" | "media" | "quiz" | "panchang" | null,
  "targetId": "string-id-or-date-key-like-2026-06-01" | null,
  "payload": { ...schema-compliant data object... } | null,
  "replyText": "highly detailed, beautiful, professional response in the voice of the Supreme Autonomous Jainism GPT AI Master Admin Agent, summarizing the successful action, translations, text analyses, or content edits performed."
}

Do not wrap inside markdown code blocks, just return pure JSON.`;

    const contents: any[] = [];
    contents.push(prompt);

    if (image) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        contents.push({
          inlineData: {
            data: matches[2],
            mimeType: matches[1]
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: nlpSystemInstruction,
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, ...parsedData });
  } catch (error: any) {
    console.error("NLP Agent Execution Error:", error);
    res.status(500).json({ error: error.message || 'Failed NLP Agent transaction' });
  }
});

// Manuscript Scanning Live OCR & Translation Endpoint
app.post('/api/manuscript/translate-image', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key is not configured in Secrets.' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image encoding format.' });
    }

    const imageMime = matches[1];
    const imageBase64 = matches[2];

    const prompt = `Analyze this ancient Jain manuscript page image.
Your objective:
1. Act as a Jainology research scholar and perform professional OCR to detect original Sanskritic/Prakrit/Devnagari verses (Dharmic Sutras, Gathas, or Chants).
2. Translate the detected text with utmost precision and devotion into Hindi (literalHi) and English (literalEn).
3. Extract the underlying "Scientific / Mathematical Core" of this script (for example, connect it to physical atomism, cosmic structures, microbial life cells, energy balance, math series, etc.) in rich Hindi (scientificHi).
4. Classify the source language (src) as Prakrit or Sanskrit.
5. Provide the original detected text (originText) accurately.

Return ONLY a single valid JSON object following this exact schema:
{
  "literalHi": "हिंदी गाथा अनुवाद",
  "literalEn": "English literal verse translation",
  "scientificHi": "वैज्ञानिक सम्बन्ध एवं भौतिक विश्लेषण विवरण (हिंदी में)",
  "src": "Prakrit / Sanskrit",
  "originText": "मल देवनागरी मूल गाथा श्लोक पाठ"
}

Do not wrap the JSON in Markdown code block blocks. Just return the clean JSON string directly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMime
          }
        },
        prompt
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error("Manuscript Image Translation error:", error);
    res.status(500).json({ error: error.message || 'Failed to analyze manuscript image.' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('register', (userData) => {
    const user = { ...userData, id: socket.id, isOnline: true };
    db.users.push(user);
    io.emit('users_update', db.users);
    socket.emit('registered', user);
  });

  socket.on('create_class', (classData) => {
    const newClass = { ...classData, id: Date.now().toString() };
    db.classes.push(newClass);
    io.emit('classes_update', db.classes);
  });

  socket.on('create_exam', (examData) => {
    const newExam = { ...examData, id: Date.now().toString() };
    db.exams.push(newExam);
    io.emit('exams_update', db.exams);
  });

  socket.on('get_initial_data', () => {
    socket.emit('users_update', db.users);
    socket.emit('classes_update', db.classes);
    socket.emit('exams_update', db.exams);
  });

  socket.on('disconnect', () => {
    db.users = db.users.filter(u => u.id !== socket.id);
    io.emit('users_update', db.users);
    console.log('User disconnected:', socket.id);
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
