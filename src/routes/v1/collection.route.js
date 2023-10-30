const express = require('express');
const collectionController = require('../../controllers/collection.controller');
const router = express.Router();

router.get('/find', collectionController.findCollection);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: Collections management and retrieval
 */

/**
 * @swagger
 * /collection/find:
 *   get:
 *     summary: Get collection list based on role
 *     description: Only logged in member can retrieve collection list
 *     tags: [Collections]
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
 *        name: date
 *        required: true
 *        schema:
 *          type: string
 *          default: "2023-10-29"
 *     responses:
 *       "200":
 *         description: OK
 */
