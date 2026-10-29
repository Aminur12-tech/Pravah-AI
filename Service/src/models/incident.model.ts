
import { Schema, model, type InferSchemaType } from "mongoose";

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

const incidentPriorities = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

const incidentStatuses = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
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

const incidentSchema = new Schema(
  {
    reportNumber: {
      type: String,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: incidentCategories,
      required: true,
      default: "other",
    },

    priority: {
      type: String,
      enum: incidentPriorities,
      default: "medium",
    },

    status: {
      type: String,
      enum: incidentStatuses,
      default: "submitted",
    },

    location: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    peopleAffected: {
      type: Number,
      min: 0,
      default: 0,
    },

    injuriesReported: {
      type: Number,
      min: 0,
      default: 0,
    },

    urgentNeeds: {
      type: [String],
      enum: urgentNeeds,
      default: [],
    },

    photos: {
      type: [String],
      default: [],
    },

    aiAnalysis: {
      category: String,
      priority: {
        type: String,
        enum: incidentPriorities,
      },
      reasons: {
        type: [String],
        default: [],
      },
      analyzedAt: Date,
    },

    statusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: incidentStatuses,
            required: true,
          },
          note: {
            type: String,
            default: "",
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

// GeoJSON coordinate order: [longitude, latitude]
incidentSchema.index({
  "location.coordinates": "2dsphere",
});

incidentSchema.pre("validate", function () {
  if (!this.reportNumber) {
    const id = this._id.toString().slice(-8).toUpperCase();
    this.reportNumber = `PRV-${id}`;
  }

  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status,
      note: "Incident reported",
      changedAt: new Date(),
    });
  }
});

export type IncidentDocument = InferSchemaType<
  typeof incidentSchema
>;

const Incident = model("Incident", incidentSchema);

export default Incident;
