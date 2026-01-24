"use server";
import Password from "@/models/Password";
import mongoose from "mongoose";

type PasswordSecuritySummary = {
  totalSecurityScorePercentage: number;
  breachedCount: number;
  passwordStrength: "Strong" | "Medium" | "Weak";
};

export async function getHealthOverView(
  userId: string
): Promise<PasswordSecuritySummary[] | []> {
  // Convert userId string to MongoDB ObjectId for aggregation match
  const id = new mongoose.Types.ObjectId(userId);

  const x = await Password.aggregate([
    // Filter passwords belonging to the given user
    { $match: { userId: id } },

    // Assign numeric scores based on password strength and breach status
    {
      $addFields: {
        strengthScore: {
          $switch: {
            branches: [
              { case: { $eq: ["$strength", "Strong"] }, then: 3 },
              { case: { $eq: ["$strength", "Medium"] }, then: 2 },
              { case: { $eq: ["$strength", "Weak"] }, then: 1 },
            ],
            default: 0,
          },
        },
        breachPenalty: { $cond: [{ $eq: ["$isBreached", true] }, -2, 0] },
      },
    },

    // Calculate final security score per password
    {
      $addFields: {
        passwordSecurityScore: { $add: ["$strengthScore", "$breachPenalty"] },
      },
    },

    // Aggregate overall security metrics for the user
    {
      $group: {
        _id: null,
        totalSecurityScore: { $sum: "$passwordSecurityScore" },
        breachedCount: {
          $sum: { $cond: [{ $eq: ["$isBreached", true] }, 1, 0] },
        },
        totalPasswords: { $sum: 1 },
      },
    },

    // Derive security percentage and overall password health
    {
      $addFields: {
        totalSecurityScorePercentage: {
          $cond: [
            { $eq: ["$totalPasswords", 0] },
            0,
            {
              $multiply: [
                {
                  $divide: [
                    "$totalSecurityScore",
                    { $multiply: ["$totalPasswords", 3] },
                  ],
                },
                100,
              ],
            },
          ],
        },
        passwordStrength: {
          $cond: [
            { $gt: ["$breachedCount", 0] },
            "Weak",
            {
              $switch: {
                branches: [
                  {
                    case: { $gte: ["$totalSecurityScorePercentage", 70] },
                    then: "Strong",
                  },
                  {
                    case: { $gte: ["$totalSecurityScorePercentage", 40] },
                    then: "Medium",
                  },
                ],
                default: "Weak",
              },
            },
          ],
        },
      },
    },

    // Return only the required summary fields
    {
      $project: {
        _id: 0,
        totalSecurityScorePercentage: 1,
        breachedCount: 1,
        passwordStrength: 1,
      },
    },
  ]);

  return x;
}
