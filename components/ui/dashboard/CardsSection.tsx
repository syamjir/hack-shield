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

export default function CardsSection() {
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Personal Visa",
      number: "**** **** **** 1234",
      expiry: "12/28",
    },
  ]);

  const [newCard, setNewCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const addCard = () => {
    if (!newCard.name || !newCard.number) return;
    setCards([...cards, { ...newCard, id: Date.now() }]);
    setNewCard({ name: "", number: "", expiry: "", cvv: "" });
  };

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary-a20)]">
            Cards Vault
          </h2>
          <p className="text-sm text-[var(--surface-a40)]">
            Store and manage your payment cards securely.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[var(--primary-a20)] hover:bg-[var(--primary-a30)] text-white rounded-xl flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--surface-a0)] border-[var(--surface-a20)] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[var(--primary-a20)]">
                Add New Card
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Card Name (e.g. Personal Visa)"
                value={newCard.name}
                onChange={(e) =>
                  setNewCard({ ...newCard, name: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <Input
                placeholder="Card Number"
                value={newCard.number}
                onChange={(e) =>
                  setNewCard({ ...newCard, number: e.target.value })
                }
                className="bg-[var(--surface-a10)] border-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Expiry Date (MM/YY)"
                  value={newCard.expiry}
                  onChange={(e) =>
                    setNewCard({ ...newCard, expiry: e.target.value })
                  }
                  className="bg-[var(--surface-a10)] border-none"
                />
                <Input
                  placeholder="CVV"
                  type="password"
                  value={newCard.cvv}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cvv: e.target.value })
                  }
                  className="bg-[var(--surface-a10)] border-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={addCard}
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
          placeholder="Search cards..."
          className="pl-9 bg-[var(--surface-a10)] border-none focus-visible:ring-[var(--primary-a20)] rounded-xl"
        />
      </div>

      {/* Cards List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-4 rounded-xl bg-[var(--surface-a10)] border border-[var(--surface-a20)] flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{card.name}</h3>
              <p className="text-sm text-[var(--surface-a40)]">
                {card.number}
              </p>
              <p className="text-xs text-[var(--surface-a40)]">
                Exp: {card.expiry}
              </p>
            </div>
            <div className="flex gap-2">
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
