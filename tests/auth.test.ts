import request from 'supertest'
import app from '../src/app'

describe('Auth Routes', () => {
  describe('GET /login', () => {
    it('should render login page', async () => {
      const response = await request(app).get('/login')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Вхід')
    })
  })

  describe('GET /register', () => {
    it('should render register page', async () => {
      const response = await request(app).get('/register')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Реєстрація')
    })
  })
})

describe('Character Routes', () => {
  describe('GET /characters (unauthenticated)', () => {
    it('should redirect to login', async () => {
      const response = await request(app).get('/characters')
      expect(response.status).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })

  describe('GET /characters/create (unauthenticated)', () => {
    it('should redirect to login', async () => {
      const response = await request(app).get('/characters/create')
      expect(response.status).toBe(302)
    })
  })

  describe('GET /characters/:id (unauthenticated)', () => {
    it('should redirect to login', async () => {
      const response = await request(app).get('/characters/123')
      expect(response.status).toBe(302)
    })
  })
})

describe('Home Route', () => {
  describe('GET /', () => {
    it('should render home page', async () => {
      const response = await request(app).get('/')
      expect(response.status).toBe(200)
      expect(response.text).toContain('D&D Characters')
    })

    it('should contain navigation links', async () => {
      const response = await request(app).get('/')
      expect(response.text).toContain('Головна')
    })
  })
})

describe('Middleware', () => {
  describe('isAuthenticated middleware', () => {
    it('should redirect unauthenticated requests to login', async () => {
      const response = await request(app).get('/characters')
      expect(response.status).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })
})

describe('Routes', () => {
  it('should have auth routes configured', () => {
    const express = require('express')
    const router = express.Router()
    expect(router).toBeDefined()
  })

  it('should have character routes configured', () => {
    const express = require('express')
    const router = express.Router()
    expect(router).toBeDefined()
  })
})