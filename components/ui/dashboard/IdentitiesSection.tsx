"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IdentitiesSection() {
  const [identities, setIdentities] = useState([
    {
      id: 1,
      name: "Dharmi R",
      email: "dharmi@gmail.com",
      phone: "+91 9876543210",
      address: "Ahmedabad, India",
    },
  ]);

  const [newIdentity, setNewIdentity] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const addIdentity = () => {
    if (!newIdentity.name || !newIdentity.email) return;
    setIdentities([...identities, { ...newIdentity, id: Date.now() }]);
    setNewIdentity({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary-a20)]">
            Identities
          </h2>
          <p className="text-sm text-[var(--surface-a40)]">
            Store your personal information securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Identity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--surface-a0)] border-[var(--surface-a20)] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[var(--primary-a20)]">
                Add New Identity
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Full Name"
                value={newIdentity.name}
                onChange={(e) =>
                  setNewIdentity({ ...newIdentity, name: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <Input
                placeholder="Email"
                value={newIdentity.email}
                onChange={(e) =>
                  setNewIdentity({ ...newIdentity, email: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <Input
                placeholder="Phone"
                value={newIdentity.phone}
                onChange={(e) =>
                  setNewIdentity({ ...newIdentity, phone: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <Input
                placeholder="Address"
                value={newIdentity.address}
                onChange={(e) =>
                  setNewIdentity({ ...newIdentity, address: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
            </div>

            <DialogFooter>
              <Button
                onClick={addIdentity}
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
          placeholder="Search identities..."
          className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-xl"
        />
      </div>

      {/* Identities List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {identities.map((identity) => (
          <div
            key={identity.id}
            className="p-4 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)]"
          >
            <h3 className="font-semibold">{identity.name}</h3>
            <p className="text-sm text-[var(--surface-a40)]">
              {identity.email}
            </p>
            <p className="text-xs text-[var(--surface-a40)]">
              {identity.phone}
            </p>
            <p className="text-xs text-[var(--surface-a40)]">
              {identity.address}
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
