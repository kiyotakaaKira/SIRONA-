"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
router.get("/:patientId", async (req, res) => {
    try {
        const { patientId } = req.params;
        const { data, error } = await supabase_1.supabaseAdmin
            .from("audit_logs")
            .select("*")
            .eq("patient_id", patientId)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Audit fetch error, falling back to mock:", error);
            if (process.env.AI_MOCK !== "false") {
                return res.status(200).json({ logs: [] });
            }
            return res.status(500).json({ error: "Failed to fetch audit logs" });
        }
        res.status(200).json({ logs: data });
    }
    catch (err) {
        console.error("Audit fetch exception, falling back to mock:", err);
        if (process.env.AI_MOCK !== "false") {
            return res.status(200).json({ logs: [] });
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
