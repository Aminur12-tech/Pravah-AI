import { Schema, model, type InferSchemaType } from "mongoose";

export const resourceTypes = [
  "drinking_water",
  "food",
  "medicine",
  "first_aid",
  "blankets",
  "clothing",
  "shelter",
  "rescue_equipment",
  "other",
] as const;

export const resourceStatuses = [
  "available",
  "limited",
  "unavailable",
] as const;

const resourceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    type: {
      type: String,
      enum: resourceTypes,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    status: {
      type: String,
      enum: resourceStatuses,
      default: "available",
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },

      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ type: 1, status: 1 });
resourceSchema.index({ isActive: 1, status: 1 });

export type ResourceDocument = InferSchemaType<typeof resourceSchema>;

const Resource = model("Resource", resourceSchema);

export default Resource;