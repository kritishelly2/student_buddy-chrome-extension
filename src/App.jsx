import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  CheckSquare, 
  StickyNote, 
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0, isRunning: false, mode: 'study' });
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('studentBuddy_tasks');
    const savedNotes = localStorage.getItem('studentBuddy_notes');
    const savedSessions = localStorage.getItem('studentBuddy_sessions');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedSessions) setStudySessions(JSON.parse(savedSessions));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('studentBuddy_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studentBuddy_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('studentBuddy_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              // Timer finished
              const newSession = {
                id: Date.now(),
                date: new Date().toISOString(),
                duration: prev.mode === 'study' ? 25 : 5,
                type: prev.mode
              };
              setStudySessions(sessions => [...sessions, newSession]);
              
              toast({
                title: `${prev.mode === 'study' ? 'Study' : 'Break'} session completed!`,
                description: `Great job! Time for a ${prev.mode === 'study' ? 'break' : 'study session'}.`,
              });
              
              return {
                minutes: prev.mode === 'study' ? 5 : 25,
                seconds: 0,
                isRunning: false,
                mode: prev.mode === 'study' ? 'break' : 'study'
              };
            }
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, toast]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
      toast({
        title: "Task added!",
        description: "Your new task has been added to your list.",
      });
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Task has been removed from your list.",
    });
  };

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date().toISOString()
      };
      setNotes([...notes, note]);
      setNewNote({ title: '', content: '' });
      toast({
        title: "Note saved!",
        description: "Your note has been added successfully.",
      });
    }
  };

  const updateNote = (id, updatedNote) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    ));
    setEditingNote(null);
    toast({
      title: "Note updated!",
      description: "Your changes have been saved.",
    });
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "Note has been removed.",
    });
  };

  const startTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimer({ minutes: 25, seconds: 0, isRunning: false, mode: 'study' });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalStudyTime = studySessions
    .filter(session => session.type === 'study')
    .reduce((total, session) => total + session.duration, 0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'timer', label: 'Study Timer', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Helmet>
        <title>Student Buddy - Your Study Companion</title>
        <meta name="description" content="A comprehensive study companion with task management, note-taking, and productivity tools for students." />
      </Helmet>
      
      <div className="container mx-auto p-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Student Buddy
          </h1>
          <p className="text-purple-200">Your ultimate study companion</p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <CheckSquare className="w-8 h-8 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Tasks</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{completedTasks}/{tasks.length}</div>
                <p className="text-purple-200">Completed today</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <StickyNote className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Notes</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{notes.length}</div>
                <p className="text-purple-200">Total notes</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Study Time</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{totalStudyTime}m</div>
                <p className="text-purple-200">This session</p>
              </div>

              <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {studySessions.slice(-3).map((session) => (
                    <div key={session.id} className="flex items-center gap-3 text-purple-200">
                      <Clock className="w-4 h-4" />
                      <span>
                        {session.type === 'study' ? 'Study' : 'Break'} session - {session.duration} minutes
                      </span>
                      <span className="text-sm opacity-70">
                        {new Date(session.date).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {studySessions.length === 0 && (
                    <p className="text-purple-300">No study sessions yet. Start your first session!</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tasks */}
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Task Manager</h2>
              
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <Button onClick={addTask} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      {task.completed && <CheckSquare className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-purple-300' : 'text-white'}`}>
                      {task.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-purple-300 py-8">No tasks yet. Add your first task above!</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Notes</h2>
                
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your note here..."
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <Button onClick={addNote} className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                  >
                    {editingNote === note.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          defaultValue={note.title}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateNote(note.id, { title: e.target.value });
                            }
                          }}
                        />
                        <textarea
                          defaultValue={note.content}
                          rows={4}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                              updateNote(note.id, { content: e.target.value });
                            }
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const titleInput = document.querySelector(`input[defaultValue="${note.title}"]`);
                              const contentInput = document.querySelector(`textarea[defaultValue="${note.content}"]`);
                              updateNote(note.id, {
                                title: titleInput.value,
                                content: contentInput.value
                              });
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNote(null)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-white mb-2">{note.title}</h3>
                        <p className="text-purple-200 text-sm mb-3 line-clamp-3">{note.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-purple-300">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingNote(note.id)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNote(note.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
                {notes.length === 0 && (
                  <div className="md:col-span-2 lg:col-span-3 text-center text-purple-300 py-8">
                    No notes yet. Create your first note above!
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Study Timer */}
          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Pomodoro Timer</h2>
              
              <div className="mb-8">
                <div className={`text-6xl font-bold mb-4 ${
                  timer.mode === 'study' ? 'text-blue-400' : 'text-green-400'
                }`}>
                  {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                </div>
                <div className={`text-xl font-semibold ${
                  timer.mode === 'study' ? 'text-blue-300' : 'text-green-300'
                }`}>
                  {timer.mode === 'study' ? 'Study Time' : 'Break Time'}
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {!timer.isRunning ? (
                  <Button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-3"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">How it works:</h3>
                <ul className="text-purple-200 text-left space-y-2">
                  <li>• 25 minutes of focused study time</li>
                  <li>• 5 minutes of break time</li>
                  <li>• Repeat the cycle for maximum productivity</li>
                  <li>• Stay focused and avoid distractions</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;