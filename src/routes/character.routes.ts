import { Router } from 'express'
import { getAllCharacters, showCreateForm, createCharacter, showCharacter, showEditForm, updateCharacter, deleteCharacter } from '../controllers/character.controller'

const router = Router()

router.get('/', getAllCharacters)
router.get('/create', showCreateForm)
router.post('/create', createCharacter)
router.get('/:id', showCharacter)
router.get('/:id/edit', showEditForm)
router.post('/:id/edit', updateCharacter)
router.post('/:id/delete', deleteCharacter)

export default router