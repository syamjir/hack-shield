"use server";
import EmailService from "@/lib/emailService";
import User from "@/models/User";

export async function sendEmailToAllUsers(
  subject: string,
  message: string,
  userId: string
) {
  if (!subject || !message) throw new Error("Subject and message are required");

  //   Check user is admin
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");
  if (user.role !== "Admin")
    throw new Error("Not authorised.Please logins as admin");

  // Get all active users
  const users = await User.find({
    isDeleted: false,
    role: "User",
    preference: { emailNotification: true },
  });
  if (users.length === 0)
    throw new Error("There is no user enable email notification!");
  const emails = users.map((user) => user.email);

  // Send email

  const emailService = new EmailService(
    undefined,
    undefined,
    undefined,
    emails
  );
  try {
    await emailService.sendNotificationToAllUsers(subject, message);
  } catch (err) {
    console.error(err);
    throw new Error("Emails sending error");
  }
}
