const express = require('express');
const usersController = require('../../controllers/users.controller');
const router = express.Router();

router.get('/find', usersController.findAllUsers);
router.post('/create', usersController.createUser);
router.put('/update', usersController.updateUser);
router.delete('/delete', usersController.deleteUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management and retrieval
 */

/**
 * @swagger
 * /user/find:
 *   get:
 *     summary: Get user list based on role
 *     description: Only logged in user can retrieve user list
 *     tags: [Users]
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
 *        name: search_text
 *        schema:
 *          type: string
 *      - in: query
 *        name: row_per_page
 *        required: true
 *        schema:
 *          type: integer
 *          default: 10
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: integer
 *          default: 1
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create user - agents
 *     tags: [Users]
 *     parameters:
 *      - in: query
 *        name: user_id
 
 *        schema:
 *          type: string
 *          default: "9ff76436-9b05-4850-81c9-5606ffdc0c82"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - account_balance
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               account_name:
 *                 type: string
 *               account_no:
 *                 type: string
 *               account_balance:
 *                 type: decimal
 *               role:
 *                 type: string
 *             example:
 *               username: john
 *               password: abc123
 *               account_balance: 1200.5
 *               role: AGENT
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user data
 *     tags: [Users]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "9ff76436-9b05-4850-81c9-5606ffdc0c82"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                  type: string
 *             example:
 *               password: "abc123"
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Remove user
 *     tags: [Users]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "adc64b92-6793-42e2-b75c-7aaefaec3d46"
 *     responses:
 *       "200":
 *         description: OK
 */
