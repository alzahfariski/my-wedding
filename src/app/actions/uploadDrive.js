"use server";

import { google } from "googleapis";
import { Readable } from "stream";

// Inisialisasi OAuth2 Client dengan akun pribadi
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadToDrive(formData) {
  try {
    const file = formData.get("file");
    if (!file) throw new Error("File tidak ditemukan");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file langsung menggunakan kuota akun pribadi
    const response = await drive.files.create({
      requestBody: {
        name: `photobooth_${Date.now()}_${file.name}`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;

    // Buat file publik agar bisa dirender di web via
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

    return { success: true, fileId, imageUrl };
  } catch (error) {
    console.error("Error uploading to Drive:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFromDrive(fileId) {
  try {
    if (!fileId) throw new Error("File ID tidak ditemukan");
    await drive.files.delete({ fileId });
    return { success: true };
  } catch (error) {
    console.error("Error deleting from Drive:", error);
    return { success: false, error: error.message };
  }
}
