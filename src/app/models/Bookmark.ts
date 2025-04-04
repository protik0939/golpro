import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: string;
  contentIds: string[];
}

const BookmarkSchema: Schema = new Schema({
  userId: { type: String, required: true },
  contentIds: { type: [String] },
}, { timestamps: true, collection: 'bookmarks' });

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);