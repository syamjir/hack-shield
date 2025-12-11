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
  const id = new mongoose.Types.ObjectId(userId);
  const x = await Password.aggregate([
    { $match: { userId: id } },

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

    {
      $addFields: {
        passwordSecurityScore: { $add: ["$strengthScore", "$breachPenalty"] },
      },
    },

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

    {
      $project: {
        _id: 0,
        totalSecurityScorePercentage: 1,
        breachedCount: 1,
        passwordStrength: 1,
      },
    },
  ]);

  console.log(x);
  return x;
}
