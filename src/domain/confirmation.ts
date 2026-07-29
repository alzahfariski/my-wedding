export interface ConfirmationInput {
    name: string;
    amount: string;
    bank?: string;
    message?: string;
    creatorId?: string;
}

export interface GiftConfirmation extends ConfirmationInput {
    id: string;
    createdAt?: any;
    date: string;
}
