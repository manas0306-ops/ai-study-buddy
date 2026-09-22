import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Plus, Trash2, Pin, Tag, 
  Sparkles, Check, Search, Download, BookOpen, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Notes({ onNavigate }) {
  const { user, addXP, playSound } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit / Create Note form
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('General');

  // File Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    setLoading(true);
    api.getNotes()
      .then(res => {
        setNotes(res);
        if (res.length > 0 && !selectedNote) {
          setSelectedNote(res[0]);
          setTitle(res[0].title);
          setContent(res[0].content);
          setFolder(res[0].folder);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleSelectNote = (n) => {
    setSelectedNote(n);
    setTitle(n.title);
    setContent(n.content);
    setFolder(n.folder);
    setIsEditing(false);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) return;
    try {
      if (selectedNote && selectedNote.id) {
        await api.updateNote(selectedNote.id, { title, content, folder });
      } else {
        await api.createNote({ title, content, folder, user_id: user.id });
      }
      setIsEditing(false);
      fetchNotes();
      playSound('success');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.deleteNote(id);
      setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);
    try {
      const res = await api.uploadDocument(file);
      setUploadResult(res);
      addXP(35);
      playSound('level_up');
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Notes & Document Learning 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload PDF/DOCX lecture slides or write markdown notes with automatic AI study pack generation.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Analyzing Document...' : 'Upload PDF / DOCX'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          <button
            onClick={() => {
              setSelectedNote({ id: null, title: 'New Study Note', content: '', folder: 'General' });
              setTitle('New Study Note');
              setContent('');
              setFolder('General');
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Document Upload Result Notification */}
      {uploadResult && (
        <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-4 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-black text-sm text-indigo-900 dark:text-indigo-200">
                Document Study Pack Extracted: {uploadResult.filename}
              </h3>
            </div>
            <button
              onClick={() => setUploadResult(null)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {uploadResult.summary}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onNavigate('flashcards')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Practice Extracted Flashcards</span>
            </button>
            <button
              onClick={() => onNavigate('quizzes')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-xs flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Take Extracted Quiz</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Split View: Notes List vs Note Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 space-y-2 overflow-y-auto max-h-[600px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Your Notes ({notes.length})
          </h3>

          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelectNote(n)}
              className={`w-full p-3.5 rounded-2xl text-left border transition ${
                selectedNote?.id === n.id
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-white'
                  : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate max-w-[180px]">{n.title}</span>
                {n.is_pinned && <Pin className="w-3 h-3 text-indigo-500 fill-indigo-500" />}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-mono">
                {n.content?.slice(0, 60) || 'Empty note'}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                <span>{n.folder}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Editor / Preview (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
          {selectedNote ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="text-lg font-black text-slate-900 dark:text-white bg-transparent focus:outline-none flex-1 mr-4"
                />

                <div className="flex items-center gap-2">
                  {selectedNote.id && (
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Note Content Editor */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your study notes in Markdown or paste textbook excerpts here..."
                className="w-full flex-1 min-h-[350px] bg-transparent text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm resize-none focus:outline-none leading-relaxed"
              />
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select or create a note to begin learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
