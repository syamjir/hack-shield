import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Edit, Trash2 } from "lucide-react";

export default function PasswordTable({
  title,
  passwords,
  setPasswords,
  setBin,
}) {
  const [visibleId, setVisibleId] = useState<number | null>(null);

  const moveToBin = (id) => {
    const item = passwords.find((p) => p.id === id);

    if (title === "logins") {
      setBin((prev) => ({ ...prev, logins: [...prev.logins, item] }));
      console.log()
      setPasswords((prev) => prev.filter((p) => p.id !== item.id));
    }
    if (title === "identities") {
      setBin((prev) => ({ ...prev, identities: [...prev.identities, item] }));
      setPasswords((prev) => prev.filter((p) => p.id !== item.id));
    }
    if (title === "notes") {
      setBin((prev) => ({ ...prev, notes: [...prev.notes, item] }));
      setPasswords((prev) => prev.filter((p) => p.id !== item.id));
    }
    
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-[var(--surface-a10)]/50 backdrop-blur-md shadow-md">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-[var(--primary-a20)] text-left border-b border-[var(--surface-a20)]">
            <th className="p-4">Site</th>
            <th className="p-4">Username</th>
            <th className="p-4">Password</th>
            <th className="p-4">Strength</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((p, i) => (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="hover:bg-[var(--surface-a10)]/70 transition"
            >
              <td className="p-4 font-semibold">{p.site}</td>
              <td className="p-4">{p.username}</td>
              <td className="p-4 font-mono">
                {visibleId === p.id ? p.password : "••••••••"}
              </td>
              <td
                className={`p-4 ${
                  p.strength === "Strong"
                    ? "text-green-500"
                    : p.strength === "Medium"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {p.strength}
              </td>
              <td className="p-4 flex justify-end gap-3 text-[var(--primary-a20)]">
                {visibleId === p.id ? (
                  <EyeOff
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => setVisibleId(null)}
                  />
                ) : (
                  <Eye
                    className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                    onClick={() => setVisibleId(p.id)}
                  />
                )}
                <Edit className="w-4 h-4 cursor-pointer hover:scale-110 transition" />
                <Trash2
                  className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                  onClick={() => moveToBin(p.id)}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
