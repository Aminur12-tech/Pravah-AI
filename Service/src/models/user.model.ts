
import { Schema, model } from "mongoose";

export const userRoles = [
  "citizen",
  "project_owner",
  "resource_provider",
] as const;

const userSchema = new Schema(
  {
    // Full name from the signup form
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    // Mobile number
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    // Hashed password only
    password: {
      type: String,
      required: true,
      select: false,
    },

    // Account role
    role: {
      type: String,
      enum: userRoles,
      required: true,
      default: "citizen",
    },

    // Required for resource providers
    organizationName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 150,
      required: function (this: { role: string }) {
        return this.role === "resource_provider";
      },
    },

    // Provider approval by project owner
    providerVerified: {
      type: Boolean,
      default: false,
    },

    // Location switch on signup screen
    locationEnabled: {
      type: Boolean,
      default: false,
    },

    // GeoJSON Point: [longitude, latitude]
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (coordinates: number[]) =>
            coordinates.length === 2 &&
            Number.isFinite(coordinates[0]) &&
            Number.isFinite(coordinates[1]) &&
            coordinates[0] >= -180 &&
            coordinates[0] <= 180 &&
            coordinates[1] >= -90 &&
            coordinates[1] <= 90,
          message: "Invalid longitude or latitude",
        },
      },
    },

    // Account activation
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Enable nearby-incident and nearby-resource searches later.
userSchema.index({ location: "2dsphere" });

const User = model("User", userSchema);

export default User;
