
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

async function createProjectOwner() {
  const {
    MONGODB_URI,
    OWNER_NAME,
    OWNER_EMAIL,
    OWNER_PHONE,
    OWNER_PASSWORD,
  } = process.env;

  if (
    !MONGODB_URI ||
    !OWNER_NAME ||
    !OWNER_EMAIL ||
    !OWNER_PHONE ||
    !OWNER_PASSWORD
  ) {
    throw new Error(
      "Missing required environment variables. Check MONGODB_URI and OWNER_* values."
    );
  }

  if (OWNER_PASSWORD.length < 8) {
    throw new Error("OWNER_PASSWORD must contain at least 8 characters.");
  }

  await mongoose.connect(MONGODB_URI);

  const email = OWNER_EMAIL.trim().toLowerCase();
  const phone = OWNER_PHONE.trim();

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  }).select("+password");

  if (existingUser) {
    if (existingUser.role === "project_owner") {
      console.log("A Project Owner account already exists for this email or phone.");
      return;
    }

    throw new Error(
      "This email or phone belongs to another role. No account was changed."
    );
  }

  const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, 12);

  await User.create({
    name: OWNER_NAME.trim(),
    email,
    phone,
    password: hashedPassword,
    role: "project_owner",
    providerVerified: false,
    locationEnabled: false,
    isActive: true,
  });

  console.log("Project Owner account created successfully.");
  console.log(`Email: ${email}`);
  console.log("Password: not displayed");
}

createProjectOwner()
  .catch((error: unknown) => {
    console.error(
      "Failed to create Project Owner:",
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
