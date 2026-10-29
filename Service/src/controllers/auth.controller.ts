
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user.model.js";

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(100),

    email: z.string().trim().email().max(254),

    phone: z.string().trim().min(7).max(20),

    password: z.string().min(8).max(72),

    confirmPassword: z.string().min(8).max(72),

    role: z.enum([
      "citizen",
      "project_owner",
      "resource_provider",
    ]),

    organizationName: z
      .string()
      .trim()
      .min(2)
      .max(150)
      .optional(),

    locationEnabled: z.boolean().default(false),

    location: z
      .object({
        type: z.literal("Point"),
        coordinates: z
          .tuple([
            z.number().min(-180).max(180),
            z.number().min(-90).max(90),
          ]),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (
      data.role === "resource_provider" &&
      !data.organizationName
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["organizationName"],
        message: "Organization name is required",
      });
    }

    if (data.role === "project_owner") {
      ctx.addIssue({
        code: "custom",
        path: ["role"],
        message: "Project Owner accounts require authorized creation",
      });
    }

    if (data.locationEnabled && !data.location) {
      ctx.addIssue({
        code: "custom",
        path: ["location"],
        message: "Location coordinates are required when location is enabled",
      });
    }
  });

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
});

function createToken(userId: string, role: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  const expiresIn = (
    process.env.JWT_EXPIRES_IN || "1d"
  ) as SignOptions["expiresIn"];

  return jwt.sign(
    { role },
    secret,
    {
      subject: userId,
      expiresIn,
    }
  );
}


function publicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  organizationName?: string | null;
  providerVerified: boolean;
  locationEnabled: boolean;
  location?: {
    type?: string | null;
    coordinates: number[];
  } | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    ...(user.organizationName
      ? { organizationName: user.organizationName }
      : {}),
    providerVerified: user.providerVerified,
    locationEnabled: user.locationEnabled,
    ...(user.location?.type
      ? {
          location: {
            type: user.location.type,
            coordinates: user.location.coordinates,
          },
        }
      : {}),
  };
}


// POST /api/auth/register
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = parsed.data;
    const email = data.email.toLowerCase();
    const phone = data.phone.trim();

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email address is already registered"
            : "Mobile number is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await User.create({
      name: data.name,
      email,
      phone,
      password: passwordHash,
      role: data.role,
      organizationName:
        data.role === "resource_provider"
          ? data.organizationName
          : undefined,
      providerVerified: false,
      locationEnabled: data.locationEnabled,
      location: data.locationEnabled
        ? data.location
        : undefined,
    });

    const token = createToken(user.id, user.role);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message: "Email address or mobile number is already registered",
      });
    }

    next(error);
  }
}

// POST /api/auth/login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email and password",
      });
    }

    const email = parsed.data.email.toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      parsed.data.password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user.id, user.role);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}
