
import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  authenticate,
  allowRoles,
} from "../middleware/auth.middleware.js";

const router = Router();

// Register a citizen or resource provider
router.post("/register", register);

// Log in an existing user
router.post("/login", login);

// Verify the token and allow only authenticated users
router.get("/verify", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.auth,
  });
});

// Example role-protected endpoint for project owners
router.get(
  "/project-owner-check",
  authenticate,
  allowRoles("project_owner"),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Project owner access granted",
    });
  }
);

export default router;
