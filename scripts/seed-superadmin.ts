import dotenv from "dotenv";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { User } from "@/features/auth/user.model";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI!;

async function seedSuperadmin() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if superadmin already exists and delete it
    const existingAdmin = await User.findOne({ role: "superadmin" });
    if (existingAdmin) {
      console.log("🗑️  Removing existing superadmin:", existingAdmin.email);
      await User.deleteOne({ role: "superadmin" });
    }

    // Hash password
    const password = "SuperAdmin@123"; // Default password - CHANGE THIS
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create superadmin user
    const superadmin = await User.create({
      email: "purvaistheadmin@gmail.com",
      password: hashedPassword,
      name: "Superadmin",
      role: "superadmin",
    });

    console.log("✅ Superadmin created successfully");
    console.log("📧 Email: purvaistheadmin@gmail.com");
    console.log("🔐 Password: SuperAdmin@123");
    console.log("⚠️  IMPORTANT: Change this password after first login!");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error);
    process.exit(1);
  }
}

seedSuperadmin();
