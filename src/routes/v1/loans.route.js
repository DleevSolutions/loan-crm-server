const express = require('express');
const loansController = require('../../controllers/loans.controller');
const router = express.Router();

router.get('/find', loansController.findAllLoans);
router.get('/find-archive', loansController.findAllArchiveLoans);
router.get('/find-history', loansController.findLoanHistory);
router.post('/create', loansController.createLoan);
router.post('/update', loansController.updateLoan);
router.delete('/delete', loansController.deleteLoan);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loans management and retrieval
 */

/**
 * @swagger
 * /loan/find:
 *   get:
 *     summary: Get loan list based on role
 *     description: Only logged in member can retrieve loan list
 *     tags: [Loans]
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
 * /loan/find-archive:
 *   get:
 *     summary: Get loan list based on role
 *     description: Only logged in member can retrieve loan list
 *     tags: [Loans]
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
 * /loan/create:
 *   post:
 *     summary: Create loan
 *     tags: [Loans]
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
 *               - member_id
 *               - loan_type
 *               - loan_amount
 *               - full_amount
 *               - collection_per_day
 *               - collection_times
 *             properties:
 *               member_id:
 *                 type: string
 *               loan_type:
 *                 type: string
 *               loan_amount:
 *                 type: decimal
 *               full_amount:
 *                 type: decimal
 *               collection_per_day:
 *                 type: decimal
 *               collection_times:
 *                 type: integer
 *               remark:
 *                 type: string
 *             example:
 *               member_id: "dec79648-e383-448a-850a-98e2aa314126"
 *               loan_type: "loan"
 *               loan_amount: 1200
 *               full_amount: 1200
 *               collection_per_day: 120.0
 *               collection_times: 10
 *               remark: "打包带走"
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /loan/update:
 *   put:
 *     summary: Update loan data
 *     tags: [Loans]
 *     parameters:
 *      - in: query
 *        name: loan_id
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
 * /loan/delete:
 *   delete:
 *     summary: Remove loans
 *     tags: [Loans]
 *     parameters:
 *      - in: query
 *        name: loan_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "7a7d9c0a-4788-4234-a175-b8f66c4fe337"
 *     responses:
 *       "200":
 *         description: OK
 */
