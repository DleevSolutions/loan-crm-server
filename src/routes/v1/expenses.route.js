const express = require('express');
const expensesController = require('../../controllers/expenses.controller');
const router = express.Router();

router.get('/find', expensesController.findAllExpenses);
router.post('/create', expensesController.createExpenses);
router.put('/update', expensesController.updateExpenses);
router.delete('/delete', expensesController.deleteExpenses);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expenses management and retrieval
 */

/**
 * @swagger
 * /expenses/find:
 *   get:
 *     summary: Get expenses list based on role
 *     description: Only logged in member can retrieve expenses list
 *     tags: [Expenses]
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
 * /expenses/create:
 *   post:
 *     summary: Create expenses
 *     tags: [Expenses]
 *     parameters:
 *      - in: query
 *        name: user_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "cc18404c-c51d-4da5-ae36-6e4d223d97da"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expenses_type
 *               - amount
 *               - status
 *             properties:
 *               expenses_type:
 *                 type: string
 *               amount:
 *                 type: decimal(10,2)
 *               remark:
 *                 type: string
 *               status:
 *                 type: boolean
 *             example:
 *               expenses_type: "Salary"
 *               amount: 2000.00
 *               remark: "10月"
 *               status: false
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /expenses/update:
 *   put:
 *     summary: Update expenses data
 *     tags: [Expenses]
 *     parameters:
 *      - in: query
 *        name: expenses_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "7a7d9c0a-4788-4234-a175-b8f66c4fe337"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                  type: boolean
 *             example:
 *               status: true
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /expenses/delete:
 *   delete:
 *     summary: Remove expenses
 *     tags: [Expenses]
 *     parameters:
 *      - in: query
 *        name: expenses_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "7a7d9c0a-4788-4234-a175-b8f66c4fe337"
 *     responses:
 *       "200":
 *         description: OK
 */
