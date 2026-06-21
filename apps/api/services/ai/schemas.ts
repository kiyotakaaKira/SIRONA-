import { z } from "zod";

export const ContinuityCapsuleSchema = z.object({
  bloodGroup: z.string(),
  allergies: z.array(z.string()),
  chronicConditions: z.array(z.string()),
  activeMedications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    reason: z.string(),
  })),
  historicalEvents: z.array(z.object({
    date: z.string(),
    description: z.string(),
    outcome: z.string(),
  })),
});

export const FraudScoreSchema = z.object({
  riskScore: z.number().min(0).max(1),
  reasons: z.array(z.string()),
  recommendation: z.enum(["approve", "review", "reject"]),
});
