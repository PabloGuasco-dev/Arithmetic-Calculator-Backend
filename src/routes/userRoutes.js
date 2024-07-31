const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


/* @swagger
* tags:
*   name: Users
*   description: User management and authentication
*/

/**
* @swagger
* /api/auth/login:
*   post:
*     summary: Login a user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 example: testuser
*               password:
*                 type: string
*                 example: password123
*     responses:
*       200:
*         description: Login successful
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*                 userId:
*                   type: string
*                   example: 60c72b2f9b1d8c001c8e4c13
*       400:
*         description: Invalid credentials
*/

router.post('/register', userController.register);

/**
* @swagger
* /api/users:
*   post:
*     summary: Register a new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               username:
*                 type: string
*                 example: newuser
*               password:
*                 type: string
*                 example: password123
*               balance:
*                 type: number
*                 example: 100
*     responses:
*       201:
*         description: User registered successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 userId:
*                   type: string
*                   example: 60c72b2f9b1d8c001c8e4c14
*       400:
*         description: Invalid input
*/

router.post('/login', userController.login);

module.exports = router;


