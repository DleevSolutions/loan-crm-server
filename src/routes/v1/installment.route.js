const express = require('express');
const installmentsController = require('../../controllers/installment.controller');
const router = express.Router();

router.get('/find', installmentsController.findAllInstallments);
router.get('/findDetails', installmentsController.findInstallmentDetails);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Installments
 *   description: Installments management and retrieval
 */

/**
 * @swagger
 * /installment/find:
 *   get:
 *     summary: Get installment list based on role
 *     description: Only logged in member can retrieve installment list
 *     tags: [Installments]
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
 *     responses:
 *       "200":
 *         description: OK
 */

/**
 * @swagger
 * /installment/findDetails:
 *   get:
 *     summary: Get installment list based on role
 *     description: Only logged in member can retrieve installment list
 *     tags: [Installments]
 *     parameters:
 *      - in: query
 *        name: loan_id
 *        required: true
 *        schema:
 *          type: string
 *          default: "1656f0a8-e8fd-4a9c-a31b-b5ab8902a51a"
 *     responses:
 *       "200":
 *         description: OK
 */
