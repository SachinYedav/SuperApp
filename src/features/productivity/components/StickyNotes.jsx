import React, { useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button, ConfirmModal } from "@/components/ui/index";
import NoteCard from "./shared/NoteCard";
import { NOTE_COLORS } from "../constants";

export default function StickyNotes() {
  const [notes, setNotes] = useLocalStorage("prod_notes", []);
  const [deleteId, setDeleteId] = useState(null);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "",
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      date: new Date().toLocaleDateString(),
    };
    setNotes([newNote, ...notes]);
  };

  const updateNote = (id, text) =>
    setNotes(notes.map((n) => (n.id === id ? { ...n, text } : n)));

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setNotes(notes.filter((n) => n.id !== deleteId));
      setDeleteId(null); // Modal close
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Note?"
        message="Are you sure? This action cannot be undone."
        type="danger"
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Sticky Wall
          </h2>
          <p className="text-xs text-slate-500">Capture quick thoughts.</p>
        </div>
        <Button onClick={addNote} size="sm" className="gap-2">
          <Plus size={18} /> New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <StickyNote size={64} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Your wall is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={() => handleDeleteClick(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
