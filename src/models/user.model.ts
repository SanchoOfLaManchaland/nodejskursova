import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  createdAt: Date
  characters: mongoose.Types.ObjectId[]
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
})

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)