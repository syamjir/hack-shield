"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Notebook } from "lucide-react";
import { toast } from "sonner";
import { useDashboard } from "@/contexts/DashboardContext";
import type { INote } from "./NotesServer";
import { useEffect, useState } from "react";
import { moveNoteToBin } from "./notesServerActions";
import NoteForm from "./NoteForm";

type NotesClientProps = {
  notesFromDB: INote[];
  binDataFromDB: INote[];
};

export default function NotesClient({
  notesFromDB,
  binDataFromDB,
}: NotesClientProps) {
  const { setNotes, setBins, notes } = useDashboard();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

  // Initialize context state with fetched data
  // (This runs only once when the client mounts)
  useEffect(() => {
    setNotes(notesFromDB);
    setBins((prev) => ({ ...prev, notes: binDataFromDB }));
  }, [notesFromDB, binDataFromDB, setNotes, setBins]);

  const handleEdit = (note: INote) => {
    setNoteToEdit(note);
    setEditModalOpen(true);
  };

  const moveToBin = async (id: string) => {
    const deleted = notes.find((i) => i._id === id);
    if (!deleted) return;
    try {
      const data = await moveNoteToBin(id);
      const deleted = data.data;
      if (!deleted) return;

      setNotes((prev) => prev.filter((i) => i._id !== id));
      setBins((prev) => ({
        ...prev,
        notes: [...prev.notes, deleted],
      }));
      toast.success(data.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          No notes found. Add new ones to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {notes.map((note, i) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-a10 rounded-3xl p-6 flex flex-col justify-between border border-surface-a20 hover:shadow-2xl transition-transform hover:scale-102"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-info-a20/10 text-info-a10 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <Notebook size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-dark-a0/90 text-xl">
                  {note.title}
                </h3>
                <p className="text-dark-a0/50 text-sm">
                  {note.createdAt &&
                    new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Full Details */}
            <div className="text-dark-a0/70 text-sm space-y-3">
              {/* content */}
              <p className="italic text-dark-a0/80 leading-relaxed">
                {note.content}
              </p>

              {/* tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-primary-a20 text-white rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-4">
              <Edit
                className="text-green-500 hover:text-green-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => handleEdit(note)}
              />

              <Trash2
                className="text-red-500 hover:text-red-600 transition-transform hover:scale-110 cursor-pointer"
                size={16}
                onClick={() => moveToBin(note._id!)}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Note Form Modal */}
      <NoteForm
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={noteToEdit}
      />
    </div>
  );
}
