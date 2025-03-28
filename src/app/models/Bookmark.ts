import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: string;
  contentIds: string[];
}

const BookmarkSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  contentIds: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);