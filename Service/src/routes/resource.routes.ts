import { Router } from "express";
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deactivateResource,
} from "../controllers/resource.controller.js";
import {
  authenticate,
  allowRoles,
} from "../middleware/auth.middleware.js";

const router = Router();

// Resource listings are public. Provider listings are scoped to their own resources.
router.get("/", authenticate, getResources);
router.get("/:id", authenticate, getResourceById);

router.post(
  "/",
  authenticate,
  allowRoles("resource_provider"),
  createResource
);

router.patch(
  "/:id",
  authenticate,
  allowRoles("project_owner", "resource_provider"),
  updateResource
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("project_owner", "resource_provider"),
  deactivateResource
);

export default router;