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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { Card, useDashboard } from "@/contexts/DashboardContext";

interface CardFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Card | null;
}

const defaultCard: Card = {
  cardHolder: "",
  bank: "",
  cardNumber: "",
  expiryMonth: 1,
  expiryYear: new Date().getFullYear(),
  cvv: "",
  brand: "",
};

export default function CardForm({
  isOpen,
  onOpenChange,
  initialData,
}: CardFormProps) {
  const { setCards } = useDashboard();
  const isEditing = Boolean(initialData?._id);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Card>(defaultCard);

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.cardHolder ||
      !formData.bank ||
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvv
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/cards/${initialData!._id}/edit-card`
        : `/api/cards`;

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

      setCards((prev: Card[]) => {
        if (isEditing) {
          return prev.map((item) =>
            item._id === data.data._id ? data.data : item
          );
        }
        return [...prev, data.data];
      });

      toast.success(isEditing ? "Card updated!" : "Card created!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
      setFormData(defaultCard);
    }
  };

  const handleChange = (key: keyof Card, value: string | number) => {
    setFormData((prev: Card) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-lg max-h-[80vh] sm:max-h-[96vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2">
          {isEditing ? "Edit Card" : "Add New Card"}
        </DialogTitle>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          {/* Card Holder */}
          <Input
            name="cardHolder"
            placeholder="Card Holder Name"
            required
            value={formData.cardHolder}
            onChange={(e) => handleChange("cardHolder", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Bank */}
          <Input
            name="bank"
            placeholder="Bank Name"
            required
            value={formData.bank}
            onChange={(e) => handleChange("bank", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Card Number */}
          <Input
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            required
            maxLength={19}
            value={formData.cardNumber
              .replace(/\D/g, "")
              .replace(/(.{4})/g, "$1 ")
              .trim()}
            onChange={(e) => {
              // store only digits
              const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
              handleChange("cardNumber", digits);
            }}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0 tracking-widest"
            inputMode="numeric"
          />

          {/* Expiry Month & Year */}
          <div className="flex gap-2">
            <Input
              name="expiryMonth"
              type="number"
              placeholder="MM"
              min={1}
              max={12}
              required
              value={formData.expiryMonth}
              onChange={(e) =>
                handleChange("expiryMonth", Number(e.target.value))
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
            <Input
              name="expiryYear"
              type="number"
              placeholder="YYYY"
              min={new Date().getFullYear()}
              required
              value={formData.expiryYear}
              onChange={(e) =>
                handleChange("expiryYear", Number(e.target.value))
              }
              className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
            />
          </div>

          {/* CVV */}
          <Input
            name="cvv"
            placeholder="CVV"
            type="password"
            required
            value={formData.cvv}
            onChange={(e) => handleChange("cvv", e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {/* Brand */}
          <div className="relative">
            <Select
              value={formData.brand}
              onValueChange={(value: string) => handleChange("brand", value)}
            >
              <SelectTrigger className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0 w-full">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent className="bg-surface-a20 text-dark-a0 rounded-md">
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="MasterCard">MasterCard</SelectItem>
                <SelectItem value="Amex">American Express</SelectItem>
                <SelectItem value="Discover">Discover</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              disabled={
                !formData.cardHolder ||
                !formData.bank ||
                !formData.cardNumber ||
                !formData.expiryMonth ||
                !formData.expiryYear ||
                !formData.cvv
              }
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
