const express = require('express');
const paymentsController = require('../../controllers/payments.controller');
const router = express.Router();

router.get('/find', paymentsController.findAllPayments);
router.post('/create', paymentsController.createPayment);
router.post('/update', paymentsController.updatePayment);
router.delete('/delete', paymentsController.deletePayment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments management and retrieval
 */

/**
 * @swagger
 * /payment/find:
 *   get:
 *     summary: Get payments list based on role
 *     description: Only logged in user can retrieve payments list
 *     tags: [Payments]
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
 *        required: true
 *        schema:
 *          type: string
 *          default: 10/10/2023
 *      - in: query
 *        name: end_date
 *        required: true
 *        schema:
 *          type: string
 *          default: 10/10/2023
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
 * /payment/create:
 *   post:
 *     summary: Create payment
 *     tags: [Payments]
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
 *               remark:
 *                 type: string
 *             example:
 *               type: LOAN
 *               amount: 30
 *               remark: ""
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /payment/update:
 *   put:
 *     summary: Update member data
 *     tags: [Payments]
 *     parameters:
 *      - in: query
 *        name: payment_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "1e4813c9-a148-4df3-86cd-340619831cfc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                  type: decimal
 *             example:
 *               amount: 150
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /payment/delete:
 *   delete:
 *     summary: Remove member
 *     tags: [Payments]
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
