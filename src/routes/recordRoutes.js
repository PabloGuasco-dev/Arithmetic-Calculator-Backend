const express = require('express');
const { getRecords, deleteRecord } = require('../controllers/recordController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: User operation records
 */

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records for the authenticated user
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: Successfully retrieved records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   operation_id:
 *                     type: string
 *                     example: 60c72b2f9b1d8c001c8e4c12
 *                   user_id:
 *                     type: string
 *                     example: 60c72b2f9b1d8c001c8e4c13
 *                   amount:
 *                     type: number
 *                     example: 8
 *                   user_balance:
 *                     type: number
 *                     example: 90
 *                   operation_response:
 *                     type: string
 *                     example: "8"
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2021-06-15T14:48:00.000Z"
 *       401:
 *         description: Unauthorized
 */

router.get('/', authenticate, getRecords);


router.delete('/:id', authenticate, deleteRecord);

module.exports = router;
