
import { Schema, model, type InferSchemaType } from "mongoose";

export const notificationTypes = [
  "emergency_alert",
  "incident_update",
  "assignment_update",
  "resource_update",
  "system",
] as const;

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: notificationTypes,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },

    relatedIncident: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
    },

    relatedAssignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });

export type NotificationDocument =
  InferSchemaType<typeof notificationSchema>;

const Notification = model("Notification", notificationSchema);

export default Notification;
