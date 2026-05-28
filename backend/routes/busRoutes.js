const express = require("express");

const {
  getBuses,
  seedBuses
} = require("../controllers/busController");

const router = express.Router();

// ── Get buses ──────────────────────────────────────────
router.get("/", getBuses);

// ── Protected seed route ───────────────────────────────
router.get("/seed", (req, res, next) => {

  if (req.query.secret !== process.env.SEED_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden"
    });
  }

  next();

}, seedBuses);

module.exports = router;