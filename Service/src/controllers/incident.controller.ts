
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Incident from "../models/incident.model.js";

const incidentCategories = [
  "flood",
  "earthquake",
  "landslide",
  "fire",
  "storm",
  "road_damage",
  "waste",
  "drainage",
  "water_shortage",
  "other",
] as const;

const urgentNeeds = [
  "drinking_water",
  "food",
  "rescue",
  "medical_help",
  "shelter",
  "blankets",
  "first_aid",
  "other",
] as const;

const createIncidentSchema = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(incidentCategories),
  location: z.object({
    address: z.string().trim().min(3).max(300),
    coordinates: z
      .tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
      ])
      .optional(),
  }),
  peopleAffected: z.number().int().min(0).optional(),
  injuriesReported: z.number().int().min(0).optional(),
  urgentNeeds: z.array(z.enum(urgentNeeds)).max(8).optional(),
  photos: z.array(z.string().url()).max(5).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    "under_review",
    "assigned",
    "in_progress",
    "resolved",
  ]),
  note: z.string().trim().max(500).optional(),
});

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

// POST /api/incidents
export async function createIncident(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = createIncidentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident details",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const incident = await Incident.create(parsed.data);

    return res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/incidents
export async function getIncidents(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 10)
    );

    const filter: Record<string, unknown> = {};

    if (typeof req.query.category === "string") {
      if (
        !incidentCategories.includes(
          req.query.category as (typeof incidentCategories)[number]
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid incident category",
        });
      }

      filter.category = req.query.category;
    }

    if (typeof req.query.status === "string") {
      const allowedStatuses = [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
      ];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid incident status",
        });
      }

      filter.status = req.query.status;
    }

    const [incidents, total] = await Promise.all([
      Incident.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Incident.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/incidents/:id
export async function getIncidentById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
      });
    }

    const incident = await Incident.findById(id).lean();

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/incidents/:id/status
export async function updateIncidentStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID",
      });
    }

    const parsed = updateStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
        errors: parsed.error.issues,
      });
    }

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    if (incident.status === "resolved") {
      return res.status(409).json({
        success: false,
        message: "Resolved incidents cannot be updated",
      });
    }

    incident.status = parsed.data.status;
    incident.statusHistory.push({
      status: parsed.data.status,
      note: parsed.data.note ?? "",
      changedAt: new Date(),
    });

    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Incident status updated",
      data: incident,
    });
  } catch (error) {
    return next(error);
  }
}
