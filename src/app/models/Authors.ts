import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
    authorId: string;
    email: string;
    fullName: string;
    description: string;
    imageUrl: string;
    dateOfBirth: Date;
    birthdayMailLastSentYear?: number | null;
}

const AuthorSchema = new Schema<IAuthor>({
    authorId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    birthdayMailLastSentYear: { type: Number, default: null },
});

export default mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);
