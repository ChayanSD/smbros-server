import { prisma } from "../../lib/db";
import bcrypt from "bcryptjs";
import { LoginData } from "../../schemas/auth/login.schema";

export const loginUserService = async (data: LoginData) => {
  // Find user by unique field (email)
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("User is not verified. Please complete verification first.");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Return sanitized user object (no password)
  const { password, ...safeUser } = user;
  return safeUser;
};
