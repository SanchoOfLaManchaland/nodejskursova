import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dnd_characters')
    .then(() => console.log('MongoDB connected'))
    .catch((err: Error) => console.error('MongoDB connection error:', err))
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}) as any)

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string
      username: string
      email: string
    }
  }
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'views'))

import authRoutes from './routes/auth.routes'
import characterRoutes from './routes/character.routes'
import { isAuthenticated } from './middleware/auth.middleware'

app.use('/', authRoutes)
app.use('/characters', isAuthenticated, characterRoutes)

app.get('/', (req, res) => {
  res.render('index', { user: (req as any).session?.user })
})

const PORT: number = parseInt(process.env.PORT || '3000', 10)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app
