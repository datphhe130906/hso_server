const express = require('express');
const validate = require('../../middlewares/validate');
const webshopController = require('../../controllers/webshop.controller');
const auth = require('../../middlewares/auth');
const webshopValidation = require('../../validations/webshop.validation');

const router = express.Router();

router.get('/', auth(), webshopController.listItem);
router.get('/topRank', webshopController.topRank);
router.post('/addItemToPlayer', auth(), validate(webshopValidation.addItemToUserGame), webshopController.addItemToUser);
router.get('/callBack', webshopController.getCallBack);
router.post('/transaction', auth(), validate(webshopValidation.createTransaction), webshopController.createTransaction);
router.post('/napCard', auth(), validate(webshopValidation.napCard), webshopController.napCard);
router.get('/transaction', auth('manageUsers'), webshopController.getTransactions);
router.get('/myTransaction', auth(), webshopController.getMyTransactions);
router.patch('/updateItem/:item', auth('manageUsers'), webshopController.updateItem);
router
  .route('/transaction/:transId')
  .get(auth('manageUsers'), webshopController.getTransaction)
  .patch(auth('manageUsers'), validate(webshopValidation.updateTransaction), webshopController.updateTransaction)
  .delete(auth('manageUsers'), webshopController.deleteTransaction);
module.exports = router;
