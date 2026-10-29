import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Incident from "../models/incident.model.js";
import User from "../models/user.model.js";
import Assignment from "../models/assignment.model.js";
import { assignmentStatuses } from "../models/assignment.model.js";

const validStatuses: readonly string[] = assignmentStatuses;

function validId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

function incidentStatusForAssignment(
  status: string
): "assigned" | "in_progress" | "resolved" | "under_review" {
  switch (status) {
    case "assigned":
      return "assigned";
    case "in_progress":
      return "in_progress";
    case "completed":
      return "resolved";
    default:
      return "under_review";
  }
}

async function updateIncidentHistory(
  incidentId: mongoose.Types.ObjectId,
  status: "assigned" | "in_progress" | "resolved" | "under_review",
  note: string,
  userId: string
) {
  await Incident.findByIdAndUpdate(incidentId, {
    $set: { status },
    $push: {
      statusHistory: {
        status,
        note,
        changedAt: new Date(),
      },
    },
  });

  // The incident statusHistory schema currently doesn't have changedBy.
  // Assignment history separately records who made each assignment update.
  void userId;
}

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { incidentId, resourceProviderId, instructions } = req.body ?? {};

    if (
      typeof incidentId !== "string" ||
      typeof resourceProviderId !== "string" ||
      !validId(incidentId) ||
      !validId(resourceProviderId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid incidentId and resourceProviderId are required",
      });
    }

    if (
      instructions !== undefined &&
      (typeof instructions !== "string" || instructions.trim().length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Instructions must be text of at most 1000 characters",
      });
    }

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    if (incident.status === "resolved") {
      return res.status(409).json({
        success: false,
        message: "A resolved incident cannot receive a new assignment",
      });
    }

    const provider = await User.findOne({
      _id: resourceProviderId,
      role: "resource_provider",
      providerVerified: true,
      isActive: true,
    }).select("_id name email phone organizationName");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Active, verified resource provider not found",
      });
    }

    const existingAssignment = await Assignment.findOne({
      incident: incident._id,
      status: { $in: ["assigned", "in_progress"] },
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "This incident already has an active assignment",
        data: { assignmentId: existingAssignment._id },
      });
    }

    const assignment = await Assignment.create({
      incident: incident._id,
      resourceProvider: provider._id,
      assignedBy: req.auth!.userId,
      status: "assigned",
      instructions: typeof instructions === "string" ? instructions.trim() : "",
      statusHistory: [
        {
          status: "assigned",
          note: "Resource provider assigned to incident",
          changedBy: req.auth!.userId,
          changedAt: new Date(),
        },
      ],
    });

    await updateIncidentHistory(
      incident._id,
      "assigned",
      `Assigned to resource provider ${provider.name}`,
      req.auth!.userId
    );

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate("incident", "reportNumber title category priority status location")
      .populate("resourceProvider", "name email phone organizationName")
      .populate("assignedBy", "name email");

    return res.status(201).json({
      success: true,
      message: "Resource provider assigned successfully",
      data: populatedAssignment,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAssignments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filter: Record<string, unknown> = {};

    if (req.auth!.role === "resource_provider") {
      filter.resourceProvider = req.auth!.userId;
    } else if (req.auth!.role !== "project_owner") {
      return res.status(403).json({
        success: false,
        message: "Only project owners and resource providers can view assignments",
      });
    }

    const incidentId = req.query.incidentId;

    if (incidentId !== undefined) {
      if (typeof incidentId !== "string" || !validId(incidentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid incidentId",
        });
      }

      filter.incident = incidentId;
    }

    if (req.query.status !== undefined) {
      const status = req.query.status;

      if (typeof status !== "string" || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignment status",
        });
      }

      filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .populate("incident", "reportNumber title category priority status location")
      .populate("resourceProvider", "name email phone organizationName")
      .populate("assignedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAssignmentById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignmentId = req.params.id;

    if (typeof assignmentId !== "string" || !validId(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
      });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate("incident", "reportNumber title category priority status location description")
      .populate("resourceProvider", "name email phone organizationName")
      .populate("assignedBy", "name email");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const providerId =
      typeof assignment.resourceProvider === "object" &&
      assignment.resourceProvider !== null &&
      "_id" in assignment.resourceProvider
        ? String(assignment.resourceProvider._id)
        : String(assignment.resourceProvider);

    if (
      req.auth!.role !== "project_owner" &&
      !(req.auth!.role === "resource_provider" && providerId === req.auth!.userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this assignment",
      });
    }

    return res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAssignmentStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const assignmentId = req.params.id;
    const { status, note } = req.body ?? {};

    if (typeof assignmentId !== "string" || !validId(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID",
      });
    }

    if (typeof status !== "string" || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
    }

    if (note !== undefined && (typeof note !== "string" || note.trim().length > 500)) {
      return res.status(400).json({
        success: false,
        message: "Note must be text of at most 500 characters",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const isOwner = req.auth!.role === "project_owner";
    const isAssignedProvider =
      req.auth!.role === "resource_provider" &&
      assignment.resourceProvider.toString() === req.auth!.userId;

    if (!isOwner && !isAssignedProvider) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this assignment",
      });
    }

    if (["completed", "cancelled"].includes(assignment.status)) {
      return res.status(409).json({
        success: false,
        message: "A completed or cancelled assignment cannot be changed",
      });
    }

    const allowedNextStatuses =
      assignment.status === "assigned"
        ? ["in_progress", "completed", "cancelled"]
        : ["completed", "cancelled"];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change assignment from ${assignment.status} to ${status}`,
      });
    }

    const incident = await Incident.findById(assignment.incident);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "The incident linked to this assignment no longer exists",
      });
    }

    assignment.status = status as (typeof assignmentStatuses)[number];
    assignment.statusHistory.push({
      status: status as (typeof assignmentStatuses)[number],
      note: typeof note === "string" ? note.trim() : "",
      changedBy: new mongoose.Types.ObjectId(req.auth!.userId),
      changedAt: new Date(),
    });

    await assignment.save();

    const incidentStatus = incidentStatusForAssignment(status);

    await updateIncidentHistory(
      incident._id,
      incidentStatus,
      typeof note === "string" && note.trim()
        ? note.trim()
        : `Assignment status changed to ${status}`,
      req.auth!.userId
    );

    const updatedAssignment = await Assignment.findById(assignment._id)
      .populate("incident", "reportNumber title category priority status location")
      .populate("resourceProvider", "name email phone organizationName")
      .populate("assignedBy", "name email");

    return res.json({
      success: true,
      message: "Assignment status updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    return next(error);
  }
}