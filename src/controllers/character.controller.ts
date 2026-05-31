import { Request, Response } from 'express'
import { Character } from '../models/character.model'
import { User } from '../models/user.model'

interface SessionUser {
  id: string
  username: string
  email: string
}

export const getAllCharacters = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const characters = await Character.find({ owner: user!.id }).sort('-createdAt')
    res.render('characters/index', { characters, user })
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.status(500).render('error', { message: 'Failed to load characters', user })
  }
}

export const showCreateForm = (req: Request, res: Response): void => {
  const user = (req as any).session?.user as SessionUser | undefined
  res.render('characters/create', { error: null, user })
}

export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  const { name, race, characterClass, level, background, strength, dexterity, constitution, intelligence, wisdom, charisma, armorClass, hitPoints, speed, abilities, inventory, notes } = req.body
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const character = new Character({
      name,
      race,
      characterClass,
      level: parseInt(level) || 1,
      background,
      stats: {
        strength: parseInt(strength) || 10,
        dexterity: parseInt(dexterity) || 10,
        constitution: parseInt(constitution) || 10,
        intelligence: parseInt(intelligence) || 10,
        wisdom: parseInt(wisdom) || 10,
        charisma: parseInt(charisma) || 10
      },
      armorClass: parseInt(armorClass) || 10,
      hitPoints: parseInt(hitPoints) || 10,
      speed: parseInt(speed) || 30,
      abilities: abilities || '',
      inventory: inventory || '',
      notes: notes || '',
      owner: user!.id
    })
    await character.save()
    await User.findByIdAndUpdate(user!.id, { $push: { characters: character._id } })
    res.redirect('/characters')
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.render('characters/create', { error: 'Failed to create character', user })
  }
}

export const showCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const character = await Character.findOne({ _id: req.params.id, owner: user!.id })
    if (!character) {
      res.status(404).render('error', { message: 'Character not found', user })
      return
    }
    res.render('characters/show', { character, user })
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.status(500).render('error', { message: 'Failed to load character', user })
  }
}

export const showEditForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const character = await Character.findOne({ _id: req.params.id, owner: user!.id })
    if (!character) {
      res.status(404).render('error', { message: 'Character not found', user })
      return
    }
    res.render('characters/edit', { character, error: null, user })
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.status(500).render('error', { message: 'Failed to load character', user })
  }
}

export const updateCharacter = async (req: Request, res: Response): Promise<void> => {
  const { name, race, characterClass, level, background, strength, dexterity, constitution, intelligence, wisdom, charisma, armorClass, hitPoints, speed, abilities, inventory, notes } = req.body
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const character = await Character.findOneAndUpdate(
      { _id: req.params.id, owner: user!.id },
      {
        name, race, characterClass,
        level: parseInt(level) || 1,
        background,
        stats: {
          strength: parseInt(strength) || 10,
          dexterity: parseInt(dexterity) || 10,
          constitution: parseInt(constitution) || 10,
          intelligence: parseInt(intelligence) || 10,
          wisdom: parseInt(wisdom) || 10,
          charisma: parseInt(charisma) || 10
        },
        armorClass: parseInt(armorClass) || 10,
        hitPoints: parseInt(hitPoints) || 10,
        speed: parseInt(speed) || 30,
        abilities: abilities || '',
        inventory: inventory || '',
        notes: notes || ''
      },
      { returnDocument: 'after' }
    )
    if (!character) {
      res.status(404).render('error', { message: 'Character not found', user })
      return
    }
    res.redirect(`/characters/${character._id}`)
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.render('characters/edit', { character: req.body, error: 'Failed to update character', user })
  }
}

export const deleteCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).session?.user as SessionUser | undefined
    const character = await Character.findOneAndDelete({ _id: req.params.id, owner: user!.id })
    if (character) {
      await User.findByIdAndUpdate(user!.id, { $pull: { characters: character._id } })
    }
    res.redirect('/characters')
  } catch (_error) {
    const user = (req as any).session?.user as SessionUser | undefined
    res.status(500).render('error', { message: 'Failed to delete character', user })
  }
}