import favoritRepository from '../repositories/favorite.repository.js';
import filmRepository from '../repositories/film.repository.js';

// RENDER FAVORITES page (GET)

const showFavorite = (req, res) => {
  const userId = req.session.userId
  res.render('favorite', 
    { error: [], 
      values: {} })
};


//ADD film to USER favorites and stay on the same page

const addFavorite = async (req, res) => {
  const userId = req.session.userId       // user's id passed from session
  const filmId = req.body.filmId         // film's id  passed from button's form [hidden value]
  const userName = req.session.firstname || "Dear user"
  // Check if user is logged in and filmId is provided
  if (!userId || !filmId) {
    console.warn('Missing user or film info:', { userId, filmId });
    return res.status(400).send("Missing user or film info");
  }

  try {
    // Try to add this film to user's favorites 
    const result = await favoritRepository.add(userId, filmId);

    // Get all films to stay on inex landing page
    const films = await filmRepository.findAll();

    // Case 1: database operation failed
    if (!result) {
      console.error('Failed to insert favorite:', { userId, filmId });
      return res.render('index', {
        films,
        erreurs: ['Could not add favorite due to server issue'],
        session: req.session,
        msg: ['Try to add this film later. Sorry']
      });
    }

    // Case 2: the film is already in this user's favorites
    if (result.alreadyExists) {
      console.info('Film already in favorites:', { userId, filmId });
      return res.render('index', {
        films,
        erreurs: [],
        session: req.session,
        msg: ['No need to add this film to favorites, it was there already!']
      });
    }

    // Case 3: the film is added as wanted
    if (result.insertId) {
      console.info('Film added to favorites:', { userId, filmId, insertId: result.insertId });

     
      return res.render('index', {
        films,
        erreurs: [],
        session: req.session,
        msg: [`${userName}, this film is now in your favorites`]
      });
    }

    // Case 4: If repository returns a result that is neither a successful insert nor an “already exists” 
    console.warn('Unexpected result from repository:', result);
    return res.render('index', {
      films,
      erreurs: ['Unexpected issue occurred'],
      session: req.session,
      msg: []
    });

  } catch (err) {
    // Log full error description for debugging
    console.error('Error in addFavorite controller:', err);

    const films = await filmRepository.findAll(); // ensure we still stay on index
    res.status(500).render('index', {
      films,
      erreurs: ['Unexpected server error occurred. Please try again.'],
      session: req.session,
      msg: []
    });
  }
};


const favoriteByUser = async (req, res) => {
  const userId = req.session.userId;       // user id get from session

  const favorite = await favoritRepository.favoritesForUser(userId);

  // console.log("Debugging", favorite);

  if (favorite) {
    res.render('favorite', {
      favorite,
      erreurs: []
    })
  } else {
    res.render('favorite', {
      favorite: [],
      erreurs: ['Empty DB']
    })
  }

}

const deleteFavoriteFilm = async (req, res) => {
  const userId = req.session.userId;
  const filmId = req.body.filmId;

  if (!userId || !filmId) {
    return res.status(400).send("Missing user or film info");
  }

  try {
    await favoritRepository.remove(userId, filmId);

    // Reload updated favorites
    const favorite = await favoritRepository.favoritesForUser(userId);

    if (favorite && favorite.length > 0) {
      res.render('favorite', {
        favorite,
        erreurs: [],
        session: req.session,
        msg: ['Film removed from favorites']
      });
    } else {
      res.render('favorite', {
        favorite: [],
        erreurs: [],
        session: req.session,
        msg: ['You have no films in favorites yet.']
      });
    }
  } catch (err) {
    console.error("Error deleting favorite:", err);
    res.status(500).render('favorite', {
      favorite: [],
      erreurs: ['Could not remove favorite. Please try again.'],
      session: req.session,
      msg: []
    });
  }
};



export default { showFavorite, addFavorite, deleteFavoriteFilm, favoriteByUser };