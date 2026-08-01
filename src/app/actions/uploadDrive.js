"use server";

import { google } from "googleapis";
import { Readable } from "stream";

// Inisialisasi OAuth2 Client dengan akun pribadi
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

/**
 * Helper to retry Google API calls on transient rate limits (429) or server errors (5xx)
 */
async function withRetry(fn, retries = 3, initialDelay = 500) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const status = error?.status || error?.code || error?.response?.status;
      const isRateLimit =
        status === 429 ||
        error?.message?.toLowerCase().includes("rate limit") ||
        error?.message?.toLowerCase().includes("quota");
      const isServerError = status >= 500 && status < 600;

      if ((isRateLimit || isServerError) && attempt < retries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.warn(
          `[Google Drive API] Retrying operation (attempt ${attempt}/${retries}) after ${delay}ms... Reason:`,
          error?.message
        );
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
}

export async function uploadToDrive(formData) {
  try {
    const file = formData.get("file");
    if (!file) throw new Error("File tidak ditemukan dalam form data.");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `photobooth_${Date.now()}_${(file.name || "photo").replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    // Upload file ke Google Drive dengan retry mechanism
    const response = await withRetry(() =>
      drive.files.create({
        requestBody: {
          name: fileName,
          parents: process.env.GOOGLE_DRIVE_FOLDER_ID
            ? [process.env.GOOGLE_DRIVE_FOLDER_ID]
            : [],
        },
        media: {
          mimeType: file.type || "image/jpeg",
          body: Readable.from(buffer),
        },
        fields: "id, webViewLink",
      })
    );

    const fileId = response?.data?.id;
    if (!fileId) throw new Error("Gagal mendapatkan File ID dari Google Drive.");

    // Set permission reader publik (Non-blocking / Ignored if rate-limited because parent folder is already public)
    try {
      await withRetry(
        () =>
          drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          }),
        2,
        300
      );
    } catch (permError) {
      // Karena folder utama di Google Drive sudah disetting "Siapa saja yang memiliki link dapat mengedit",
      // file baru otomatis mewarisi izin publik (inherited). Rate limit permission tidak boleh menggagalkan upload.
      console.warn(
        "[Google Drive] Notice: permission.create skipped or inherited from public parent folder:",
        permError?.message
      );
    }

    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

    return { success: true, fileId, imageUrl };
  } catch (error) {
    console.error("Error uploading to Drive:", error);
    return {
      success: false,
      error: error?.message || "Gagal mengunggah foto ke Google Drive.",
    };
  }
}

export async function deleteFromDrive(fileId) {
  try {
    if (!fileId) throw new Error("File ID tidak ditemukan.");
    await withRetry(() => drive.files.delete({ fileId }));
    return { success: true };
  } catch (error) {
    console.error("Error deleting from Drive:", error);
    return { success: false, error: error?.message || "Gagal menghapus file dari Drive." };
  }
}
