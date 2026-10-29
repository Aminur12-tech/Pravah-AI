
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Resource, {
  resourceStatuses,
  resourceTypes,
} from "../models/resource.model.js";
import User from "../models/user.model.js";

type ResourceType = (typeof resourceTypes)[number];
type ResourceStatus = (typeof resourceStatuses)[number];

const validTypes: readonly string[] = resourceTypes;
const validStatuses: readonly string[] = resourceStatuses;

export async function createResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      type,
      description,
      quantity,
      unit,
      location,
    } = req.body ?? {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 150
    ) {
      return res.status(400).json({
        success: false,
        message: "Resource name must contain 2–150 characters",
      });
    }

    if (typeof type !== "string" || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type",
      });
    }

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number",
      });
    }

    if (
      typeof unit !== "string" ||
      unit.trim().length < 1 ||
      unit.trim().length > 30
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid resource unit is required",
      });
    }

    if (
      !location ||
      typeof location !== "object" ||
      typeof location.address !== "string" ||
      location.address.trim().length < 3 ||
      location.address.trim().length > 300
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid resource location is required",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be text of at most 1000 characters",
      });
    }

    const provider = await User.findOne({
      _id: req.auth!.userId,
      role: "resource_provider",
      providerVerified: true,
      isActive: true,
    }).select("_id");

    if (!provider) {
      return res.status(403).json({
        success: false,
        message: "Only verified resource providers can add resources",
      });
    }

    const resource = new Resource({
      name: name.trim(),
      type: type as ResourceType,
      description:
        typeof description === "string" ? description.trim() : "",
      quantity,
      unit: unit.trim(),
      status: quantity === 0 ? "unavailable" : "available",
      location: {
        address: location.address.trim(),
      },
      provider: provider._id,
    });

    await resource.save();

    const populatedResource = await Resource.findById(resource._id)
      .populate("provider", "name organizationName phone");

    return res.status(201).json({
      success: true,
      message: "Resource added successfully",
      data: populatedResource,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getResources(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filter: Record<string, unknown> = {
      isActive: true,
    };

    if (req.query.type !== undefined) {
      if (
        typeof req.query.type !== "string" ||
        !validTypes.includes(req.query.type)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource type filter",
        });
      }

      filter.type = req.query.type as ResourceType;
    }

    if (req.query.status !== undefined) {
      if (
        typeof req.query.status !== "string" ||
        !validStatuses.includes(req.query.status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource status filter",
        });
      }

      filter.status = req.query.status as ResourceStatus;
    }

    if (req.auth!.role === "resource_provider") {
      filter.provider = req.auth!.userId;
    }

    const resources = await Resource.find(filter)
      .populate("provider", "name organizationName phone")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      data: resources,
      count: resources.length,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getResourceById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("provider", "name organizationName phone");

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Providers can view only their own resources.
    if (
      req.auth!.role === "resource_provider" &&
      resource.provider._id.toString() !== req.auth!.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this resource",
      });
    }

    return res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const isOwner = req.auth!.role === "project_owner";
    const isProvider =
      req.auth!.role === "resource_provider" &&
      resource.provider.toString() === req.auth!.userId;

    if (!isOwner && !isProvider) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this resource",
      });
    }

    const body = req.body ?? {};

    const allowedFields = [
      "name",
      "type",
      "description",
      "quantity",
      "unit",
      "status",
    ];

    const suppliedFields = Object.keys(body);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid resource fields to update",
      });
    }

    if (
      body.name !== undefined &&
      (typeof body.name !== "string" ||
        body.name.trim().length < 2 ||
        body.name.trim().length > 150)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource name",
      });
    }

    if (
      body.type !== undefined &&
      (typeof body.type !== "string" ||
        !validTypes.includes(body.type))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type",
      });
    }

    if (
      body.quantity !== undefined &&
      (typeof body.quantity !== "number" ||
        !Number.isFinite(body.quantity) ||
        body.quantity < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number",
      });
    }

    if (
      body.unit !== undefined &&
      (typeof body.unit !== "string" ||
        body.unit.trim().length < 1 ||
        body.unit.trim().length > 30)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource unit",
      });
    }

    if (
      body.description !== undefined &&
      (typeof body.description !== "string" ||
        body.description.length > 1000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid description",
      });
    }

    if (
      body.status !== undefined &&
      (typeof body.status !== "string" ||
        !validStatuses.includes(body.status))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource status",
      });
    }

    const nextQuantity =
      body.quantity !== undefined ? body.quantity : resource.quantity;

    const nextStatus =
      body.status !== undefined
        ? (body.status as ResourceStatus)
        : body.quantity !== undefined
          ? nextQuantity === 0
            ? "unavailable"
            : resource.status === "unavailable"
              ? "available"
              : resource.status
          : resource.status;

    if (nextStatus === "available" && nextQuantity === 0) {
      return res.status(400).json({
        success: false,
        message: "Set a positive quantity before marking it available",
      });
    }

    if (body.name !== undefined) {
      resource.name = body.name.trim();
    }

    if (body.type !== undefined) {
      resource.type = body.type as ResourceType;
    }

    if (body.description !== undefined) {
      resource.description = body.description.trim();
    }

    if (body.quantity !== undefined) {
      resource.quantity = body.quantity;
    }

    if (body.unit !== undefined) {
      resource.unit = body.unit.trim();
    }

    resource.status = nextStatus;

    await resource.save();

    const updatedResource = await Resource.findById(resource._id)
      .populate("provider", "name organizationName phone");

    return res.json({
      success: true,
      message: "Resource updated successfully",
      data: updatedResource,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deactivateResource(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const resource = await Resource.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const isOwner = req.auth!.role === "project_owner";
    const isProvider =
      req.auth!.role === "resource_provider" &&
      resource.provider.toString() === req.auth!.userId;

    if (!isOwner && !isProvider) {
      return res.status(403).json({
        success: false,
        message: "You cannot deactivate this resource",
      });
    }

    resource.isActive = false;
    resource.status = "unavailable";

    await resource.save();

    return res.json({
      success: true,
      message: "Resource deactivated successfully",
    });
  } catch (error) {
    return next(error);
  }
}
