import mongoose, { Document, Model } from 'mongoose'

export interface IStatBlock {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface ICharacter extends Document {
  name: string
  race: string
  characterClass: string
  level: number
  background: string
  stats: IStatBlock
  armorClass: number
  hitPoints: number
  speed: number
  abilities: string
  inventory: string
  notes: string
  owner: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const StatBlockSchema = new mongoose.Schema<IStatBlock>({
  strength: { type: Number, min: 1, max: 30, default: 10 },
  dexterity: { type: Number, min: 1, max: 30, default: 10 },
  constitution: { type: Number, min: 1, max: 30, default: 10 },
  intelligence: { type: Number, min: 1, max: 30, default: 10 },
  wisdom: { type: Number, min: 1, max: 30, default: 10 },
  charisma: { type: Number, min: 1, max: 30, default: 10 }
})

const CharacterSchema = new mongoose.Schema<ICharacter>({
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  race: { type: String, required: true },
  characterClass: { type: String, required: true },
  level: { type: Number, min: 1, max: 20, default: 1 },
  background: { type: String },
  stats: { type: StatBlockSchema, required: true },
  armorClass: { type: Number, min: 1, max: 30 },
  hitPoints: { type: Number, min: 1 },
  speed: { type: Number, min: 0 },
  abilities: { type: String, default: '' },
  inventory: { type: String, default: '' },
  notes: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

CharacterSchema.pre('save', function() {
  const currentDate = new Date()
  this.updatedAt = currentDate
})

export const Character: Model<ICharacter> = mongoose.model<ICharacter>('Character', CharacterSchema)