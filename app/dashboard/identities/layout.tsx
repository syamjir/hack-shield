"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Plus, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Tab {
  name: string;
  href: string;
  icon?: React.ReactNode; // Optional icon for modern look
}

interface IdentitiesLayoutProps {
  children: React.ReactNode;
}

export default function IdentitiesLayout({ children }: IdentitiesLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pathname = usePathname();

  const tabs: Tab[] = [
    { name: "Identities", href: "/dashboard/identities" },
    { name: "Bin", href: "/dashboard/identities/bin" },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const identity = Object.fromEntries(formData.entries());
    console.log("New identity added:", identity);

    // TODO: call your API endpoint here
    setIsModalOpen(false);
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-3">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center ">
        <div>
          <h2 className="text-2xl font-bold text-primary-a20">Identities</h2>
          <p className="text-sm text-dark-a0/50">
            Manage your saved identity details.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex items-center justify-center gap-2",
            "w-full sm:w-auto",
            "bg-primary-a20 hover:bg-primary-a10 text-white",
            "px-4 py-2 rounded-lg text-sm font-medium mt-4 mb-2",
            "transition-all duration-200 shadow-md active:scale-[0.98]"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Add Identity</span>
        </Button>
      </div>

      {/* Sub-navigation */}
      <nav
        className="flex flex-wrap gap-1 sm:gap-4 bg-surface-a10 rounded-xl p-1 px-1 shadow-inner w-fit"
        aria-label="Identities sub-navigation"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-surface-a10 text-dark-a0 shadow-lg border-1 "
                  : "text-dark-a0 "
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon && <span className="text-base">{tab.icon}</span>}
              {tab.name}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      <main className="w-full">{children}</main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className={cn(
            "bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-lg",
            "sm:max-h-[96vh] max-h-[80vh] overflow-y-auto" // ✅ scrollable on mobile
          )}
        >
          <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2">
            Add New Identity
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <Input
              name="fullName"
              placeholder="Full Name"
              required
              //   value={newIdentity.fullName}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, fullName: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              //   value={newIdentity.email}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, email: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <Input
              name="phone"
              placeholder="Phone Number (optional)"
              //   value={newIdentity.phone}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, phone: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <Input
              name="address"
              placeholder="Address (optional)"
              //   value={newIdentity.address}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, address: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                name="city"
                placeholder="City (optional)"
                // value={newIdentity.city}
                // onChange={(e) =>
                //   setNewIdentity({ ...newIdentity, city: e.target.value })
                // }
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />
              <Input
                name="state"
                placeholder="State (optional)"
                // value={newIdentity.state}
                // onChange={(e) =>
                //   setNewIdentity({ ...newIdentity, state: e.target.value })
                // }
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                name="postalCode"
                placeholder="Postal Code (optional)"
                // value={newIdentity.postalCode}
                // onChange={(e) =>
                //   setNewIdentity({
                //     ...newIdentity,
                //     postalCode: e.target.value,
                //   })
                // }
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />
              <Input
                name="country"
                placeholder="Country (optional)"
                // value={newIdentity.country}
                // onChange={(e) =>
                //   setNewIdentity({ ...newIdentity, country: e.target.value })
                // }
                className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
              />
            </div>

            <Input
              name="company"
              placeholder="Company (optional)"
              //   value={newIdentity.company}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, company: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <Input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth (optional)"
              //   value={newIdentity.dateOfBirth}
              //   onChange={(e) =>
              //     setNewIdentity({
              //       ...newIdentity,
              //       dateOfBirth: e.target.value,
              //     })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <Textarea
              name="notes"
              placeholder="Notes (optional)"
              //   value={newIdentity.notes}
              //   onChange={(e) =>
              //     setNewIdentity({ ...newIdentity, notes: e.target.value })
              //   }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />

            <DialogFooter className="flex justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-dark-a0 rounded-lg"
              >
                <XCircle size={16} className="mr-1" /> Cancel
              </Button>

              <Button
                type="submit"
                // disabled={!newIdentity.fullName || !newIdentity.email}
                className="bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-1" />{" "}
                    Saving...
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
    </div>
  );
}
