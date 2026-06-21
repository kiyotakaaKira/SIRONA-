import { ContinuityCapsuleSchema, FraudScoreSchema } from "./schemas";

const AI_MOCK = process.env.AI_MOCK !== "false";

export async function generateContinuityCapsule(patientRecords: any[]) {
  if (AI_MOCK) {
    return {
      bloodGroup: "O+",
      allergies: ["Penicillin", "Peanuts"],
      chronicConditions: ["Hypertension"],
      activeMedications: [
        { name: "Lisinopril", dosage: "10mg daily", reason: "Blood pressure management" }
      ],
      historicalEvents: [
        { date: "2018-04-12", description: "Appendectomy", outcome: "Full recovery" }
      ]
    };
  }

  // In a real implementation, you would use Google's generative-ai SDK here
  // and pass the patientRecords to Gemini 2.5 Pro with structured JSON extraction enabled.
  throw new Error("Real AI integration not implemented. Set AI_MOCK=true.");
}

export async function calculateFraudScore(prescriptionData: any) {
  if (AI_MOCK) {
    // If the prescription data looks suspicious (e.g. huge dosage), flag it
    const isSuspicious = prescriptionData.dosage && prescriptionData.dosage.includes("5000");
    return {
      riskScore: isSuspicious ? 0.85 : 0.05,
      reasons: isSuspicious ? ["Unusually high dosage for this medication class", "Doctor history irregular"] : [],
      recommendation: isSuspicious ? "reject" : "approve",
    };
  }

  // In a real implementation, call DeepSeek R1 or Gemini.
  throw new Error("Real AI integration not implemented. Set AI_MOCK=true.");
}
