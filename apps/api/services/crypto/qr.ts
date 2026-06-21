import crypto from "crypto";

const QR_SECRET = process.env.QR_SECRET || "default-qr-signing-secret-key-12345";

export interface PrescriptionPayload {
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  issuedAt: string;
}

export function signPrescription(payload: PrescriptionPayload): string {
  const dataString = JSON.stringify(payload);
  const hmac = crypto.createHmac("sha256", QR_SECRET);
  hmac.update(dataString);
  const signature = hmac.digest("hex");
  
  // Return Base64 encoded payload + signature for the QR
  const token = Buffer.from(JSON.stringify({ data: payload, signature })).toString("base64");
  return token;
}

export function verifyPrescriptionToken(token: string): { valid: boolean, payload?: PrescriptionPayload, reason?: string } {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const { data, signature } = JSON.parse(decoded);

    const hmac = crypto.createHmac("sha256", QR_SECRET);
    hmac.update(JSON.stringify(data));
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false, reason: "Signature mismatch" };
    }

    return { valid: true, payload: data as PrescriptionPayload };
  } catch (err) {
    return { valid: false, reason: "Invalid token format" };
  }
}
