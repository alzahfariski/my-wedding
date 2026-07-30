import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminWish, AdminPhoto, AdminConfirmation } from "@/domain/admin";
import { GuestDraft, WATemplate } from "@/domain/guest";
import { deleteFromDrive } from "@/app/actions/uploadDrive";

// ==========================================
// 1. WISHES MANAGEMENT
// ==========================================
export function subscribeAdminWishes(
  onSuccess: (wishes: AdminWish[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AdminWish[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "",
          text: data.text || "",
          date: data.date || "",
          color: data.color || "#fef08a",
          creatorId: data.creatorId || "",
          createdAt: data.createdAt,
        };
      });
      onSuccess(list);
    },
    (err) => onError(err)
  );
}

export async function createAdminWish(wish: Omit<AdminWish, "id">): Promise<string> {
  const formattedDate =
    wish.date ||
    new Date()
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");

  const docRef = await addDoc(collection(db, "wishes"), {
    name: wish.name.trim(),
    text: wish.text.trim(),
    color: wish.color || "#fef08a",
    date: formattedDate,
    creatorId: wish.creatorId || "admin",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminWish(id: string, wish: Partial<AdminWish>): Promise<void> {
  const wishDocRef = doc(db, "wishes", id);
  const updateData: Record<string, any> = {};
  if (wish.name !== undefined) updateData.name = wish.name.trim();
  if (wish.text !== undefined) updateData.text = wish.text.trim();
  if (wish.color !== undefined) updateData.color = wish.color;
  if (wish.date !== undefined) updateData.date = wish.date;

  await updateDoc(wishDocRef, updateData);
}

export async function deleteAdminWish(id: string): Promise<void> {
  await deleteDoc(doc(db, "wishes", id));
}

// ==========================================
// 2. PHOTOBOOTH (PHOTOS) MANAGEMENT
// ==========================================
export function subscribeAdminPhotos(
  onSuccess: (photos: AdminPhoto[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AdminPhoto[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          guestName: data.guestName || "",
          imageSrc: data.imageSrc || "",
          fileId: data.fileId || "",
          caption: data.caption || "",
          date: data.date || "",
          creatorId: data.creatorId || "",
          createdAt: data.createdAt,
        };
      });
      onSuccess(list);
    },
    (err) => onError(err)
  );
}

export async function createAdminPhoto(photo: Omit<AdminPhoto, "id">): Promise<string> {
  const formattedDate =
    photo.date ||
    new Date()
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");

  const docRef = await addDoc(collection(db, "photos"), {
    guestName: photo.guestName.trim(),
    caption: photo.caption.trim() || "Momen bahagia!",
    imageSrc: photo.imageSrc,
    fileId: photo.fileId || "",
    date: formattedDate,
    creatorId: photo.creatorId || "admin",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminPhoto(id: string, photo: Partial<AdminPhoto>): Promise<void> {
  const photoDocRef = doc(db, "photos", id);
  const updateData: Record<string, any> = {};
  if (photo.guestName !== undefined) updateData.guestName = photo.guestName.trim();
  if (photo.caption !== undefined) updateData.caption = photo.caption.trim();
  if (photo.imageSrc !== undefined) updateData.imageSrc = photo.imageSrc;
  if (photo.fileId !== undefined) updateData.fileId = photo.fileId;
  if (photo.date !== undefined) updateData.date = photo.date;

  await updateDoc(photoDocRef, updateData);
}

export async function deleteAdminPhoto(id: string, fileId?: string): Promise<void> {
  await deleteDoc(doc(db, "photos", id));
  if (fileId) {
    try {
      await deleteFromDrive(fileId);
    } catch (err) {
      console.error("Error deleting image file from Google Drive:", err);
    }
  }
}

// ==========================================
// 3. CONFIRMATIONS MANAGEMENT
// ==========================================
export function subscribeAdminConfirmations(
  onSuccess: (confirmations: AdminConfirmation[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "confirmations"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AdminConfirmation[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "",
          amount: data.amount || "",
          bank: data.bank || "",
          message: data.message || "",
          creatorId: data.creatorId || "",
          date: data.date || "",
          createdAt: data.createdAt,
        };
      });
      onSuccess(list);
    },
    (err) => onError(err)
  );
}

export async function createAdminConfirmation(
  confirmation: Omit<AdminConfirmation, "id">
): Promise<string> {
  const formattedDate =
    confirmation.date ||
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const docRef = await addDoc(collection(db, "confirmations"), {
    name: confirmation.name.trim(),
    amount: confirmation.amount.trim(),
    bank: confirmation.bank?.trim() || "",
    message: confirmation.message?.trim() || "",
    creatorId: confirmation.creatorId || "admin",
    date: formattedDate,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminConfirmation(
  id: string,
  confirmation: Partial<AdminConfirmation>
): Promise<void> {
  const docRef = doc(db, "confirmations", id);
  const updateData: Record<string, any> = {};
  if (confirmation.name !== undefined) updateData.name = confirmation.name.trim();
  if (confirmation.amount !== undefined) updateData.amount = confirmation.amount.trim();
  if (confirmation.bank !== undefined) updateData.bank = confirmation.bank.trim();
  if (confirmation.message !== undefined) updateData.message = confirmation.message.trim();
  if (confirmation.date !== undefined) updateData.date = confirmation.date;

  await updateDoc(docRef, updateData);
}

export async function deleteAdminConfirmation(id: string): Promise<void> {
  await deleteDoc(doc(db, "confirmations", id));
}

// ==========================================
// 4. GUEST DRAFTS (TAMU UNDANGAN) MANAGEMENT
// ==========================================
export function subscribeAdminGuests(
  onSuccess: (guests: GuestDraft[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "guests"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: GuestDraft[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "",
          phone: data.phone || "",
          theme: data.theme || "global",
          status: data.status || "pending",
          templateId: data.templateId || "",
          customMessage: data.customMessage || "",
          date: data.date || "",
          createdAt: data.createdAt,
        };
      });
      onSuccess(list);
    },
    (err) => onError(err)
  );
}

export async function createAdminGuest(guest: Omit<GuestDraft, "id">): Promise<string> {
  const formattedDate =
    guest.date ||
    new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const docRef = await addDoc(collection(db, "guests"), {
    name: guest.name.trim(),
    phone: guest.phone.trim(),
    theme: guest.theme || "global",
    status: guest.status || "pending",
    templateId: guest.templateId || "",
    customMessage: guest.customMessage || "",
    date: formattedDate,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminGuest(id: string, guest: Partial<GuestDraft>): Promise<void> {
  const docRef = doc(db, "guests", id);
  const updateData: Record<string, any> = {};
  if (guest.name !== undefined) updateData.name = guest.name.trim();
  if (guest.phone !== undefined) updateData.phone = guest.phone.trim();
  if (guest.theme !== undefined) updateData.theme = guest.theme;
  if (guest.status !== undefined) updateData.status = guest.status;
  if (guest.templateId !== undefined) updateData.templateId = guest.templateId;
  if (guest.customMessage !== undefined) updateData.customMessage = guest.customMessage;

  await updateDoc(docRef, updateData);
}

export async function updateAdminGuestStatus(id: string, status: "pending" | "sent"): Promise<void> {
  const docRef = doc(db, "guests", id);
  await updateDoc(docRef, { status });
}

export async function deleteAdminGuest(id: string): Promise<void> {
  await deleteDoc(doc(db, "guests", id));
}

// ==========================================
// 5. WA TEMPLATES MANAGEMENT
// ==========================================
export function subscribeAdminWATemplates(
  onSuccess: (templates: WATemplate[]) => void,
  onError: (error: Error) => void
) {
  const q = query(collection(db, "wa_templates"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: WATemplate[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          content: data.content || "",
          isDefault: !!data.isDefault,
          createdAt: data.createdAt,
        };
      });
      onSuccess(list);
    },
    (err) => onError(err)
  );
}

export async function createAdminWATemplate(template: Omit<WATemplate, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, "wa_templates"), {
    title: template.title.trim(),
    content: template.content.trim(),
    isDefault: !!template.isDefault,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminWATemplate(id: string, template: Partial<WATemplate>): Promise<void> {
  const docRef = doc(db, "wa_templates", id);
  const updateData: Record<string, any> = {};
  if (template.title !== undefined) updateData.title = template.title.trim();
  if (template.content !== undefined) updateData.content = template.content.trim();
  if (template.isDefault !== undefined) updateData.isDefault = template.isDefault;

  await updateDoc(docRef, updateData);
}

export async function deleteAdminWATemplate(id: string): Promise<void> {
  await deleteDoc(doc(db, "wa_templates", id));
}
