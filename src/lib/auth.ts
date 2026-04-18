import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<{
  userId: string;
  email: string;
  name: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name: string;
    };

    return decoded;
  } catch {
    return null;
  }
}