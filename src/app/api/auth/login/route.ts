import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database";
import { User } from "@/database/models/User";

// POST /api/auth/login — verify credentials and return session data.
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (email === "" || password === "") {
      return Response.json(
        { data: null, code: 400, message: "email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    // Same generic message whether the email or the password is wrong.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json(
        { data: null, code: 401, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return Response.json(
      {
        data: { _id: user._id, name: user.name, email: user.email, role: user.role },
        code: 200,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}
