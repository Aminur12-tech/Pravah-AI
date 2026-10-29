
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

function validId(id: unknown): id is string {
  return typeof id === "string" && mongoose.isValidObjectId(id);
}

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth!.userId;

    const pageValue = Number(req.query.page ?? 1);
    const limitValue = Number(req.query.limit ?? 20);

    const page =
      Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

    const limit =
      Number.isInteger(limitValue) && limitValue > 0
        ? Math.min(limitValue, 50)
        : 20;

    const unreadOnly = req.query.unread === "true";

    const filter: Record<string, unknown> = {
      recipient: userId,
    };

    if (unreadOnly) {
      filter.readAt = null;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Notification.countDocuments(filter),

      Notification.countDocuments({
        recipient: userId,
        readAt: null,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    return next(error);
  }
}

export async function markNotificationAsRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notificationId: unknown = req.params.notificationId;

    if (!validId(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: req.auth!.userId,
        readAt: null,
      },
      { $set: { readAt: new Date() } },
      { new: true }
    ).lean();

    if (notification) {
      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    }

    const existing = await Notification.exists({
      _id: notificationId,
      recipient: req.auth!.userId,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification was already read",
    });
  } catch (error) {
    return next(error);
  }
}

export async function markAllNotificationsAsRead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.auth!.userId,
        readAt: null,
      },
      {
        $set: { readAt: new Date() },
      }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notificationId: unknown = req.params.notificationId;

    if (!validId(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.auth!.userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}
