
import mongoose from "mongoose";
import Notification, {
  type NotificationDocument,
  notificationTypes,
} from "../models/notification.model.js";

type NotificationType = (typeof notificationTypes)[number];

interface CreateNotificationInput {
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedIncident?: string;
  relatedAssignment?: string;
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<NotificationDocument> {
  if (!mongoose.isValidObjectId(input.recipient)) {
    throw new Error("Invalid notification recipient ID");
  }

  const title = input.title.trim();
  const message = input.message.trim();

  if (title.length < 2 || title.length > 150) {
    throw new Error("Notification title must be 2–150 characters");
  }

  if (!message || message.length > 1000) {
    throw new Error("Notification message must be 1–1000 characters");
  }

  if (
    input.relatedIncident &&
    !mongoose.isValidObjectId(input.relatedIncident)
  ) {
    throw new Error("Invalid related incident ID");
  }

  if (
    input.relatedAssignment &&
    !mongoose.isValidObjectId(input.relatedAssignment)
  ) {
    throw new Error("Invalid related assignment ID");
  }

  return Notification.create({
    recipient: input.recipient,
    type: input.type,
    title,
    message,
    relatedIncident: input.relatedIncident ?? null,
    relatedAssignment: input.relatedAssignment ?? null,
  });
}
