import express from 'express';
import FavoriteController from '../controllers/favorite.controller.js';

const router = express.Router();

// GET route to show users favorites
router.get('/', FavoriteController.favoriteByUser);

// POST route to add  favorite
router.post('/add', FavoriteController.addFavorite);

// //POST route to remove  favorite
router.post('/delete', FavoriteController.deleteFavoriteFilm );

export default router;
