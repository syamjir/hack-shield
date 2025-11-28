import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "./dialog";

import { Input } from "./input";
import { Button } from "./button";
import { toast } from "sonner";
import { Loader2, Lock, Save, Shield, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type ModelProps = {
  openPasswordResetModal: boolean;
  setOpenPasswordResetModal: (openPasswordResetModal: boolean) => void;
};

function PasswordResetModel({
  openPasswordResetModal,
  setOpenPasswordResetModal,
}: ModelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update password");
        return;
      }

      toast.success("Password updated successfully!");

      setOpenPasswordResetModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = (): boolean => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(newPassword);
  };

  return (
    <Dialog
      open={openPasswordResetModal}
      onOpenChange={setOpenPasswordResetModal}
    >
      <DialogContent className="bg-surface-a10 rounded-xl p-4 sm:p-6 w-[95%] sm:max-w-md">
        <DialogTitle className="text-lg font-semibold text-dark-a0 mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-a20" />
          Change Password
        </DialogTitle>

        <form onSubmit={handleChangePassword} className="space-y-4 py-2">
          <Input
            type="password"
            placeholder="Current Password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />
          {newPassword && !passwordValid() && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-1 text-sm text-dark-a0/70 pl-2"
            >
              <span className="flex items-center gap-2 ">
                <Shield size={16} className="text-danger-a10" /> Password must:
              </span>
              <ul className="list-disc text-dark-a0/60 ml-8">
                <li>Be at least 8 characters</li>
                <li>Include uppercase & lowercase letters</li>
                <li>Include a number</li>
                <li>Include a special character (e.g., !@#$%)</li>
              </ul>
            </motion.div>
          )}

          <Input
            type="password"
            placeholder="New Password"
            required
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              passwordValid();
            }}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          {newPassword &&
            confirmPassword &&
            newPassword !== confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-dark-a0/70 flex items-center gap-2 pl-4 "
              >
                <Shield size={16} className="text-danger-a10" /> Passwords do
                not match!
              </motion.p>
            )}

          <Input
            type="password"
            placeholder="Confirm New Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-surface-a20 text-dark-a0 rounded-md px-3 py-2 outline-none focus-visible:ring-1 focus-visible:ring-primary-a0"
          />

          <DialogFooter className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenPasswordResetModal(false)}
              className="bg-gray-200 hover:bg-gray-300 text-dark-a0 rounded-lg"
            >
              <XCircle size={16} className="mr-1" /> Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                !passwordValid() ||
                newPassword !== confirmPassword
              }
              className="bg-primary-a20 hover:bg-primary-a30 text-white rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Update Password
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordResetModel;
