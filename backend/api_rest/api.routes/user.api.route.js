import express from "express";
import userController from "../api.controllers/user.api.controller.js"

const router = express.Router();

// Register a new user ->Login
router.post("/register", userController.register);
router.post("/login", userController.login);


// // Logout user (destroy session)
// router.post("/logout", userController.logout);



export default router;
