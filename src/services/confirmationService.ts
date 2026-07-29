import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ConfirmationInput } from "@/domain/confirmation";

export async function submitConfirmation(input: ConfirmationInput): Promise<string> {
    const formattedDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const docRef = await addDoc(collection(db, "confirmations"), {
        name: input.name.trim(),
        amount: input.amount.trim(),
        bank: input.bank?.trim() || "",
        message: input.message?.trim() || "",
        creatorId: input.creatorId || "",
        createdAt: serverTimestamp(),
        date: formattedDate,
    });

    return docRef.id;
}
