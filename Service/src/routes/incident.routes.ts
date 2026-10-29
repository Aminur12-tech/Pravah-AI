
import { Router } from "express";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
} from "../controllers/incident.controller.js";

const router = Router();

router.post("/", createIncident);
router.get("/", getIncidents);
router.get("/:id", getIncidentById);
router.patch("/:id/status", updateIncidentStatus);

export default router;
