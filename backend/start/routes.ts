/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Public routes
router.post('/auth/register', [AuthController, 'registerCompany'])
router.post('/auth/login', [AuthController, 'login'])

router.get('/auth/me', [AuthController, 'me']).use(middleware.auth())
