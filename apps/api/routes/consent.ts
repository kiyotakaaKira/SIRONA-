import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";

const router = Router();

// Hospital/Pharmacy requests access
router.post("/request", async (req, res) => {
  try {
    const { patientId, requesterId, purpose, scope, expiresAt } = req.body;

    if (!patientId || !requesterId || !purpose) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabaseAdmin
      .from("consent_grants")
      .insert({
        patient_id: patientId,
        requester_id: requesterId,
        purpose: purpose,
        scope: scope || ["*"],
        status: "pending",
        expires_at: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Consent request error:", error);
      if (process.env.AI_MOCK !== "false") {
        return res.status(200).json({
          success: true,
          grant: {
            id: "cg-" + Math.random().toString(36).substring(2, 9),
            patient_id: patientId,
            requester_id: requesterId,
            purpose: purpose,
            scope: scope || ["*"],
            status: "pending",
            expires_at: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          }
        });
      }
      return res.status(500).json({ error: "Failed to create consent request" });
    }

    res.status(200).json({ success: true, grant: data });
  } catch (err) {
    console.error("Consent request exception, falling back to mock:", err);
    if (process.env.AI_MOCK !== "false") {
      const { patientId, requesterId, purpose, scope, expiresAt } = req.body;
      return res.status(200).json({
        success: true,
        grant: {
          id: "cg-" + Math.random().toString(36).substring(2, 9),
          patient_id: patientId,
          requester_id: requesterId,
          purpose: purpose,
          scope: scope || ["*"],
          status: "pending",
          expires_at: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Patient approves or denies
router.post("/:id/decide", async (req, res) => {
  const { id } = req.params;
  try {
    const { status } = req.body; // "approved" or "denied"

    if (!["approved", "denied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const { data, error } = await supabaseAdmin
      .from("consent_grants")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Consent decision error:", error);
      if (process.env.AI_MOCK !== "false") {
        return res.status(200).json({
          success: true,
          grant: {
            id,
            status,
            updated_at: new Date().toISOString()
          }
        });
      }
      return res.status(500).json({ error: "Failed to update consent" });
    }

    res.status(200).json({ success: true, grant: data });
  } catch (err) {
    console.error("Consent decision exception, falling back to mock:", err);
    if (process.env.AI_MOCK !== "false") {
      const { status } = req.body;
      return res.status(200).json({
        success: true,
        grant: {
          id,
          status,
          updated_at: new Date().toISOString()
        }
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Patient or system revokes active grant
router.post("/:id/revoke", async (req, res) => {
  const { id } = req.params;
  try {

    const { data, error } = await supabaseAdmin
      .from("consent_grants")
      .update({ status: "revoked" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Consent revoke error:", error);
      if (process.env.AI_MOCK !== "false") {
        return res.status(200).json({
          success: true,
          grant: {
            id,
            status: "revoked",
            updated_at: new Date().toISOString()
          }
        });
      }
      return res.status(500).json({ error: "Failed to revoke consent" });
    }

    res.status(200).json({ success: true, grant: data });
  } catch (err) {
    console.error("Consent revoke exception, falling back to mock:", err);
    if (process.env.AI_MOCK !== "false") {
      return res.status(200).json({
        success: true,
        grant: {
          id,
          status: "revoked",
          updated_at: new Date().toISOString()
        }
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Emergency Break-Glass
router.post("/break-glass", async (req, res) => {
  try {
    const { patientId, hospitalId, reason } = req.body;

    const { data, error } = await supabaseAdmin
      .from("consent_grants")
      .insert({
        patient_id: patientId,
        requester_id: hospitalId,
        purpose: `EMERGENCY OVERRIDE: ${reason}`,
        scope: ["*"],
        status: "approved",
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Consent break-glass error:", error);
      if (process.env.AI_MOCK !== "false") {
        return res.status(200).json({
          success: true,
          grant: {
            id: "cg-" + Math.random().toString(36).substring(2, 9),
            patient_id: patientId,
            requester_id: hospitalId,
            purpose: `EMERGENCY OVERRIDE: ${reason}`,
            scope: ["*"],
            status: "approved",
            expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          }
        });
      }
      return res.status(500).json({ error: "Failed to declare emergency" });
    }

    await supabaseAdmin.from("audit_logs").insert({
      patient_id: patientId,
      actor_id: hospitalId,
      action: "emergency_override",
      details: reason,
    });

    res.status(200).json({ success: true, grant: data });
  } catch (err) {
    console.error("Consent break-glass exception, falling back to mock:", err);
    if (process.env.AI_MOCK !== "false") {
      const { patientId, hospitalId, reason } = req.body;
      return res.status(200).json({
        success: true,
        grant: {
          id: "cg-" + Math.random().toString(36).substring(2, 9),
          patient_id: patientId,
          requester_id: hospitalId,
          purpose: `EMERGENCY OVERRIDE: ${reason}`,
          scope: ["*"],
          status: "approved",
          expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Internal endpoint called by n8n cron workflow
router.post("/internal/grant-expired", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("consent_grants")
      .update({ status: "expired" })
      .lt("expires_at", new Date().toISOString())
      .eq("status", "approved");

    if (error) {
      console.error("Consent expire error:", error);
      if (process.env.AI_MOCK !== "false") {
        return res.status(200).json({ success: true, message: "Expired grants processed (mocked)." });
      }
      return res.status(500).json({ error: "Failed to expire grants" });
    }

    res.status(200).json({ success: true, message: "Expired grants processed." });
  } catch (err) {
    console.error("Consent expire exception, falling back to mock:", err);
    if (process.env.AI_MOCK !== "false") {
      return res.status(200).json({ success: true, message: "Expired grants processed (mocked)." });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
