"use client";

import { useState } from "react";
import { Github, Linkedin, Shield, KeyRound, Server } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn button import
import Image from "next/image";

interface FooterProps {
  onScrollIntoFeatures: () => void;
}

export function Footer({ onScrollIntoFeatures }: FooterProps) {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openModal = (content: string) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  return (
    <>
      <footer className="w-full mt-18 bg-surface-a10 backdrop-blur-md text-dark-a0/80 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand & tagline */}

          <div className="flex flex-col md:flex-row  items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
            {/* <Image src="/lock.png" width={32} height={32} alt="brand-logo" /> */}
            <span className="text-2xl font-extrabold text-primary-a20">
              🔐 PassKeeper
            </span>
            <span className="text-sm text-dark-a0/70">
              Securing Your Digital Life
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onScrollIntoFeatures}
              className="hover:text-primary-a20"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                openModal(
                  "PassKeeper is a secure password management solution designed to keep your credentials safe. Our mission is to simplify your digital life while protecting sensitive information."
                )
              }
              className="hover:text-primary-a20"
            >
              About
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                openModal(
                  "We respect your privacy. PassKeeper never stores your master password or unencrypted credentials. All data is encrypted using industry-standard AES-256 encryption before leaving your device."
                )
              }
              className="hover:text-primary-a20"
            >
              Privacy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                openModal(
                  "Need help? Reach out to us at support@passkeeper.com or use the contact form on our website. We're here to assist you with any questions or issues."
                )
              }
              className="hover:text-primary-a20"
            >
              Contact
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                openModal(
                  "By using PassKeeper, you agree to our terms of service. This includes secure usage of our platform, respect for intellectual property, and adherence to privacy policies."
                )
              }
              className="hover:text-primary-a20"
            >
              Terms
            </Button>
          </div>

          {/* Social / Utility Icons */}
          <div className="flex space-x-4">
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              className="hover:text-primary-a20 transition transform hover:-translate-y-1"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              className="hover:text-primary-a20 transition transform hover:-translate-y-1"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Shield className="w-5 h-5 text-dark-a0/80 hover:text-primary-a20" />
            <KeyRound className="w-5 h-5 text-dark-a0/80 hover:text-primary-a20" />
            <Server className="w-5 h-5 text-dark-a0/80 hover:text-primary-a20" />
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-surface-a20 mt-8"></div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-dark-a0/70">
          © {new Date().getFullYear()} PassKeeper. All rights reserved.
        </div>
      </footer>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-a0 rounded-xl p-8 max-w-lg w-full relative shadow-xl">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 text-primary-a20"
              onClick={closeModal}
            >
              ×
            </Button>
            <div className="text-surface-a50 text-sm">{modalContent}</div>
          </div>
        </div>
      )}
    </>
  );
}
