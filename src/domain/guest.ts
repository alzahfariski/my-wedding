export type InvitationTheme = "global" | "v1";

export interface GuestDraft {
  id: string;
  name: string;
  phone: string; // e.g. "08123456789" or "628123456789"
  theme: InvitationTheme; // "global" (/) or "v1" (/v1)
  status: "pending" | "sent"; // "Belum Terkirim" | "Sudah Terkirim"
  templateId?: string;
  customMessage?: string;
  date: string;
  createdAt?: any;
}

export interface WATemplate {
  id: string;
  title: string;
  content: string;
  isDefault?: boolean;
  createdAt?: any;
}
