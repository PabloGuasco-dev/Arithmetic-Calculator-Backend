
/**
 * @swagger
 * tags:
 *   name: Operations
 *   description: Arithmetic operations
 */

/**
 * @swagger
 * /api/operations:
 *   post:
 *     summary: Perform an arithmetic operation
 *     tags: [Operations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: addition
 *               amount1:
 *                 type: number
 *                 example: 5
 *               amount2:
 *                 type: number
 *                 example: 3
 *     responses:
 *       201:
 *         description: Operation performed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation_id:
 *                   type: string
 *                   example: 60c72b2f9b1d8c001c8e4c12
 *                 user_id:
 *                   type: string
 *                   example: 60c72b2f9b1d8c001c8e4c13
 *                 amount:
 *                   type: number
 *                   example: 8
 *                 user_balance:
 *                   type: number
 *                   example: 90
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Operation not found
 */

const express = require('express');
const { performOperation } = require('../controllers/operationController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/', authenticate, performOperation);

module.exports = router;
