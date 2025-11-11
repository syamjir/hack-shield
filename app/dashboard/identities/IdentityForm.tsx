"use client";

import { useState } from "react";
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
}

export default function IdentityForm({
  isOpen,
  onOpenChange,
}: IdentityFormProps) {
  const { setIdentities } = useDashboard();
  const [isSaving, setIsSaving] = useState(false);
  const [newIdentity, setNewIdentity] = useState<Identity>({
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

  const saveIdentity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newIdentity.fullName || !newIdentity.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch("/api/identities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIdentity),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      setIdentities((prev: Identity[]) => [...prev, data.data]);

      setNewIdentity({
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
      toast.success("Identity saved successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-lg max-h-[80vh] sm:max-h-[96vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2">
          Add New Identity
        </DialogTitle>

        <form onSubmit={saveIdentity} className="space-y-4 py-2">
          <Input
            name="fullName"
            placeholder="Full Name"
            required
            value={newIdentity.fullName}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, fullName: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={newIdentity.email}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, email: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            name="phone"
            placeholder="Phone Number (optional)"
            value={newIdentity.phone}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, phone: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            name="address"
            placeholder="Address (optional)"
            value={newIdentity.address}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, address: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="city"
              placeholder="City (optional)"
              value={newIdentity.city}
              onChange={(e) =>
                setNewIdentity({ ...newIdentity, city: e.target.value })
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <Input
              name="state"
              placeholder="State (optional)"
              value={newIdentity.state}
              onChange={(e) =>
                setNewIdentity({ ...newIdentity, state: e.target.value })
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="postalCode"
              placeholder="Postal Code (optional)"
              value={newIdentity.postalCode}
              onChange={(e) =>
                setNewIdentity({ ...newIdentity, postalCode: e.target.value })
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <Input
              name="country"
              placeholder="Country (optional)"
              value={newIdentity.country}
              onChange={(e) =>
                setNewIdentity({ ...newIdentity, country: e.target.value })
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
          </div>

          <Input
            name="company"
            placeholder="Company (optional)"
            value={newIdentity.company}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, company: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Input
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth (optional)"
            value={newIdentity.dateOfBirth}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, dateOfBirth: e.target.value })
            }
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <Textarea
            name="notes"
            placeholder="Notes (optional)"
            value={newIdentity.notes}
            onChange={(e) =>
              setNewIdentity({ ...newIdentity, notes: e.target.value })
            }
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
              disabled={!newIdentity.fullName || !newIdentity.email}
              className="bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-1" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-1" /> Save
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
