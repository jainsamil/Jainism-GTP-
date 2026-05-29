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
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required.' });
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
      knowledge: `{ "q": { "en": "question english", "hi": "question hindi" }, "a": { "en": "answer english", "hi": "answer hindi" }, "category": "custom category" }`,
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
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Data Generation Error:", error);
    res.status(500).json({ error: error.message || 'Failed to generate AI data content' });
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
