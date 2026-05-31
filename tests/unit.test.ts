describe('Auth Controller', () => {
  const mockUserModel = {
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }

  const mockCharacterModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn()
  }

  beforeEach(() => {
    jest.resetModules()
    jest.mock('../src/models/user.model', () => ({ User: mockUserModel }))
    jest.mock('../src/models/character.model', () => ({ Character: mockCharacterModel }))
  })

  it('showLogin renders login page', async () => {
    const mockReq = { session: {} } as any
    const mockRes = { render: jest.fn() } as any
    const { showLogin } = await import('../src/controllers/auth.controller')
    await showLogin(mockReq, mockRes)
    expect(mockRes.render).toHaveBeenCalledWith('login', { error: null, user: undefined })
  })

  it('showRegister renders register page', async () => {
    const mockReq = { session: {} } as any
    const mockRes = { render: jest.fn() } as any
    const { showRegister } = await import('../src/controllers/auth.controller')
    await showRegister(mockReq, mockRes)
    expect(mockRes.render).toHaveBeenCalledWith('register', { error: null, user: undefined })
  })

  it('login renders error for invalid credentials', async () => {
    const mockReq = { body: { email: 'test@test.com', password: 'wrong' }, session: {} } as any
    const mockRes = { render: jest.fn() } as any
    const { login } = await import('../src/controllers/auth.controller')
    mockUserModel.findOne.mockResolvedValue(null)
    await login(mockReq, mockRes)
    expect(mockRes.render).toHaveBeenCalledWith('login', { error: 'Invalid credentials', user: null })
  })
})

describe('Auth Middleware', () => {
  it('redirects unauthenticated requests to login', () => {
    const mockReq = { session: {} } as any
    const mockRes = { redirect: jest.fn() } as any
    const { isAuthenticated } = require('../src/middleware/auth.middleware')
    const mockNext = jest.fn()
    isAuthenticated(mockReq, mockRes, mockNext)
    expect(mockRes.redirect).toHaveBeenCalledWith('/login')
  })

  it('calls next for authenticated requests', () => {
    const mockReq = { session: { user: { id: '1' } } } as any
    const mockRes = {} as any
    const mockNext = jest.fn()
    const { isAuthenticated } = require('../src/middleware/auth.middleware')
    isAuthenticated(mockReq, mockRes, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })
})

describe('Routes', () => {
  it('auth routes are defined', async () => {
    const { default: router } = await import('../src/routes/auth.routes')
    expect(router).toBeDefined()
    expect(typeof router).toBe('function')
  })

  it('character routes are defined', async () => {
    const { default: router } = await import('../src/routes/character.routes')
    expect(router).toBeDefined()
    expect(typeof router).toBe('function')
  })
})