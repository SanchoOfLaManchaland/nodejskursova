import request from 'supertest'
import app from '../src/app'

describe('Full Application Coverage', () => {
  describe('Auth Routes', () => {
    it('GET /login renders login page', async () => {
      const response = await request(app).get('/login')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Вхід')
    })

    it('GET /register renders register page', async () => {
      const response = await request(app).get('/register')
      expect(response.status).toBe(200)
      expect(response.text).toContain('Реєстрація')
    })
  })

  describe('Character Routes', () => {
    it('GET /characters redirects unauthenticated', async () => {
      const response = await request(app).get('/characters')
      expect(response.status).toBe(302)
    })

    it('GET /characters/create redirects unauthenticated', async () => {
      const response = await request(app).get('/characters/create')
      expect(response.status).toBe(302)
    })

    it('GET /characters/:id redirects unauthenticated', async () => {
      const response = await request(app).get('/characters/123')
      expect(response.status).toBe(302)
    })

    it('GET /characters/:id/edit redirects unauthenticated', async () => {
      const response = await request(app).get('/characters/123/edit')
      expect(response.status).toBe(302)
    })
  })

  describe('Home Route', () => {
    it('GET / renders home page', async () => {
      const response = await request(app).get('/')
      expect(response.status).toBe(200)
      expect(response.text).toContain('D&D Characters')
    })
  })
})