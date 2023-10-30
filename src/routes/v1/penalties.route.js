const express = require('express');
const penaltiesController = require('../../controllers/penalties.controller');
const router = express.Router();

router.post('/create', penaltiesController.createPenalty);
router.delete('/delete', penaltiesController.deletePenalty);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Penalties
 *   description: Penalties management
 */

/**
 * @swagger
 * /penalty/create:
 *   post:
 *     summary: Create penalty
 *     tags: [Penalties]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "d17a0a5f-ea33-4266-bb02-0866a2b5bd28"
 *      - in: query
 *        name: loan_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "1656f0a8-e8fd-4a9c-a31b-b5ab8902a51a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *               amount:
 *                 type: decimal
 *               pay_date:
 *                 type: decimal
 *               remark:
 *                 type: string
 *             example:
 *               type: LOAN
 *               amount: 30
 *               pay_date: ""
 *               remark: ""
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /penalty/delete:
 *   delete:
 *     summary: Remove penalty
 *     tags: [Penalties]
 *     parameters:
 *      - in: query
 *        name: payment_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "adc64b92-6793-42e2-b75c-7aaefaec3d46"
 *     responses:
 *       "200":
 *         description: OK
 */
