import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username?: string;
  name: string;
  email: string;
  password?: string;
  dateOfBirth?: Date;
  image?: string;
  gender?: string;
  bio?: string;
  emailVerified?: string,
  others?: object;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: false },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    dateOfBirth: { type: Date },
    image: { type: String },
    gender: { type: String },
    bio: { type: String },
    emailVerified: {type: String},
    others: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
