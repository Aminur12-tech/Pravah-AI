import { Router } from "express";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignmentStatus,
} from "../controllers/assignment.controller.js";
import {
  authenticate,
  allowRoles,
} from "../middleware/auth.middleware.js";

const router = Router();

// Every assignment endpoint requires authentication.
router.use(authenticate);

// Project owner creates assignments.
router.post(
  "/",
  allowRoles("project_owner"),
  createAssignment
);

// Project owners see all assignments; providers see their own.
router.get(
  "/",
  allowRoles("project_owner", "resource_provider"),
  getAssignments
);

router.get(
  "/:id",
  allowRoles("project_owner", "resource_provider"),
  getAssignmentById
);

// The controller verifies that providers update only their own assignments.
router.patch(
  "/:id/status",
  allowRoles("project_owner", "resource_provider"),
  updateAssignmentStatus
);

export default router;