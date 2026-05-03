import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

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
