"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { restoreNote, deleteNoteForever } from "./binServerActions";
import { Note } from "@/contexts/DashboardContext";

type IdentitiesBinClientProps = {
  binNotesFromDB: Note[];
};

export default function NoteBinClient({
  binNotesFromDB,
}: IdentitiesBinClientProps) {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { setBins, bins, setNotes } = useDashboard();

  useEffect(() => {
    setBins((prev) => ({ ...prev, notes: binNotesFromDB }));
  }, [binNotesFromDB, setBins]);

  const handleRestore = async (id: string) => {
    try {
      setRestoringId(id);
      const data = await restoreNote(id);

      setNotes((prev) => {
        const exists = prev.some((p) => p._id === data.data._id);
        return exists ? prev : [...prev, data.data];
      });

      setBins((prev) => ({
        ...prev,
        notes: prev.notes.filter((p) => p._id !== data.data._id),
      }));

      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setRestoringId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteId(id);
      const data = await deleteNoteForever(id);
      setBins((prev) => ({
        ...prev,
        notes: prev.notes.filter((p) => p._id !== data.data._id),
      }));

      toast.success(data.message);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteId(null);
    }
  };

  if (bins.notes.length === 0)
    return (
      <div className="p-6">
        <p className="text-gray-500">No deleted notes.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
      {bins.notes.map((note) => (
        <div
          key={note._id}
          className="bg-surface-a10/60 rounded-xl p-5 shadow-sm hover:shadow-md border border-surface-a20 transition-transform hover:scale-102"
        >
          <h3 className="font-semibold text-lg text-primary-a20">
            {note.title}
          </h3>
          {note.content && (
            <p className="text-sm text-dark-a0/70 mt-1">{note.content}</p>
          )}
          {note.tags && note.tags.length > 0 && (
            <p className="text-xs text-dark-a0/50 mt-2">
              Tags: {note.tags.join(", ")}
            </p>
          )}

          <div className="flex justify-end mt-4 gap-4">
            <button
              onClick={() => {
                if (note._id) {
                  handleRestore(note._id);
                }
              }}
              disabled={restoringId === note._id}
              className="text-success-a10 hover:text-success-a20 text-sm flex items-center gap-1 hover:scale-105 transition cursor-pointer"
            >
              <RotateCcw size={14} />
              {restoringId === note._id ? "Restoring..." : "Restore"}
            </button>

            <button
              onClick={() => {
                if (note._id) {
                  handleDelete(note._id);
                }
              }}
              disabled={deleteId === note._id}
              className="text-danger-a0 hover:text-danger-a10 hover:scale-105 cursor-pointer text-sm flex transition items-center gap-1"
            >
              <Trash2 size={14} />
              {deleteId === note._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
