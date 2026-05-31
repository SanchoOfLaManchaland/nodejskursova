import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/user.model'

interface SessionUser {
  id: string
  username: string
  email: string
}

export const showLogin = (req: Request, res: Response): void => {
  const user = (req as any).session?.user as SessionUser | undefined
  res.render('login', { error: null, user })
}

export const showRegister = (req: Request, res: Response): void => {
  const user = (req as any).session?.user as SessionUser | undefined
  res.render('register', { error: null, user })
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    res.render('login', { error: 'Invalid credentials', user: null })
    return
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    res.render('login', { error: 'Invalid credentials', user: null })
    return
  }
  ;(req as any).session.user = { id: user._id.toString(), username: user.username, email: user.email }
  res.redirect('/characters')
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      res.render('register', { error: 'User already exists', user: null })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })
    await user.save()
    ;(req as any).session.user = { id: user._id.toString(), username: user.username, email: user.email }
    res.redirect('/characters')
  } catch (_error) {
    res.render('register', { error: 'Registration failed', user: null })
  }
}

export const logout = (req: Request, res: Response): void => {
  ;(req as any).session.destroy(() => {
    res.redirect('/')
  })
}