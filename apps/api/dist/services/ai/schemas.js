"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudScoreSchema = exports.ContinuityCapsuleSchema = void 0;
const zod_1 = require("zod");
exports.ContinuityCapsuleSchema = zod_1.z.object({
    bloodGroup: zod_1.z.string(),
    allergies: zod_1.z.array(zod_1.z.string()),
    chronicConditions: zod_1.z.array(zod_1.z.string()),
    activeMedications: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        dosage: zod_1.z.string(),
        reason: zod_1.z.string(),
    })),
    historicalEvents: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.string(),
        description: zod_1.z.string(),
        outcome: zod_1.z.string(),
    })),
});
exports.FraudScoreSchema = zod_1.z.object({
    riskScore: zod_1.z.number().min(0).max(1),
    reasons: zod_1.z.array(zod_1.z.string()),
    recommendation: zod_1.z.enum(["approve", "review", "reject"]),
});
