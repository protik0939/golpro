import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
    authorId: string;
    fullName: string;
    description: string;
    imageUrl: string;
}

const AuthorSchema = new Schema<IAuthor>({
    authorId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

export default mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);
