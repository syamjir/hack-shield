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
import { Identity, useDashboard } from "@/contexts/DashboardContext";

interface IdentityFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  /** optional → if provided it's EDIT mode */
  initialData?: Identity | null;
}

export default function IdentityForm({
  isOpen,
  onOpenChange,
  initialData,
}: IdentityFormProps) {
  const { setIdentities } = useDashboard();
  const isEditing = Boolean(initialData?._id);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Identity>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    company: "",
    dateOfBirth: "",
    notes: "",
  });

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/identities/${initialData!._id}/edit-identity`
        : `/api/identities`;

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

      setIdentities((prev: Identity[]) => {
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
    }
  };

  const handleChange = (key: keyof Identity, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-lg max-h-[80vh] sm:max-h-[96vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2">
          {isEditing ? "Edit Identity" : "Add New Identity"}
        </DialogTitle>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <Input
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <Input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <Input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
          </div>

          <Input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
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
              disabled={!formData.fullName || !formData.email}
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
