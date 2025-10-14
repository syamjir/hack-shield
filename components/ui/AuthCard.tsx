"use client";
import { motion } from "framer-motion";

export default function AuthCard({ title, subtitle, children }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="relative backdrop-blur-xl bg-both-white-a0/5 border border-primary-a0/10 shadow-xl rounded-2xl px-8 py-12 max-w-md w-full text-center"
    >
      <h1 className="text-3xl font-bold text-primary-a20 mb-2">{title}</h1>
      {subtitle && <p className="text-dark-a0/70 text-sm mb-6">{subtitle}</p>}
      {children}
    </motion.div>
  );
}
