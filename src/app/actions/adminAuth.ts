"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session_token";

function getExpectedToken(): string {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "adminpassword123";
  const secret = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "my-wedding-secret";
  return crypto.createHash("sha256").update(`${username}:${password}:${secret}`).digest("hex");
}

export async function loginAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string }> {
  const envUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const envPassword = (process.env.ADMIN_PASSWORD || "adminpassword123").trim();

  if (!usernameInput || !passwordInput) {
    return { success: false, error: "Username dan password wajib diisi." };
  }

  if (usernameInput.trim() === envUsername && passwordInput.trim() === envPassword) {
    const token = getExpectedToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return { success: true };
  }

  return { success: false, error: "Username atau password salah." };
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
    if (!sessionToken) return false;

    const expectedToken = getExpectedToken();
    return sessionToken === expectedToken;
  } catch (error) {
    console.error("Error verifying admin session:", error);
    return false;
  }
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Error logging out admin:", error);
    return { success: false };
  }
}
