// import express from 'express'
// import 'dotenv/config'

// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import cors from 'cors'

// import session from 'express-session'
// import film from './routes/film.route.js'
// import user from './routes/user.route.js'
// import favorite from './routes/favorite.route.js'
// import register from './api_rest/api.routes/user.api.route.js'
// import login from './api_rest/api.routes/user.api.route.js'

// import FilmController from './controllers/film.controller.js'




// const app = express()

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);



// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],
//     allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
// }))

// // *******
// // Session config: It enables session handling in an Express app.
// //*secret is required to securely sign the session ID stored in the client’s cookie.
// //*resave: false avoids unnecessary session updates in the store.
// //*saveUninitialized: false avoids storing sessions that are new and not modified (helps with performance and privacy).
// //*This is a basic session setup often used with authentication systems (like login/logout) to remember users across requests.
// app.use(session({
//     secret:'anycodeIwant',
//     resave: false,
//     saveUninitialized: false
// }))



// // Make session available in all EJS templates
// app.use((req, res, next) => {
//     res.locals.session = req.session; // Sessio is now accessible in all views
//     next();
// });

// // ******
// // configurer les ressources statiques
// app.use(express.static(join(__dirname, 'public')));

// // *****
// // BEFOR mapping
// // This built-in middleware parses incoming request bodies that are encoded as application/x-www-form-urlencoded (the default content type when submitting forms without enctype="multipart/form-data").
// // Without this middleware, Express does not automatically parse the body of a form POST request, so req.body would be undefined.

// app.use(express.urlencoded())

// app.use(express.json());

// // Mapping entre routes et le routeur for 
// app.use("/film", film)
// app.use("/user", user);  // user router handles /login and /register
// app.use("/favorite", favorite);

// //Mapping for API
// app.use("/register",register);
// app.use("/login",login)

// // Configuration du moteur de template
// app.set('view engine', 'ejs');
// app.set('views', join(__dirname, 'templates'));


// app.get(['/', '/home', '/accueil'], FilmController.showHome);



// app.all("/*splat", (req, res) => {
//     res
//         .status(404)
//         .end("Page not found: check the route")
// })

// const PORT = process.env.PORT || 5555

// app.listen(PORT, () => {
//     console.log(`Adresse serveur : http://localhost:${PORT}`);
// })

import express from 'express'
import 'dotenv/config'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import cors from 'cors'
import session from 'express-session'

import film from './routes/film.route.js'
import user from './routes/user.route.js'
import favorite from './routes/favorite.route.js'
import register from './api_rest/api.routes/user.api.route.js'
import login from './api_rest/api.routes/user.api.route.js'
import FilmController from './controllers/film.controller.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}))

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// Make session available in views
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

// Static files
app.use(express.static(join(__dirname, 'public')))

// Body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use("/film", film)
app.use("/user", user)
app.use("/favorite", favorite)

// API routes
app.use("/register", register)
app.use("/login", login)

// View engine
app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'templates'))

// Pages
app.get(['/', '/home', '/accueil'], FilmController.showHome)

// 404
app.all("/*splat", (req, res) => {
  res.status(404).end("Page not found: check the route")
})

// Server
const PORT = process.env.PORT || 5555
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})