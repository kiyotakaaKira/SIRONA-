import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";

const router = Router();

router.post("/signup-meta", async (req, res) => {
  try {
    const { userId, email, role, name } = req.body;

    if (!userId || !role || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Insert into profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        role: role,
        name: name,
        email: email,
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return res.status(500).json({ error: "Failed to create profile" });
    }

    // 2. If patient, insert into patients table
    if (role === "patient") {
      const { error: patientError } = await supabaseAdmin
        .from("patients")
        .insert({
          id: userId,
          // Generate a random 8-digit medical ID for demo
          medical_id: Math.floor(10000000 + Math.random() * 90000000).toString(),
        });

      if (patientError) {
        console.error("Patient creation error:", patientError);
        return res.status(500).json({ error: "Failed to create patient record" });
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
