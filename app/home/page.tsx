"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, KeyRound, Lock, Smartphone, Eye, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/ui/Footer";
import { useRef } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const featureRef = useRef<HTMLDivElement>(null);
  function scrollToFeatures() {
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <main className="min-h-screen bg-surface-a0 text-dark-a0 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full max-w-6xl flex justify-between items-center py-6 px-6 backdrop-blur-md bg-surface-a10 rounded-2xl mt-6 shadow-md">
        {/* Logo */}
        <motion.h1
          className="text-3xl font-extrabold text-primary-a20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🔐 PassKeeper
        </motion.h1>

        {/* Navigation Buttons */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Show when signed out */}

          <Link href="/login">
            <Button
              variant="outline"
              className="border-primary-a20 text-primary-a30 hover:bg-primary-a10/20 transition-all"
            >
              Login to Dashboard
            </Button>
          </Link>

          <Link href="/signup">
            <Button className="bg-primary-a20 hover:bg-primary-a10 text-surface-a0 transition-all">
              Get Started
            </Button>
          </Link>

          {/* Show when signed in */}
          <SignedIn>
            <div className="flex items-center border-2 border-primary-a20 rounded-full hover:scale-105 transition-transform ease-in">
              <UserButton  />
            </div>
          </SignedIn>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full px-6 mt-28 mb-32">
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-5xl font-bold leading-tight text-primary-a30">
            Your Passwords, <br />
            <span className="text-primary-a10">Protected Forever</span>
          </h2>
          <p className="text-lg text-dark-a0 max-w-lg mx-auto md:mx-0">
            Store, organize, and access your passwords securely with end-to-end
            encryption — all in one place.
          </p>

          <Link href="/dashboard">
            <Button
              size="lg"
              className="mt-4 bg-primary-a20 hover:bg-primary-a10 text-surface-a0"
            >
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Floating Icon Image */}
        <motion.div
          className="relative mt-10 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
            alt="Password Security"
            width={320}
            height={320}
            className="drop-shadow-2xl rounded-2xl"
          />

          {/* Floating glow icons */}
          <motion.div
            className="absolute -top-8 -right-8 bg-primary-a20/20 p-3 rounded-full backdrop-blur-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Shield className="text-primary-a20 w-6 h-6" />
          </motion.div>

          <motion.div
            className="absolute bottom-0 -left-8 bg-primary-a20/20 p-3 rounded-full backdrop-blur-lg"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
          >
            <KeyRound className="text-primary-a20 w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featureRef} className="mt-18 mb-32 max-w-6xl w-full px-6">
        <h2 className="text-3xl font-bold text-primary-a30 text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Lock className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Encrypted Storage",
              desc: "Industry-standard AES-256 encryption keeps your credentials safe.",
            },
            {
              icon: <Shield className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Auto Lock",
              desc: "Your vault automatically locks after inactivity for added safety.",
            },
            {
              icon: <KeyRound className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Strong Generator",
              desc: "Generate unique, complex passwords with a single click.",
            },
            {
              icon: <Eye className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Zero-Knowledge Security",
              desc: "Only you can access your passwords; even we can’t see them.",
            },
            {
              icon: <Smartphone className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Cross-Device Sync",
              desc: "Your passwords sync instantly across your devices.",
            },
            {
              icon: <Server className="w-10 h-10 mb-3 text-primary-a20" />,
              title: "Multi-Platform Support",
              desc: "Access your vault from web, mobile, and desktop applications seamlessly.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-2xl bg-surface-a10 backdrop-blur-md border border-primary-a20/20 hover:border-primary-a30/30 transition"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2 text-primary-a20">
                {feature.title}
              </h3>
              <p className="text-sm text-dark-a0">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center rounded-xl mt-18 mb-32 max-w-6xl py-24 bg-surface-tonal-a10/60 backdrop-blur-xl w-full px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary-a20">
          Start Securing Your Passwords Today
        </h2>
        <p className="text-dark-a0 mt-3">
          Create your free vault and never worry about password leaks again.
        </p>
        <Link href="/signup">
          <Button className="mt-6 bg-primary-a20 hover:bg-primary-a10 text-surface-a0">
            Create Your Vault
          </Button>
        </Link>
      </motion.section>

      {/* Testimonials Section */}
      <section className="mt-18 mb-32 max-w-7xl w-full px-6">
        <h2 className="text-3xl font-bold text-primary-a30 text-center mb-12">
          Trusted by Thousands
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Alice W.",
              feedback:
                "PassKeeper changed the way I handle passwords. Super secure and easy to use!",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              name: "John D.",
              feedback:
                "Auto-lock and sync features give me peace of mind everywhere.",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Sophie L.",
              feedback:
                "I love the password generator — strong and unique passwords every time!",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-surface-a10/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-md flex flex-col items-center"
            >
              <Image
                src={t.avatar}
                alt={t.name}
                width={60}
                height={60}
                className="rounded-full mb-4 border-2 border-primary-a20"
              />
              <p className="text-dark-a0 mb-4">{t.feedback}</p>
              <h4 className="font-semibold text-primary-a20">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer onScrollIntoFeatures={scrollToFeatures} />
    </main>
  );
}
