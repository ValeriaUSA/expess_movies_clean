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
  secret: process.env.SESSION_SECRET || 'defaultSecret', // Make sure you set SESSION_SECRET in Render
  resave: false,
  saveUninitialized: false
}))

// Make session available in routes
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})

// Body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use("/film", film)
app.use("/user", user)
app.use("/favorite", favorite)
app.use("/register", register)
app.use("/login", login)

// Home route (API response)
app.get(['/', '/home', '/accueil'], async (req, res) => {
  res.json({ message: "Welcome to Express Movies API" })
})

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Server
const PORT = process.env.PORT || 5555
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
