import { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, Settings, User, BookOpen, LayoutGrid, 
  FileText, CheckCircle2, X, AlertTriangle, Clock, 
  Camera, Video, Users, Plus, Trash2, Send, Trophy,
  ChevronRight, Award, Timer, ShieldAlert, Bell, ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db, auth, googleProvider, signInWithPopup } from '../firebase';
import { 
  collection, query, onSnapshot, addDoc, 
  updateDoc, doc, deleteDoc, serverTimestamp,
  getDocs, where, setDoc, getDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import SectionAiAgent from '../components/SectionAiAgent';
import PathshalaFlashcardsDeck, { FLASHCARDS_DATA } from '../components/PathshalaFlashcardsDeck';

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

export default function PathshalaPage() {
  const { theme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading, login: authLogin } = useAuth();

  const [pathshalaUser, setPathshalaUser] = useState<any>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showGoogleRoleSetup, setShowGoogleRoleSetup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'teacher'>('student');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherClassTime, setTeacherClassTime] = useState('');
  const [studentTeacherName, setStudentTeacherName] = useState('');
  const [studentClassName, setStudentClassName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authErrorModal, setAuthErrorModal] = useState<{
    show: boolean;
    domain: string;
    projectId: string;
    rawError: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'homework' | 'exams' | 'results' | 'discussions' | 'users' | 'flashcards'>('dashboard');
  const [classes, setClasses] = useState<any[]>([]);
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);
  
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    const permission = await Notification.requestPermission();
    setPushEnabled(permission === 'granted');
    if (permission === 'granted') {
      new Notification('Notifications Enabled', {
        body: 'You will now receive alerts for classes and homework.',
        icon: '/favicon.ico'
      });
    }
  };
  const [showCreateExam, setShowCreateExam] = useState(false);
  const [showTakeExam, setShowTakeExam] = useState<any>(null);
  const [showResults, setShowResults] = useState<any>(null);

  // Discussions state
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<'general' | 'teacher-student' | 'teacher-teacher'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pathshalaUser) return;
    
    const qMessages = query(collection(db, 'discussions'), where('channel', '==', activeChannel));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      msgs.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribeMessages();
  }, [pathshalaUser, activeChannel]);

  // Form states
  const [classForm, setClassForm] = useState({ title: '', subject: '', link: '' });
  const [examForm, setExamForm] = useState({ title: '', duration: 30, questions: [] as any[] });
  const [currentQuestion, setCurrentQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0 });

  // Exam taking state
  const [examState, setExamState] = useState({
    currentQuestionIndex: 0,
    answers: [] as number[],
    timeLeft: 0,
    warnings: 0,
    isFinished: false
  });

  const [mediaStreams, setMediaStreams] = useState<{ camera: MediaStream | null, screen: MediaStream | null }>({ camera: null, screen: null });
  const cameraRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!pathshalaUser) return;

    const qClasses = query(collection(db, 'classes'));
    const unsubscribeClasses = onSnapshot(qClasses, (snapshot) => {
      setClasses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qExams = query(collection(db, 'exams'));
    const unsubscribeExams = onSnapshot(qExams, (snapshot) => {
      setExams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qHomeworks = query(collection(db, 'homeworks'));
    const unsubscribeHomeworks = onSnapshot(qHomeworks, (snapshot) => {
      setHomeworks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qSubmissions = query(collection(db, 'exam_submissions'));
    const unsubscribeSubmissions = onSnapshot(qSubmissions, (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qHwSubmissions = query(collection(db, 'homework_submissions'));
    const unsubscribeHwSubmissions = onSnapshot(qHwSubmissions, (snapshot) => {
      setHomeworkSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qUsers = query(collection(db, 'pathshala_users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qNotifications = query(collection(db, 'notifications'), where('userId', '==', pathshalaUser.id));
    const unsubscribeNotifications = onSnapshot(qNotifications, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      // Check for new unread notifications to trigger push
      if (pushEnabled && newNotifications.length > notifications.length) {
        const latest = newNotifications.filter((n: any) => !n.read)[0];
        if (latest && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(latest.title || 'New Notification', {
            body: latest.message,
            icon: '/favicon.ico'
          });
        }
      }
      
      setNotifications(newNotifications);
    });

    return () => {
      unsubscribeClasses();
      unsubscribeExams();
      unsubscribeHomeworks();
      unsubscribeSubmissions();
      unsubscribeHwSubmissions();
      unsubscribeUsers();
      unsubscribeNotifications();
    };
  }, [pathshalaUser]);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (showTakeExam && examState.timeLeft > 0 && !examState.isFinished) {
      timer = setInterval(() => {
        setExamState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            finishExam();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTakeExam, examState.timeLeft, examState.isFinished]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'classes'), {
        ...classForm,
        teacherId: pathshalaUser?.id,
        teacherName: pathshalaUser?.name,
        createdAt: serverTimestamp(),
        active: true
      });
      
      // Notify students
      const myStudents = allUsers.filter(u => u.role === 'student' && u.teacherName === pathshalaUser?.name);
      for (const student of myStudents) {
        await addDoc(collection(db, 'notifications'), {
          userId: student.id,
          message: `Teacher ${pathshalaUser?.name} has started a new class: ${classForm.title}`,
          createdAt: serverTimestamp(),
          read: false
        });
      }

      setShowCreateClass(false);
      setClassForm({ title: '', subject: '', link: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(o => !o)) return;
    setExamForm(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));
    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (examForm.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    try {
      await addDoc(collection(db, 'exams'), {
        ...examForm,
        teacherId: pathshalaUser?.id,
        teacherName: pathshalaUser?.name,
        createdAt: serverTimestamp()
      });
      setShowCreateExam(false);
      setExamForm({ title: '', duration: 30, questions: [] });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showTakeExam && !examState.isFinished) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setExamState(prev => {
            const newWarnings = prev.warnings + 1;
            alert(`WARNING: Tab switching detected! (${newWarnings}/3). Multiple violations will lead to auto-submission.`);
            if (newWarnings >= 3) {
              finishExam();
            }
            return { ...prev, warnings: newWarnings };
          });
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [showTakeExam, examState.isFinished]);

  useEffect(() => {
    if (showTakeExam && mediaStreams.camera && cameraRef.current) {
      cameraRef.current.srcObject = mediaStreams.camera;
    }
    if (showTakeExam && mediaStreams.screen && screenRef.current) {
      screenRef.current.srcObject = mediaStreams.screen;
    }
  }, [showTakeExam, mediaStreams]);

  const startExam = async (exam: any) => {
    let cameraStream: MediaStream | null = null;
    let screenStream: MediaStream | null = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }).catch((err) => {
          console.warn("Camera hardware access denied or not available, using simulation.", err);
          return null;
        });
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).catch((err) => {
          console.warn("Screen share capture denied or not available, using simulation.", err);
          return null;
        });
      }
    } catch (err) {
      console.warn('Failed to initialize proctoring hardware, falling back to simulated monitoring:', err);
    }

    setMediaStreams({ camera: cameraStream, screen: screenStream });
    setShowTakeExam(exam);
    setExamState({
      currentQuestionIndex: 0,
      answers: new Array(exam.questions.length).fill(-1),
      timeLeft: exam.duration * 60,
      warnings: 0,
      isFinished: false
    });
  };

  const finishExam = async () => {
    if (examState.isFinished) return;
    setExamState(prev => ({ ...prev, isFinished: true }));
    
    if (mediaStreams.camera) mediaStreams.camera.getTracks().forEach(track => track.stop());
    if (mediaStreams.screen) mediaStreams.screen.getTracks().forEach(track => track.stop());
    setMediaStreams({ camera: null, screen: null });
    
    const score = examState.answers.reduce((acc, ans, idx) => {
      return acc + (ans === showTakeExam.questions[idx].correctAnswer ? 1 : 0);
    }, 0);

    try {
      await addDoc(collection(db, 'exam_submissions'), {
        examId: showTakeExam.id,
        examTitle: showTakeExam.title,
        studentId: pathshalaUser?.id,
        studentName: pathshalaUser?.name,
        answers: examState.answers,
        score,
        totalQuestions: showTakeExam.questions.length,
        warnings: examState.warnings,
        submittedAt: serverTimestamp()
      });
      alert(`Exam submitted! Your score: ${score}/${showTakeExam.questions.length}`);
      setShowTakeExam(null);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Google Auth & Presence Sync Logic
  useEffect(() => {
    if (authUser) {
      const fetchPathshalaUser = async () => {
        try {
          const uDoc = await getDoc(doc(db, 'pathshala_users', authUser.uid));
          if (uDoc.exists()) {
            const userData = { id: uDoc.id, ...uDoc.data() } as any;
            setPathshalaUser(userData);
            setIsTeacher(userData.role === 'teacher' || userData.role === 'admin');
            setShowGoogleRoleSetup(false);
          } else {
            // First time Google login, trigger missing fields setup dialog
            setShowGoogleRoleSetup(true);
            setName(authUser.displayName || '');
          }
        } catch (e) {
          console.error("Error reading pathshala profile:", e);
        }
      };
      fetchPathshalaUser();
    } else {
      const storedUserId = localStorage.getItem('pathshala_user_id');
      if (storedUserId) {
        const fetchUser = async () => {
          try {
            const uDoc = await getDoc(doc(db, 'pathshala_users', storedUserId));
            if (uDoc.exists()) {
              const userData = { id: uDoc.id, ...uDoc.data() } as any;
              setPathshalaUser(userData);
              setIsTeacher(userData.role === 'teacher' || userData.role === 'admin');
            } else {
              localStorage.removeItem('pathshala_user_id');
            }
          } catch (err) {
            console.error('Error fetching stored session:', err);
          }
        };
        fetchUser();
      }
    }
  }, [authUser]);

  // Presence tracker heartbeat
  useEffect(() => {
    if (!pathshalaUser) return;

    const uRef = doc(db, 'pathshala_users', pathshalaUser.id);
    const setOnline = async () => {
      try {
        await setDoc(uRef, {
          isActive: true,
          lastActiveAt: Date.now()
        }, { merge: true });
      } catch (e) {
        console.error("Presence status write error:", e);
      }
    };

    setOnline();
    const interval = setInterval(setOnline, 30 * 1000); // 30 seconds interval

    return () => {
      clearInterval(interval);
      // Clean up on component unload
      const setOffline = async () => {
        try {
          await setDoc(uRef, {
            isActive: false
          }, { merge: true });
        } catch (e) {}
      };
      setOffline();
    };
  }, [pathshalaUser]);

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!username || !password) {
      setAuthError('Username and password are required');
      return;
    }
    
    try {
      if (isLoginMode) {
        const q = query(collection(db, 'pathshala_users'), where('username', '==', username), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as any;
          setPathshalaUser(userData);
          setIsTeacher(userData.role === 'teacher' || userData.role === 'admin');
          localStorage.setItem('pathshala_user_id', userData.id);
        } else {
          setAuthError('Invalid username or password');
        }
      } else {
        if (!name || !fatherName) {
          setAuthError('Name and Father Name are required for signup');
          return;
        }
        if (signupRole === 'teacher' && (!teacherSubject || !teacherClassTime)) {
          setAuthError('Subject and Class Time are required for teachers');
          return;
        }
        if (signupRole === 'student' && (!studentTeacherName || !studentClassName)) {
          setAuthError('Teacher Name and Class Name are required for students');
          return;
        }
        
        // Check if username exists
        const q = query(collection(db, 'pathshala_users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAuthError('Username already exists');
          return;
        }

        const newUser: any = {
          username,
          password, // In a real app, this should be hashed
          name,
          fatherName,
          role: signupRole,
          isActive: true, // Set user as active upon signup
          createdAt: serverTimestamp()
        };

        if (signupRole === 'teacher') {
          newUser.subject = teacherSubject;
          newUser.classTime = teacherClassTime;
        } else {
          newUser.teacherName = studentTeacherName;
          newUser.className = studentClassName;
        }
        
        const docRef = await addDoc(collection(db, 'pathshala_users'), newUser);
        const userData = { id: docRef.id, ...newUser };
        setPathshalaUser(userData);
        setIsTeacher(false);
        localStorage.setItem('pathshala_user_id', docRef.id);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleGoogleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    setAuthError('');

    if (!name || !fatherName) {
      setAuthError("Name and Father's Name are required.");
      return;
    }
    if (signupRole === 'teacher' && (!teacherSubject || !teacherClassTime)) {
      setAuthError("Subject and Class Time are required for Teachers.");
      return;
    }
    if (signupRole === 'student' && (!studentTeacherName || !studentClassName)) {
      setAuthError("Teacher Name and Class Name are required for Students.");
      return;
    }

    try {
      const newUserProfile: any = {
        name,
        fatherName,
        role: signupRole,
        email: authUser.email || '',
        photoURL: authUser.photoURL || '',
        isActive: true,
        lastActiveAt: Date.now(),
        createdAt: serverTimestamp()
      };

      if (signupRole === 'teacher') {
        newUserProfile.subject = teacherSubject;
        newUserProfile.classTime = teacherClassTime;
      } else {
        newUserProfile.teacherName = studentTeacherName;
        newUserProfile.className = studentClassName;
      }

      await setDoc(doc(db, 'pathshala_users', authUser.uid), newUserProfile);
      
      const userData = { id: authUser.uid, ...newUserProfile };
      setPathshalaUser(userData);
      setIsTeacher(signupRole === 'teacher');
      setShowGoogleRoleSetup(false);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to finalize profile setup.');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    try {
      if (pathshalaUser) {
        await deleteDoc(doc(db, 'pathshala_users', pathshalaUser.id));
        setPathshalaUser(null);
        localStorage.removeItem('pathshala_user_id');
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setDeleteError('Failed to delete account. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.error('Error signing out:', e);
    }
    setPathshalaUser(null);
    localStorage.removeItem('pathshala_user_id');
  };

  if (authLoading && !pathshalaUser) {
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 bg-transparent")}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6D00] mb-4 animate-pulse"></div>
        <p className="text-xs font-black uppercase tracking-widest text-[#FF6D00]">Initializing Pathshala...</p>
      </div>
    );
  }

  if (!pathshalaUser) {
    if (showGoogleRoleSetup) {
      return (
        <div className={cn("min-h-screen flex items-center justify-center p-6 relative bg-transparent")}>
          <div className={cn("p-10 rounded-[2.5rem] border w-full max-w-md text-left", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200 shadow-xl")}>
            <div className="w-16 h-16 bg-[#FF6D00]/10 rounded-2xl flex items-center justify-center text-[#FF6D00] mb-6">
              <GraduationCap size={32} />
            </div>
            <h2 className={cn("text-2xl font-black mb-2 uppercase tracking-wide", isDark ? "text-white" : "text-gray-900")}>Academy Profile</h2>
            <p className="text-gray-500 text-xs mb-8">Please complete your academic profile with Google to finalise your identification in classes.</p>
            
            {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}

            <form onSubmit={handleGoogleSetupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">My Academy Role</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSignupRole('student')}
                    className={cn("flex-1 py-3 rounded-xl border font-bold text-sm transition-all", signupRole === 'student' ? "bg-[#FF6D00] text-black border-[#FF6D00]" : isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('teacher')}
                    className={cn("flex-1 py-3 rounded-xl border font-bold text-sm transition-all", signupRole === 'teacher' ? "bg-[#FF6D00] text-black border-[#FF6D00]" : isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")}
                  >
                    Teacher
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Father's Name</label>
                <input 
                  type="text" 
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                  placeholder="Father's Name"
                />
              </div>

              {signupRole === 'teacher' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject Taught</label>
                    <input 
                      type="text" 
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                      placeholder="e.g. Jain History"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class Time</label>
                    <input 
                      type="text" 
                      value={teacherClassTime}
                      onChange={(e) => setTeacherClassTime(e.target.value)}
                      className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                      placeholder="e.g. 10:00 AM - 11:00 AM"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teacher Name</label>
                    <input 
                      type="text" 
                      value={studentTeacherName}
                      onChange={(e) => setStudentTeacherName(e.target.value)}
                      className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                      placeholder="Enter teacher name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class Name</label>
                    <input 
                      type="text" 
                      value={studentClassName}
                      onChange={(e) => setStudentClassName(e.target.value)}
                      className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                      placeholder="e.g. Level 1"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider"
              >
                Complete Account Sign Up
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className={cn("min-h-screen flex items-center justify-center p-6 relative bg-transparent")}>
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <ArrowLeft size={24} className={isDark ? "text-white" : "text-gray-900"} />
        </button>
        <div className={cn("p-10 rounded-[2.5rem] border w-full max-w-md text-center", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200 shadow-xl")}>
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-lg">
            <GraduationCap size={40} />
          </div>
          <h1 className={cn("text-3xl font-display font-black mb-4", isDark ? "text-white" : "text-gray-900")}>PATHSHALA {isLoginMode ? 'LOGIN' : 'SIGNUP'}</h1>
          <p className="text-gray-500 mb-8">{isLoginMode ? 'Please login to access the virtual academy.' : 'Create a new account to join.'}</p>
          
          {authError && <p className="text-red-500 text-sm mb-4">{authError}</p>}
          
          {/* Primary Google auth */}
          <button
            type="button"
            onClick={async () => {
              try {
                await signInWithPopup(auth, googleProvider);
              } catch (e: any) {
                console.error("Google login failed", e);
                const errMsg = e?.message || String(e);
                const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'jainismgpt.vercel.app';
                setAuthErrorModal({
                  show: true,
                  domain: currentDomain,
                  projectId: "original-jainism-gpt",
                  rawError: errMsg
                });
                setAuthError("Google authentication failed. Domain authorization may be required.");
              }
            }}
            className="w-full py-4.5 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:scale-105 active:scale-95 transition-all mb-6 border border-gray-200"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign In with Google
          </button>

          {authErrorModal?.show && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-6 w-full max-w-md shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6D00]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 dark:border-white/5 pb-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                      Firebase Authentication Error
                    </h3>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">
                      Domain Authorization Required
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-left text-xs max-h-[60vh] overflow-y-auto pr-1">
                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    Your Vercel domain <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] font-black text-rose-500">{authErrorModal.domain}</code> is not authorized in your Firebase Project <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] font-black">{authErrorModal.projectId}</code>.
                  </p>

                  <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 font-bold leading-relaxed text-[11px]">
                    💡 <strong>इसे ठीक करने के लिए (To Fix This):</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1.5 font-semibold">
                      <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#FF6D00] font-black">Firebase Console</a></li>
                      <li>Go to your project <strong>{authErrorModal.projectId}</strong></li>
                      <li>Go to <strong>Authentication</strong> &gt; <strong>Settings</strong> tab</li>
                      <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong></li>
                      <li>Enter <code className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-rose-500">{authErrorModal.domain}</code></li>
                      <li>Save, and then try signing in again!</li>
                    </ol>
                  </div>

                  <div className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold border-t border-gray-100 dark:border-white/5 pt-3">
                    <span className="block mb-1 font-black uppercase tracking-wider">Technical Details:</span>
                    <div className="bg-gray-50 dark:bg-black/40 p-2.5 rounded-xl font-mono overflow-x-auto text-[9px] max-h-20 scrollbar-none">
                      {authErrorModal.rawError}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-white/5 flex gap-2">
                  <button
                    onClick={() => setAuthErrorModal(null)}
                    className="w-full py-3 bg-[#FF6D00] hover:bg-[#FF6D00]/90 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Got It / समझ आ गया
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
            <span className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">OR</span>
            <div className="flex-1 border-t border-gray-200 dark:border-white/10"></div>
          </div>

          <form onSubmit={handleCustomAuth} className="space-y-4 text-left">
            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSignupRole('student')}
                      className={cn("flex-1 py-3 rounded-xl border font-bold text-sm transition-all", signupRole === 'student' ? "bg-[#FF6D00] text-black border-[#FF6D00]" : isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole('teacher')}
                      className={cn("flex-1 py-3 rounded-xl border font-bold text-sm transition-all", signupRole === 'teacher' ? "bg-[#FF6D00] text-black border-[#FF6D00]" : isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")}
                    >
                      Teacher
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Father's Name</label>
                  <input 
                    type="text" 
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                    placeholder="Enter father's name"
                  />
                </div>
                {signupRole === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Subject Taught</label>
                      <input 
                        type="text" 
                        value={teacherSubject}
                        onChange={(e) => setTeacherSubject(e.target.value)}
                        className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                        placeholder="e.g. Jain History"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class Time</label>
                      <input 
                        type="text" 
                        value={teacherClassTime}
                        onChange={(e) => setTeacherClassTime(e.target.value)}
                        className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                        placeholder="e.g. 10:00 AM - 11:00 AM"
                      />
                    </div>
                  </>
                )}
                {signupRole === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Teacher's Name</label>
                      <input 
                        type="text" 
                        value={studentTeacherName}
                        onChange={(e) => setStudentTeacherName(e.target.value)}
                        className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                        placeholder="Enter your teacher's name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class Name</label>
                      <input 
                        type="text" 
                        value={studentClassName}
                        onChange={(e) => setStudentClassName(e.target.value)}
                        className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                        placeholder="e.g. Level 1"
                      />
                    </div>
                  </>
                )}
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("w-full p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all", isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900")} 
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all mt-4"
            >
              {isLoginMode ? 'LOGIN' : 'SIGNUP'}
            </button>
          </form>
          
          <button 
            onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }}
            className="mt-4 text-sm text-gray-400 hover:text-[#FF6D00] transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>

          {/* Quick Guest Logins */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Quick / Guest Demo Access</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const username = 'guest_student';
                    const password = 'password123';
                    const q = query(collection(db, 'pathshala_users'), where('username', '==', username), where('password', '==', password));
                    const snap = await getDocs(q);
                    if (!snap.empty) {
                      const uData = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
                      setPathshalaUser(uData);
                      setIsTeacher(false);
                      localStorage.setItem('pathshala_user_id', uData.id);
                    } else {
                      const newUser = {
                        username,
                        password,
                        name: 'Guest Student',
                        fatherName: 'Demo Father',
                        role: 'student',
                        className: 'Level 1',
                        teacherName: 'Guest Teacher',
                        isActive: true,
                        createdAt: new Date()
                      };
                      const ref = await addDoc(collection(db, 'pathshala_users'), newUser);
                      setPathshalaUser({ id: ref.id, ...newUser });
                      setIsTeacher(false);
                      localStorage.setItem('pathshala_user_id', ref.id);
                    }
                  } catch (e) {
                    const fallbackUser = { id: 'temp_stud', username: 'guest_student', name: 'Guest Student', role: 'student', className: 'Level 1', teacherName: 'Guest Teacher' };
                    setPathshalaUser(fallbackUser);
                    setIsTeacher(false);
                  }
                }}
                className="flex-1 py-3 bg-[#FF6D00]/20 hover:bg-[#FF6D00]/30 text-[#FFD54F] border border-[#FF6D00]/30 rounded-xl font-bold text-xs transition-colors"
              >
                As Student
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const username = 'guest_teacher';
                    const password = 'password123';
                    const q = query(collection(db, 'pathshala_users'), where('username', '==', username), where('password', '==', password));
                    const snap = await getDocs(q);
                    if (!snap.empty) {
                      const uData = { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
                      setPathshalaUser(uData);
                      setIsTeacher(true);
                      localStorage.setItem('pathshala_user_id', uData.id);
                    } else {
                      const newUser = {
                        username,
                        password,
                        name: 'Guest Teacher',
                        fatherName: 'Demo Father',
                        role: 'teacher',
                        subject: 'Jain Philosophy',
                        classTime: '10:00 AM - 11:00 AM',
                        isActive: true,
                        createdAt: new Date()
                      };
                      const ref = await addDoc(collection(db, 'pathshala_users'), newUser);
                      setPathshalaUser({ id: ref.id, ...newUser });
                      setIsTeacher(true);
                      localStorage.setItem('pathshala_user_id', ref.id);
                    }
                  } catch (e) {
                    const fallbackUser = { id: 'temp_teach', username: 'guest_teacher', name: 'Guest Teacher', role: 'teacher', subject: 'Jain Philosophy', classTime: '10:00 AM - 11:00 AM' };
                    setPathshalaUser(fallbackUser);
                    setIsTeacher(true);
                  }
                }}
                className="flex-1 py-3 bg-[#2962FF]/20 hover:bg-[#2962FF]/30 text-[#448AFF] border border-[#2962FF]/30 rounded-xl font-bold text-xs transition-colors"
              >
                As Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await addDoc(collection(db, 'discussions'), {
        text: newMessage,
        userId: pathshalaUser.id,
        userName: pathshalaUser.name,
        userRole: pathshalaUser.role,
        channel: activeChannel,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const t = {
    dashboard: language === 'hi' ? 'डैशबोर्ड' : 'DASHBOARD',
    flashcards: language === 'hi' ? 'फ्लैशकार्ड' : 'FLASHCARDS',
    classes: language === 'hi' ? 'कक्षाएं' : 'CLASSES',
    exams: language === 'hi' ? 'परीक्षा' : 'EXAMS',
    results: language === 'hi' ? 'परिणाम' : 'RESULTS',
    discussions: language === 'hi' ? 'चर्चा' : 'DISCUSSIONS',
    users: language === 'hi' ? 'उपयोगकर्ता' : 'USERS',
    activeClasses: language === 'hi' ? 'सक्रिय कक्षाएं' : 'ACTIVE CLASSES',
    openExams: language === 'hi' ? 'खुली परीक्षाएं' : 'OPEN EXAMS',
    achievements: language === 'hi' ? 'उपलब्धियां' : 'ACHIEVEMENTS',
    createClass: language === 'hi' ? 'नई कक्षा बनाएं' : 'CREATE NEW CLASS',
    createExam: language === 'hi' ? 'नई परीक्षा बनाएं' : 'CREATE NEW EXAM',
    joinClass: language === 'hi' ? 'कक्षा में शामिल हों' : 'JOIN CLASSROOM',
    enterExam: language === 'hi' ? 'परीक्षा में प्रवेश करें' : 'ENTER PROCTORED EXAM',
    submitExam: language === 'hi' ? 'परीक्षा जमा करें' : 'SUBMIT EXAM',
    nextQuestion: language === 'hi' ? 'अगला प्रश्न' : 'NEXT QUESTION',
    prevQuestion: language === 'hi' ? 'पिछला प्रश्न' : 'PREVIOUS',
    timeRemaining: language === 'hi' ? 'समय शेष' : 'TIME REMAINING',
    proctoredSession: language === 'hi' ? 'प्रॉक्टर्ड सत्र' : 'PROCTORED SESSION',
  };

  return (
    <div className={cn("min-h-screen p-4 pb-24 font-sans relative transition-colors duration-300 bg-transparent", isDark ? "text-gray-200" : "text-gray-900")}>
      <header className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          <GraduationCap className="text-[#FF6D00]" size={28} />
          <h1 className={cn("text-xl font-black tracking-widest", isDark ? "text-white" : "text-gray-900")}>
            {language === 'hi' ? 'अकादमी हब' : 'ACADEMY HUB'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="w-8 h-8 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-[#FF8A65] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-all shadow-sm"
          >
            <span className="text-[10px] font-bold">{language === 'en' ? 'A/अ' : 'अ/A'}</span>
          </button>
          {pathshalaUser && (
            <>
              <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn("p-2 rounded-full transition-colors relative", isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200")}
            >
              <Bell size={20} className={isDark ? "text-white" : "text-gray-900"} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#050505]"></span>
              )}
            </button>
            {showNotifications && (
              <div className={cn("absolute right-0 mt-2 w-72 rounded-2xl border shadow-xl z-50 overflow-hidden", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200")}>
                <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Notifications</h3>
                  <div className="flex gap-2 items-center">
                    {!pushEnabled && (
                      <button 
                        onClick={requestPushPermission}
                        className="text-[10px] bg-[#FF6D00] text-black px-2 py-1 rounded font-bold uppercase tracking-widest"
                      >
                        Enable Push
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={async () => {
                          for (const n of notifications.filter(n => !n.read)) {
                            await updateDoc(doc(db, 'notifications', n.id), { read: true });
                          }
                        }}
                        className="text-[10px] text-[#FF6D00] font-bold uppercase tracking-widest"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-xs">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={cn("p-4 border-b last:border-0", isDark ? "border-white/5" : "border-gray-100", !n.read && (isDark ? "bg-white/5" : "bg-orange-50"))}>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{n.createdAt?.toDate().toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            </div>
            <div className="text-right hidden sm:block">
                <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>{pathshalaUser.name}</p>
                <p className="text-[10px] text-[#FF6D00] font-black uppercase tracking-widest">{pathshalaUser.role}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest bg-white/5 px-2 py-1 rounded"
                >
                  Logout
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded"
                >
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={cn("flex gap-2 mb-6 p-1 rounded-2xl border overflow-x-auto hide-scrollbar", isDark ? "bg-[#121212]/60 border-white/5" : "bg-white border-gray-200 shadow-sm")}>
        {['dashboard', 'flashcards', 'classes', 'homework', 'exams', 'results', 'discussions', 'users'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)} 
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-[10px] whitespace-nowrap font-black tracking-widest transition-all uppercase", 
              activeTab === tab 
                ? (isDark ? "bg-white/10 text-white shadow-lg" : "bg-[#FF6D00] text-white shadow-md") 
                : "text-gray-500 hover:text-gray-400"
            )}
          >
            {tab === 'homework' ? 'Homework' : t[tab as keyof typeof t]}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("rounded-[2rem] p-6 flex flex-col items-center justify-center border transition-all", isDark ? "bg-[#121212]/60 border-[#FF6D00]/20" : "bg-white border-orange-100 shadow-sm")}>
              <span className="text-4xl font-black text-[#FF6D00] mb-1">{classes.length}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{t.activeClasses}</span>
            </div>
            <div className={cn("rounded-[2rem] p-6 flex flex-col items-center justify-center border transition-all", isDark ? "bg-[#121212]/60 border-[#2962FF]/20" : "bg-white border-blue-100 shadow-sm")}>
              <span className="text-4xl font-black text-[#2962FF] mb-1">{exams.length}</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{t.openExams}</span>
            </div>
          </div>

          {/* Real-time Presence Visual Tracker Widget */}
          <div className={cn("rounded-[2.5rem] p-6 border relative overflow-hidden", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-xl")}>
            <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/20">
              <span className="w-2 h-2 bg-[#00E676] rounded-full animate-ping"></span>
              <span className="w-2 h-2 bg-[#00E676] rounded-full absolute"></span>
              <span className="text-[9px] font-black tracking-widest text-[#00E676] uppercase">LIVE PRESENCE</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Users className="text-[#00E676]" size={20} />
              </div>
              <div>
                <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>Academy Active Identification</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Currently active students and instructors inside Pathshala
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Online Teachers */}
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-widest text-orange-500 uppercase flex items-center gap-2">
                  <span>Teachers Online</span>
                  <span className="bg-orange-500/10 px-2 py-0.5 rounded text-[10px]">
                    {allUsers.filter(u => u.role === 'teacher' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).length}
                  </span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {allUsers.filter(u => u.role === 'teacher' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).map(tUser => (
                    <div key={tUser.id} className={cn("p-3 rounded-xl border flex items-center justify-between", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {tUser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-950 dark:text-gray-100">{tUser.name}</p>
                          <p className="text-[9px] text-gray-500">{tUser.subject || 'Expert Teacher'}</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ACTIVE</span>
                    </div>
                  ))}
                  {allUsers.filter(u => u.role === 'teacher' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).length === 0 && (
                    <p className="text-xs text-gray-500 font-bold uppercase py-2">No teachers active right now</p>
                  )}
                </div>
              </div>

              {/* Online Students */}
              <div className="space-y-3">
                <h4 className="text-xs font-black tracking-widest text-blue-500 uppercase flex items-center gap-2">
                  <span>Students Online</span>
                  <span className="bg-blue-500/10 px-2 py-0.5 rounded text-[10px]">
                    {allUsers.filter(u => u.role === 'student' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).length}
                  </span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {allUsers.filter(u => u.role === 'student' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).map(sUser => (
                    <div key={sUser.id} className={cn("p-3 rounded-xl border flex items-center justify-between", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {sUser.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-950 dark:text-gray-100">{sUser.name}</p>
                          <p className="text-[9px] text-gray-500">Father Name: {sUser.fatherName || 'Academy Student'}</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ACTIVE</span>
                    </div>
                  ))}
                  {allUsers.filter(u => u.role === 'student' && u.isActive && u.lastActiveAt && u.lastActiveAt > Date.now() - 3 * 60 * 1000).length === 0 && (
                    <p className="text-xs text-gray-500 font-bold uppercase py-2">No students active right now</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn("rounded-[2.5rem] p-6 border", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-xl")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Trophy className="text-[#FF6D00]" size={20} />
              </div>
              <div>
                <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>{t.achievements}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {language === 'hi' ? 'आपकी अब तक की प्रगति' : 'Your progress so far'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {submissions.filter(s => s.studentId === pathshalaUser.id).slice(0, 3).map(sub => (
                <div key={sub.id} className={cn("p-4 rounded-2xl border flex items-center justify-between", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6D00]/20 flex items-center justify-center text-[#FF6D00]">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>{sub.examTitle}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Score: {sub.score}/{sub.totalQuestions}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#00E676] uppercase tracking-widest">Passed</p>
                  </div>
                </div>
              ))}
              {submissions.filter(s => s.studentId === pathshalaUser.id).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No exams taken yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'flashcards' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header & Gamified progress */}
          <div className={cn("rounded-[2.5rem] p-6 border relative overflow-hidden", isDark ? "bg-[#121212]/85 border-[#FF6D00]/25" : "bg-white border-orange-100 shadow-sm")}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-black text-[#FF6D00] uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/10 inline-block mb-2">
                  🎓 {language === 'hi' ? 'बाल संस्कार पाठशाला' : 'Spiritual Kids Academy'}
                </span>
                <h2 className={cn("text-2xl font-display font-black leading-tight", isDark ? "text-white" : "text-gray-900")}>
                  {language === 'hi' ? 'इंटरएक्टिव ज्ञान फ्लैशकार्ड' : 'Interactive Gyan Flashcards'}
                </h2>
                <p className="text-gray-500 text-xs mt-1">
                  {language === 'hi' ? 'सुंदर एनीमेशन, शुद्ध उच्चारण और चित्रों के साथ जैन धर्म की बुनियादी बातें सीखें।' : 'Learn Jain symbols, 24 Tirthankars\' emblems, and terms with beautiful flip cards & voice pronunciation.'}
                </p>
              </div>

              {/* Junior Scholar Progress Widget */}
              <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl flex items-center gap-3 w-full md:w-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] rounded-xl flex items-center justify-center text-black text-2xl shrink-0 font-bold shadow-md">
                  🏆
                </div>
                <div>
                  <span className="text-[9px] font-black text-orange-550 dark:text-orange-400 uppercase tracking-widest block">
                    {language === 'hi' ? 'बाल विद्वान स्तर' : 'JUNIOR SCHOLAR RANK'}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-extrabold text-sm text-gray-800 dark:text-white leading-none">
                      {JSON.parse(localStorage.getItem('pathshala_mastered_cards') || '[]').length} / {FLASHCARDS_DATA.length}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {language === 'hi' ? 'कार्ड्स सीखे' : 'Cards Learned'}
                    </span>
                  </div>
                  <div className="w-28 h-1.5 bg-gray-200 dark:bg-white/5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-[#FFD54F] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (JSON.parse(localStorage.getItem('pathshala_mastered_cards') || '[]').length / FLASHCARDS_DATA.length) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcards implementation view */}
          <PathshalaFlashcardsDeck isDark={isDark} language={language} />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className={cn("text-xl font-black mb-4", isDark ? "text-white" : "text-gray-900")}>
            {isTeacher ? 'My Students' : 'Teachers'}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {allUsers
              .filter(u => isTeacher ? u.role === 'student' : u.role === 'teacher')
              .map(user => (
              <div key={user.id} className={cn("rounded-[2rem] p-6 border flex items-center justify-between", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-md")}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6D00] to-[#FFD54F] flex items-center justify-center text-black font-black text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>{user.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {user.role === 'teacher' ? `Subject: ${user.subject || 'N/A'}` : `Class: ${user.className || 'N/A'}`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border", user.isActive ? "bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20")}>
                    {user.isActive ? 'Active' : 'Offline'}
                  </span>
                  {isTeacher && user.isActive && (
                    <button 
                      onClick={async () => {
                        try {
                          await addDoc(collection(db, 'notifications'), {
                            userId: user.id,
                            message: `Teacher ${pathshalaUser.name} has invited you to join a class.`,
                            createdAt: serverTimestamp(),
                            read: false
                          });
                          alert('Invitation sent!');
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="text-[10px] font-bold text-[#FF6D00] hover:text-[#FFD54F] uppercase tracking-widest transition-colors"
                    >
                      Invite to Class
                    </button>
                  )}
                </div>
              </div>
            ))}
            {allUsers.filter(u => isTeacher ? u.role === 'student' : u.role === 'teacher').length === 0 && (
              <div className="text-center py-12 opacity-50">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-black text-xs tracking-widest uppercase">No users found</p>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          {isTeacher && (
            <button 
              onClick={() => setShowCreateClass(true)}
              className="w-full py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> {t.createClass}
            </button>
          )}

          <div className="grid grid-cols-1 gap-4">
            {classes.map(cls => (
              <div key={cls.id} className={cn("rounded-[2rem] p-6 border relative overflow-hidden group", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-md")}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={cn("text-xl font-black mb-1", isDark ? "text-white" : "text-gray-900")}>{cls.title}</h3>
                    <p className="text-[10px] font-bold text-[#FF6D00] uppercase tracking-widest">{cls.subject} • {cls.teacherName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#00E676]/10 text-[#00E676] px-3 py-1 rounded-full text-[9px] font-black tracking-widest animate-pulse border border-[#00E676]/20">LIVE</span>
                    {isTeacher && cls.teacherId === pathshalaUser.id && (
                      <button onClick={() => deleteDoc(doc(db, 'classes', cls.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <a 
                  href={ensureAbsoluteUrl(cls.link)} target="_blank" rel="noopener noreferrer"
                  className={cn("w-full py-3 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all border", isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-orange-50 border-orange-100 text-[#FF6D00] hover:bg-orange-100")}
                >
                  <Video size={16} /> {t.joinClass}
                </a>
              </div>
            ))}
            {classes.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <Video size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-black text-xs tracking-widest uppercase">No active classes found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'homework' && (
        <div className="space-y-4">
          {isTeacher && (
            <button 
              onClick={() => {
                const title = prompt('Enter homework title:');
                const desc = prompt('Enter homework description:');
                if (title && desc) {
                  addDoc(collection(db, 'homeworks'), {
                    title,
                    description: desc,
                    teacherId: pathshalaUser.id,
                    teacherName: pathshalaUser.name,
                    createdAt: new Date().toISOString()
                  });
                }
              }}
              className="w-full py-4 bg-gradient-to-r from-[#00E676] to-[#69F0AE] text-black rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> ASSIGN HOMEWORK
            </button>
          )}

          <div className="grid grid-cols-1 gap-4">
            {homeworks.map(hw => (
              <div key={hw.id} className={cn("rounded-[2rem] p-6 border relative overflow-hidden group", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-md")}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={cn("text-xl font-black mb-1", isDark ? "text-white" : "text-gray-900")}>{hw.title}</h3>
                    <p className="text-[10px] font-bold text-[#00E676] uppercase tracking-widest">Assigned by {hw.teacherName}</p>
                  </div>
                  {isTeacher && hw.teacherId === pathshalaUser.id && (
                    <button onClick={() => deleteDoc(doc(db, 'homeworks', hw.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className={cn("text-sm mb-4", isDark ? "text-gray-400" : "text-gray-600")}>{hw.description}</p>
                {!isTeacher && (
                  <button 
                    onClick={() => {
                      const link = prompt('Enter your homework submission link (e.g. Google Drive, Docs):');
                      if (link) {
                        addDoc(collection(db, 'homework_submissions'), {
                          homeworkId: hw.id,
                          studentId: pathshalaUser.id,
                          studentName: pathshalaUser.name,
                          link: ensureAbsoluteUrl(link),
                          submittedAt: new Date().toISOString()
                        });
                        alert('Homework submitted successfully!');
                      }
                    }}
                    className={cn("w-full py-3 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all border", isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-green-50 border-green-100 text-[#00E676] hover:bg-green-100")}
                  >
                    <Send size={16} /> SUBMIT HOMEWORK
                  </button>
                )}
                {isTeacher && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Student Submissions</h4>
                    <div className="space-y-2">
                      {homeworkSubmissions.filter(sub => sub.homeworkId === hw.id).map(sub => (
                        <div key={sub.id} className="flex justify-between items-center text-xs p-3 bg-gray-500/5 rounded-xl border border-gray-500/10">
                          <span className="font-bold">{sub.studentName}</span>
                          <a 
                            href={ensureAbsoluteUrl(sub.link)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#00E676] hover:underline font-black uppercase tracking-widest text-[9px] flex items-center gap-1"
                          >
                            <BookOpen size={12} /> View Submission
                          </a>
                        </div>
                      ))}
                      {homeworkSubmissions.filter(sub => sub.homeworkId === hw.id).length === 0 && (
                        <p className="text-[10px] text-gray-500 font-bold uppercase py-1">No submissions yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {homeworks.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-black text-xs tracking-widest uppercase">No homework assigned</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-4">
          {isTeacher && (
            <button 
              onClick={() => setShowCreateExam(true)}
              className="w-full py-4 bg-gradient-to-r from-[#2962FF] to-[#448AFF] text-white rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> {t.createExam}
            </button>
          )}

          <div className="grid grid-cols-1 gap-4">
            {exams.map(exam => (
              <div key={exam.id} className={cn("rounded-[2rem] p-6 border relative overflow-hidden group", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-md")}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={cn("text-xl font-black mb-1", isDark ? "text-white" : "text-gray-900")}>{exam.title}</h3>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{exam.duration} Mins • {exam.questions.length} Questions</p>
                  </div>
                  {isTeacher && exam.teacherId === pathshalaUser.id && (
                    <button onClick={() => deleteDoc(doc(db, 'exams', exam.id))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => startExam(exam)}
                  className={cn("w-full py-3 rounded-xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all border", isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100")}
                >
                  <ShieldAlert size={16} /> ENTER PROCTORED EXAM
                </button>
              </div>
            ))}
            {exams.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="font-black text-xs tracking-widest uppercase">No upcoming exams found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className={cn("rounded-[2.5rem] p-6 border", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-xl")}>
            <h3 className={cn("text-lg font-black mb-6", isDark ? "text-white" : "text-gray-900")}>
              {isTeacher ? 'ALL STUDENT SUBMISSIONS' : 'YOUR EXAM RESULTS'}
            </h3>
            
            <div className="space-y-3">
              {(isTeacher ? submissions : submissions.filter(s => s.studentId === pathshalaUser.id)).map(sub => (
                <div key={sub.id} className={cn("p-4 rounded-2xl border flex items-center justify-between", isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100")}>
                  <div>
                    <p className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>{sub.examTitle}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {isTeacher ? `Student: ${sub.studentName}` : `Score: ${sub.score}/${sub.totalQuestions}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-[10px] font-black uppercase tracking-widest", sub.warnings > 0 ? "text-red-500" : "text-[#00E676]")}>
                      {sub.warnings > 0 ? `${sub.warnings} Warnings` : 'Clean Record'}
                    </p>
                    {isTeacher && <p className="text-[10px] font-bold text-gray-500 mt-1">Score: {sub.score}/{sub.totalQuestions}</p>}
                  </div>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No results available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className={cn("flex flex-col h-[500px] rounded-[2.5rem] border overflow-hidden", isDark ? "bg-[#121212]/80 border-white/10" : "bg-white border-gray-200 shadow-xl")}>
          <div className={cn("p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", isDark ? "border-white/10" : "border-gray-200")}>
            <div className="flex items-center gap-2">
              <h3 className={cn("text-lg font-black", isDark ? "text-white" : "text-gray-900")}>
                {language === 'hi' ? 'कक्षा चर्चा' : 'CLASS DISCUSSIONS'}
              </h3>
              <Users className="text-gray-400" size={20} />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              <button 
                onClick={() => setActiveChannel('general')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-colors", activeChannel === 'general' ? "bg-[#FF6D00] text-white" : isDark ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900")}
              >
                General
              </button>
              <button 
                onClick={() => setActiveChannel('teacher-student')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-colors", activeChannel === 'teacher-student' ? "bg-[#FF6D00] text-white" : isDark ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900")}
              >
                Teacher-Student
              </button>
              {isTeacher && (
                <button 
                  onClick={() => setActiveChannel('teacher-teacher')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-colors", activeChannel === 'teacher-teacher' ? "bg-[#FF6D00] text-white" : isDark ? "bg-white/5 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900")}
                >
                  Teacher-Teacher
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {messages.map((msg) => {
              const isMe = msg.userId === pathshalaUser.id;
              return (
                <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "items-start")}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{msg.userName}</span>
                    {msg.userRole === 'teacher' && <span className="text-[8px] bg-[#FF6D00]/20 text-[#FF6D00] px-1.5 py-0.5 rounded font-black uppercase">Teacher</span>}
                    {msg.userRole === 'admin' && <span className="text-[8px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black uppercase">Admin</span>}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm font-medium shadow-sm",
                    isMe 
                      ? "bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-tr-sm" 
                      : (isDark ? "bg-white/10 text-white rounded-tl-sm" : "bg-gray-100 text-gray-900 rounded-tl-sm")
                  )}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className={cn("p-4 border-t", isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-gray-50")}>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : 'Ask your doubt...'}
                className={cn(
                  "flex-1 p-4 rounded-2xl border font-medium focus:ring-2 focus:ring-[#FF6D00] outline-none transition-all",
                  isDark ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                )}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="w-14 h-14 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={20} className="ml-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={cn("rounded-[2.5rem] p-8 w-full max-w-md border shadow-2xl relative", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200")}>
            <button onClick={() => setShowCreateClass(false)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className={cn("text-2xl font-black mb-6", isDark ? "text-white" : "text-gray-900")}>CREATE CLASS</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Class Title</label>
                <input 
                  type="text" required
                  value={classForm.title}
                  onChange={e => setClassForm({...classForm, title: e.target.value})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-white/5 border-white/10 text-white focus:border-[#FF6D00]/50" : "bg-gray-50 border-gray-200 focus:border-orange-500")}
                  placeholder="e.g. Tattvartha Sutra Class"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                <input 
                  type="text" required
                  value={classForm.subject}
                  onChange={e => setClassForm({...classForm, subject: e.target.value})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-white/5 border-white/10 text-white focus:border-[#FF6D00]/50" : "bg-gray-50 border-gray-200 focus:border-orange-500")}
                  placeholder="e.g. Jain Philosophy"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">VC Link (Meet/Zoom)</label>
                <input 
                  type="url" required
                  value={classForm.link}
                  onChange={e => setClassForm({...classForm, link: e.target.value})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-white/5 border-white/10 text-white focus:border-[#FF6D00]/50" : "bg-gray-50 border-gray-200 focus:border-orange-500")}
                  placeholder="https://meet.google.com/..."
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#FF6D00] text-black rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] transition-all mt-4">
                LAUNCH CLASS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateExam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={cn("rounded-[2.5rem] p-8 w-full max-w-2xl border shadow-2xl relative my-8", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200")}>
            <button onClick={() => setShowCreateExam(false)} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className={cn("text-2xl font-black mb-6", isDark ? "text-white" : "text-gray-900")}>CREATE EXAM</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Exam Title</label>
                <input 
                  type="text" required
                  value={examForm.title}
                  onChange={e => setExamForm({...examForm, title: e.target.value})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-white/5 border-white/10 text-white focus:border-[#FF6D00]/50" : "bg-gray-50 border-gray-200 focus:border-orange-500")}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Duration (Minutes)</label>
                <input 
                  type="number" required
                  value={examForm.duration}
                  onChange={e => setExamForm({...examForm, duration: parseInt(e.target.value)})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-white/5 border-white/10 text-white focus:border-[#FF6D00]/50" : "bg-gray-50 border-gray-200 focus:border-orange-500")}
                />
              </div>
            </div>

            <div className={cn("p-6 rounded-2xl border mb-6", isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200")}>
              <h3 className="text-sm font-black text-[#FF6D00] mb-4 uppercase tracking-widest">Add Question</h3>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Question Text"
                  value={currentQuestion.question}
                  onChange={e => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                  className={cn("w-full rounded-xl px-4 py-3 outline-none border transition-all", isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-gray-200")}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="correct" 
                        checked={currentQuestion.correctAnswer === idx}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: idx})}
                      />
                      <input 
                        type="text" placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...currentQuestion.options];
                          newOpts[idx] = e.target.value;
                          setCurrentQuestion({...currentQuestion, options: newOpts});
                        }}
                        className={cn("flex-1 rounded-xl px-4 py-2 outline-none border transition-all text-sm", isDark ? "bg-black/50 border-white/10 text-white" : "bg-white border-gray-200")}
                      />
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs tracking-widest border border-white/10 transition-all"
                >
                  ADD QUESTION TO LIST
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-8 max-h-48 overflow-y-auto pr-2">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Questions Added ({examForm.questions.length})</h3>
              {examForm.questions.map((q, idx) => (
                <div key={idx} className={cn("p-3 rounded-xl border flex justify-between items-center", isDark ? "bg-white/5 border-white/5" : "bg-white border-gray-100 shadow-sm")}>
                  <p className="text-xs font-bold truncate pr-4">{idx + 1}. {q.question}</p>
                  <button onClick={() => setExamForm(prev => ({...prev, questions: prev.questions.filter((_, i) => i !== idx)}))} className="text-red-500 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleCreateExam}
              className="w-full py-4 bg-gradient-to-r from-[#2962FF] to-[#448AFF] text-white rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] transition-all"
            >
              PUBLISH EXAM
            </button>
          </div>
        </div>
      )}

      {/* Take Exam Modal */}
      {showTakeExam && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className={cn("rounded-[3rem] p-8 w-full max-w-2xl border shadow-2xl relative", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200")}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/30">
                  <Timer className="text-red-500" size={24} />
                </div>
                <div>
                  <h2 className={cn("text-xl font-black", isDark ? "text-white" : "text-gray-900")}>{showTakeExam.title}</h2>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{t.proctoredSession}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="relative w-24 h-16 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                    {mediaStreams.camera ? (
                      <video ref={cameraRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <Camera size={14} className="text-[#FF6D00] animate-pulse" />
                        <span className="text-[7px] text-gray-400 font-bold uppercase mt-1">SIMULATING</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1 rounded text-[8px] text-white flex items-center gap-1 font-bold">
                      <Camera size={8} /> Cam
                    </div>
                  </div>
                  <div className="relative w-24 h-16 bg-zinc-900 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                    {mediaStreams.screen ? (
                      <video ref={screenRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-1">
                        <Video size={14} className="text-[#FFD54F] animate-pulse" />
                        <span className="text-[7px] text-gray-400 font-bold uppercase mt-1">SIMULATING</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1 rounded text-[8px] text-white flex items-center gap-1 font-bold">
                      <Video size={8} /> Screen
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white tabular-nums">{formatTime(examState.timeLeft)}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.timeRemaining}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                <span>{language === 'hi' ? 'प्रश्न' : 'Question'} {examState.currentQuestionIndex + 1} {language === 'hi' ? 'कुल' : 'of'} {showTakeExam.questions.length}</span>
                <span>{Math.round(((examState.currentQuestionIndex + 1) / showTakeExam.questions.length) * 100)}% {language === 'hi' ? 'पूर्ण' : 'Complete'}</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] transition-all duration-500" 
                  style={{ width: `${((examState.currentQuestionIndex + 1) / showTakeExam.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-10">
              <h3 className={cn("text-xl font-bold mb-6 leading-relaxed", isDark ? "text-white" : "text-gray-900")}>
                {showTakeExam.questions[examState.currentQuestionIndex].question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {showTakeExam.questions[examState.currentQuestionIndex].options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAns = [...examState.answers];
                      newAns[examState.currentQuestionIndex] = idx;
                      setExamState({ ...examState, answers: newAns });
                    }}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between group",
                      examState.answers[examState.currentQuestionIndex] === idx
                        ? "bg-[#FF6D00]/20 border-[#FF6D00] text-[#FFD54F]"
                        : (isDark ? "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100")
                    )}
                  >
                    <span>{opt}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all",
                      examState.answers[examState.currentQuestionIndex] === idx
                        ? "bg-[#FF6D00] border-[#FF6D00] scale-110"
                        : "border-gray-500 group-hover:border-gray-400"
                    )} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={examState.currentQuestionIndex === 0}
                onClick={() => setExamState({ ...examState, currentQuestionIndex: examState.currentQuestionIndex - 1 })}
                className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-sm hover:bg-white/10 transition-all disabled:opacity-20"
              >
                {t.prevQuestion}
              </button>
              {examState.currentQuestionIndex === showTakeExam.questions.length - 1 ? (
                <button
                  onClick={finishExam}
                  className="flex-[2] py-4 bg-gradient-to-r from-[#00E676] to-[#69F0AE] text-black rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all"
                >
                  {t.submitExam}
                </button>
              ) : (
                <button
                  onClick={() => setExamState({ ...examState, currentQuestionIndex: examState.currentQuestionIndex + 1 })}
                  className="flex-[2] py-4 bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] text-black rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all"
                >
                  {t.nextQuestion}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={cn("rounded-3xl p-6 w-full max-w-sm border shadow-2xl", isDark ? "bg-[#121212] border-white/10" : "bg-white border-gray-200")}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="text-red-500" size={32} />
            </div>
            <h3 className={cn("text-xl font-black text-center mb-2", isDark ? "text-white" : "text-gray-900")}>Delete Account</h3>
            <p className="text-gray-500 text-sm text-center mb-6">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
            {deleteError && <p className="text-red-500 text-xs text-center mb-4">{deleteError}</p>}
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <SectionAiAgent section="pathshala" />
    </div>
  );
}
