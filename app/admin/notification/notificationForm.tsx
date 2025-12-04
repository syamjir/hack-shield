"use client";
import { toast } from "sonner";
import { sendEmailToAllUsers } from "../_actions/actions";
import { useFormStatus } from "react-dom";

export default function NotificationForm({ user }) {
  async function sendEmail(formData: FormData) {
    const subject = formData.get("subject")?.toString();
    const message = formData.get("message")?.toString();
    const userId = user?._id;
    try {
      await sendEmailToAllUsers(subject!, message!, userId);
      toast.success("Emails sent successfully!");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Error sending emails";
      toast.error(message);
    }
  }

  return (
    <div className="">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary-a20">
          Send Email to All Users
        </h2>
        <p className="text-dark-a0/50 mt-1">
          Notify all users with important information
        </p>
      </div>

      {/* FORM */}
      <form
        action={sendEmail}
        className="flex flex-col gap-4 bg-[var(--surface-a10)] p-6 rounded-xl border border-[var(--surface-a20)] shadow-sm"
      >
        <input
          type="text"
          name="subject"
          placeholder="Email Subject"
          required
          className="p-3 rounded-lg bg-[var(--surface-a20)] text-white placeholder:text-[var(--surface-a40)] border border-[var(--surface-a30)] focus:border-[var(--primary-a20)] focus:outline-none"
        />

        <textarea
          name="message"
          placeholder="Type your message here..."
          rows={8}
          required
          className="p-3 rounded-lg bg-[var(--surface-a20)] text-white placeholder:text-[var(--surface-a40)] border border-[var(--surface-a30)] focus:border-[var(--primary-a20)] focus:outline-none"
        />

        <Button />
      </form>
    </div>
  );
}

function Button() {
  const { pending: loading } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 p-3 bg-primary-a20 text-white font-semibold rounded-lg hover:bg-primary-a30 transition-colors disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send Notification"}
    </button>
  );
}
