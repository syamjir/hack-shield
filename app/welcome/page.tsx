"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, KeyRound, LogIn, UserPlus, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";

export default function VerifySuccessPage() {
  const router = useRouter();
  const { openSignIn } = useClerk();

  useEffect(() => {
    //  auto redirect to login
    const timer = setTimeout(() => {
      openSignIn();
    }, 7000);
    return () => clearTimeout(timer);
  }, [openSignIn]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-surface-a0 text-light-a0 px-6">
      {/* Background floating elements */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 left-10 text-primary-a20/50"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Shield size={48} />
        </motion.div>

        <motion.div
          className="absolute bottom-28 right-16 text-primary-a20/40"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Lock size={44} />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 text-primary-a20/30"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <KeyRound size={60} />
        </motion.div>
      </motion.div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative backdrop-blur-xl bg-both-white-a0/5 border  dark:border-light-a0/90 shadow-xl rounded-2xl px-8 py-12 max-w-lg w-full text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-primary-a20 mb-3"
        >
          Welcome to PassKeeper 🔐
        </motion.h1>

        <p className="text-dark-a0/70 text-sm max-w-md mx-auto leading-relaxed">
          You’ve successfully verified your identity. Step into your secure
          digital vault — where your passwords stay safe and your privacy
          matters.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <SignInButton mode="modal">
            <Button className="flex items-center justify-center gap-2 bg-primary-a20 hover:bg-primary-a30 text-light-a0 rounded-xl w-full sm:w-auto shadow-lg">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 border-primary-a20 text-primary-a20 hover:bg-light-a0/10 rounded-xl w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </SignUpButton>

          <Button
            onClick={() => router.push("/demo-home")}
            variant="ghost"
            className="flex items-center justify-center gap-2 text-dark-a0/80 hover:text-primary-a20 rounded-xl w-full sm:w-auto"
          >
            <Home className="w-4 h-4" /> Demo Home
          </Button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-xs text-dark-a0/60 text-center">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary-a20">PassKeeper</span> —
        Securing Your Digital Life.
      </footer>
    </div>
  );
}
