import filmRepository from '../repositories/film.repository.js'

const show = async (req, res, next) => {
    const films = await filmRepository.findAll()
    if (films) {
        res.render('film', {
            films,
            erreurs: [],
            msg: [],
            session: req.session
        })
    } else {
        res.render('film', {
            films: [],
            erreurs: ["Database data is not accessable"],
            msg: []
        })

    }
}




const showHome = async (req, res, next) => {
    const films = await filmRepository.findAll(); // fetch films
    console.log("Session user:", req.session.user);

    if (req.session.user && user.role == 'ADMIN') {
        // Admin home page
        return res.render('film', {
            films,
            erreurs: [],
            msg: [],
            session: req.session
        });
    }

    // Regular user home page
    if (films) {
        return res.render('index', {
            films,
            erreurs: [],
            msg: [],
            session: req.session
        })
    } 

}
// const showHome = async (req, res, next) => {
//     const films = await filmRepository.findAll(); // fetch films
//     if (films) {
//         res.render('index', {
//             films,            // pass actual films
//             erreurs: [],
//             session: req.session,
//             msg: []
//         });
//     } else {
//         res.render('index', {
//             films: [],
//             erreurs: ["No films available at the moment."],
//             session: req.session,
//             msg: []
//         })
//     }
// };


const showAddFilmForm = async (req, res, next) => {
    res.render('film_admin', {
        erreurs: [],
        session: req.session,
        msg: []
    })
}


const addAdminFilm = async (req, res, next) => {
    try {
        const filmToSave = { ...req.body };

        // Save film
        const newFilm = await filmRepository.saveNewFilm(filmToSave);

        // Case 1: Film was added successfully
        if (newFilm.success) {
            const films = await filmRepository.findAll();
            return res.render("film", {
                films,
                erreurs: [],
                msg: [`Film "${filmToSave.titre}" added successfully!`],
                session: req.session
            });
        }

        // Case 2: Duplicate title
        if (newFilm.reason == "Duplicate") {
            return res.render("film_admin", {
                erreurs: [`Film "${filmToSave.titre}" already exists!`],
                values: filmToSave,
                session: req.session,
                msg: []
            });
        }

        // Case 3: Other DB errors
        return res.render("film_admin", {
            erreurs: ["Unexpected error. Please try again."],
            values: filmToSave,
            session: req.session
        });

    } catch (error) {
        console.error("Error in addAdminFilm:", error);
        return res.render("film_admin", {
            erreurs: ["Server error. Please try again later."],
            values: req.body,
            session: req.session
        });
    }
}

export default { show, showHome, addAdminFilm, showAddFilmForm };


