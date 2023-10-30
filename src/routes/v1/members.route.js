const express = require('express');
const membersController = require('../../controllers/members.controller');
const router = express.Router();

router.get('/find', membersController.findAllMembers);
router.post('/create', membersController.createMember);
router.put('/update', membersController.updateMember);
router.delete('/delete', membersController.deleteMember);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Members management and retrieval
 */

/**
 * @swagger
 * /member/find:
 *   get:
 *     summary: Get member list based on role
 *     description: Only logged in member can retrieve member list
 *     tags: [Members]
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
 * /member/create:
 *   post:
 *     summary: Create member
 *     tags: [Members]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "66f1494d-2a3e-42d3-8b93-5c6eb5d1ccbe"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *             properties:
 *               nickname:
 *                 type: string
 *             example:
 *               nickname: 卖鱼佬
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /member/update:
 *   put:
 *     summary: Update member data
 *     tags: [Members]
 *     parameters:
 *      - in: query
 *        name: member_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "dec79648-e383-448a-850a-98e2aa314126"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                  type: string
 *             example:
 *               full_name: "HO LAN XU"
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /member/delete:
 *   delete:
 *     summary: Remove member
 *     tags: [Members]
 *     parameters:
 *      - in: query
 *        name: member_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "adc64b92-6793-42e2-b75c-7aaefaec3d46"
 *     responses:
 *       "200":
 *         description: OK
 */
