import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  cId: String,
  cTitle: String,
  cDescription: String,
  cLandscape: String,
  cPortrait: String,
  cBanner: String,
  cLogo: String,
  cCard: String,
  cLink: String,
  cSquare: String,
  cTrailerYtId: String,
  width: Number,
  height: Number,
  cGenre: [String],
  cAuthors: [String],
  cViwersAge: String,
  cUserVisit: Number,
  cSeasons: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
