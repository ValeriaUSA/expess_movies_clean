import express from 'express'
import FilmController from '../controllers/film.controller.js'
// ici, on gère les routes relatives  aux personnes
const router = express.Router()

// Mapping entre route et contrôleur

router.get('/', FilmController.show) //home page for ADMIN
router.get('/', FilmController.showHome) //here make the homepage for ABBONE


//****ADMIN PART */

// Show page to add new movie
router.get('/new', FilmController.showAddFilmForm);

// Handle data form film submission form
router.post('/new', FilmController.addAdminFilm)

// router.get('/delete/:id', PersonneController.remove)

export default router