import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database";
import { User } from "@/database/models/User";
import { sendWelcomeEmail } from "@/lib/mail";

// POST /api/auth/register — create a user with a hashed password.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (name === "" || email === "" || password === "") {
      return Response.json(
        { data: null, code: 400, message: "name, email and password are required" },
        { status: 400 }
      );
    }

    // Email must be unique.
    const exists = await User.findOne({ email });
    if (exists) {
      return Response.json(
        { data: null, code: 409, message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Send the welcome email, but never block registration if it fails.
    try {
      await sendWelcomeEmail(user.name, user.email);
    } catch (mailError) {
      const mailMessage =
        mailError instanceof Error ? mailError.message : String(mailError);
      console.error("Welcome email failed:", mailMessage);
    }

    // Never return the password hash.
    return Response.json(
      {
        data: { _id: user._id, name: user.name, email: user.email, role: user.role },
        code: 201,
        message: "User registered",
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 400, message }, { status: 400 });
  }
}
