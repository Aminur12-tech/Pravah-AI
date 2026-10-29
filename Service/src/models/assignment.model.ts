import { Schema, model, type InferSchemaType } from "mongoose";

export const assignmentStatuses = [
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const assignmentSchema = new Schema(
  {
    incident: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      index: true,
    },

    resourceProvider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: assignmentStatuses,
      default: "assigned",
      required: true,
    },

    instructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: assignmentStatuses,
            required: true,
          },
          note: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
          },
          changedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          changedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ incident: 1, status: 1 });
assignmentSchema.index({ resourceProvider: 1, status: 1 });

export type AssignmentDocument = InferSchemaType<
  typeof assignmentSchema
>;

const Assignment = model("Assignment", assignmentSchema);

export default Assignment;