"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NotesSection() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Server Credentials", content: "Admin: root / pass123" },
  ]);

  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const addNote = () => {
    if (!newNote.title || !newNote.content) return;
    setNotes([...notes, { ...newNote, id: Date.now() }]);
    setNewNote({ title: "", content: "" });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary-a20)]">
            Secure Notes
          </h2>
          <p className="text-sm text-[var(--surface-a40)]">
            Save sensitive notes and information securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--surface-a0)] border-[var(--surface-a20)] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[var(--primary-a20)]">
                Add New Note
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <Textarea
                placeholder="Write your secure note here..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none h-32"
              />
            </div>

            <DialogFooter>
              <Button
                onClick={addNote}
                className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-lg"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 text-[var(--surface-a40)] w-4 h-4" />
        <Input
          type="text"
          placeholder="Search notes..."
          className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-xl"
        />
      </div>

      {/* Notes List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)]"
          >
            <h3 className="font-semibold mb-1">{note.title}</h3>
            <p className="text-sm text-[var(--surface-a40)] line-clamp-3">
              {note.content}
            </p>
            <div className="flex gap-2 mt-3">
              <Eye className="w-4 h-4 cursor-pointer" />
              <Edit className="w-4 h-4 cursor-pointer" />
              <Trash2 className="w-4 h-4 cursor-pointer text-red-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
