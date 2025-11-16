"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Note, useDashboard } from "@/contexts/DashboardContext";

interface NoteFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** optional → if provided it's EDIT mode */
  initialData?: Note | null;
}

const defaultNote: Note = {
  title: "",
  content: "",
  tags: [""],
};

export default function IdentityForm({
  isOpen,
  onOpenChange,
  initialData,
}: NoteFormProps) {
  const { setNotes } = useDashboard();
  const isEditing = Boolean(initialData?._id);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Note>(defaultNote);

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/notes/${initialData!._id}/edit-note`
        : `/api/notes`;

      console.log(formData);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();

      setNotes((prev: Note[]) => {
        if (isEditing) {
          return prev.map((item) =>
            item._id === data.data._id ? data.data : item
          );
        }
        return [...prev, data.data];
      });

      toast.success(isEditing ? "Identity updated!" : "Identity created!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
      setFormData(defaultNote);
    }
  };

  const handleChange = (key: keyof Note, value: string) => {
    const updatedValue = key === "tags" ? value.split(",") : value;
    setFormData((prev: Note) => ({ ...prev, [key]: updatedValue }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-lg max-h-[80vh] sm:max-h-[96vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2">
          {isEditing ? "Edit Note" : "Add New Note"}
        </DialogTitle>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          {/* Title */}
          <Input
            name="title"
            placeholder="Note Title"
            required
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Content */}
          <Textarea
            name="content"
            placeholder="Write your note here..."
            required
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 h-32 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Tags */}
          <Input
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <DialogFooter className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-gray-200 hover:bg-gray-300 text-dark-a0 rounded-lg"
            >
              <XCircle size={16} className="mr-1" /> Cancel
            </Button>

            <Button
              type="submit"
              disabled={!formData.title || !formData.content}
              className="bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {isEditing ? "Update" : "Save"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
