import mongoose, { Schema, Document } from "mongoose";

export interface IGenre extends Document {
    genreId: string;
    genreName: string;
    genreDescription: string;
    imageUrl: string;
}

const GenreSchema = new Schema<IGenre>({
    genreId: { type: String, required: true, unique: true },
    genreName: { type: String, required: true },
    genreDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
});

export default mongoose.models.Genre || mongoose.model<IGenre>("Genre", GenreSchema);
