
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model.js";

async function checkConflict() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const phone = process.env.OWNER_PHONE?.trim();

  if (!process.env.MONGODB_URI || !email || !phone) {
    throw new Error("Check MONGODB_URI, OWNER_EMAIL and OWNER_PHONE in .env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const users = await User.find({
    $or: [{ email }, { phone }],
  })
    .select("name email phone role isActive")
    .lean();

  if (users.length === 0) {
    console.log("No matching account found. Check the database URI used by your backend.");
  } else {
    console.log("Matching accounts:");
    for (const user of users) {
      console.log({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }
}

checkConflict()
  .catch(console.error)
  .finally(async () => {
    await mongoose.disconnect();
  });
