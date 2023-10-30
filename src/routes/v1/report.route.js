const express = require('express');
const reportController = require('../../controllers/report.controller');
const router = express.Router();

router.get('/find', reportController.findReport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Report management and retrieval
 */

/**
 * @swagger
 * /report/find:
 *   get:
 *     summary: Get loan list based on role
 *     description: Only logged in member can retrieve loan list
 *     tags: [Report]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "9ff76436-9b05-4850-81c9-5606ffdc0c82"
 *      - in: query
 *        name: role
 *        required: true
 *        schema:
 *          type: string
 *          default: MASTER
 *      - in: query
 *        name: start_date
 *        required: false
 *        schema:
 *          type: date
 *          default: ""
 *      - in: query
 *        name: end_date
 *        required: false
 *        schema:
 *          type: date
 *          default: ""
 *     responses:
 *       "200":
 *         description: OK
 */
