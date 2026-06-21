"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPrescription = signPrescription;
exports.verifyPrescriptionToken = verifyPrescriptionToken;
const crypto_1 = __importDefault(require("crypto"));
const QR_SECRET = process.env.QR_SECRET || "default-qr-signing-secret-key-12345";
function signPrescription(payload) {
    const dataString = JSON.stringify(payload);
    const hmac = crypto_1.default.createHmac("sha256", QR_SECRET);
    hmac.update(dataString);
    const signature = hmac.digest("hex");
    // Return Base64 encoded payload + signature for the QR
    const token = Buffer.from(JSON.stringify({ data: payload, signature })).toString("base64");
    return token;
}
function verifyPrescriptionToken(token) {
    try {
        const decoded = Buffer.from(token, "base64").toString("utf-8");
        const { data, signature } = JSON.parse(decoded);
        const hmac = crypto_1.default.createHmac("sha256", QR_SECRET);
        hmac.update(JSON.stringify(data));
        const expectedSignature = hmac.digest("hex");
        if (signature !== expectedSignature) {
            return { valid: false, reason: "Signature mismatch" };
        }
        return { valid: true, payload: data };
    }
    catch (err) {
        return { valid: false, reason: "Invalid token format" };
    }
}
