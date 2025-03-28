import mongoose, { Schema, Document } from "mongoose";

export interface IEmail extends Document {
    email: string;
}

const EmailSchema = new Schema<IEmail>({
    email: { type: String, required: true },
});

export default mongoose.models.SubscribersEmail || mongoose.model<IEmail>("SubscribersEmail", EmailSchema);
