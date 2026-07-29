"use server";

export async function verifyPhotoPassword(inputPassword: string): Promise<{ success: boolean; error?: string }> {
  const envPassword = process.env.PASSWORD_PHOTO || process.env.NEXT_PUBLIC_PASSWORD_PHOTO || "alzahdaneffri";

  if (!inputPassword || !inputPassword.trim()) {
    return { success: false, error: "Password photo booth wajib diisi." };
  }

  if (inputPassword.trim() === envPassword.trim()) {
    return { success: true };
  }

  return {
    success: false,
    error: "Password photo booth salah. Silakan tanyakan password kepada panitia acara.",
  };
}
