const express = require('express');
const validate = require('../../middlewares/validate');
const webshopController = require('../../controllers/webshop.controller');
const auth = require('../../middlewares/auth');
const webshopValidation = require('../../validations/webshop.validation');

const router = express.Router();

router.get('/topRank', webshopController.topRank);
router.post('/addItemToPlayer', auth(), validate(webshopValidation.addItemToUserGame), webshopController.addItemToUser);
router.post('/buyMoneyInGame', auth(), validate(webshopValidation.buyMoneyInGame), webshopController.buyMoneyInGame);
router.get('/callBack', webshopController.getCallBack);
router.post('/transaction', auth(), validate(webshopValidation.createTransaction), webshopController.createTransaction);
router.post('/napCard', auth(), validate(webshopValidation.napCard), webshopController.napCard);
router.get('/transaction', auth('manageUsers'), webshopController.getTransactions);
router.get('/myTransaction', auth(), webshopController.getMyTransactions);
router.get('/myHistory', auth(), webshopController.myHistory);
router.get('/listHistories', auth('manageUsers'), webshopController.queryHistory);
router.get('/:type', auth(), webshopController.listItem);
router.post('/:type', auth('manageUsers'), webshopController.createItem);

router
  .route('/:type/:id')
  .get(auth(), webshopController.getItem)
  .patch(auth('manageUsers'), webshopController.updateItem)
  .delete(auth('manageUsers'), webshopController.deleteItem);
// router.get('/:type/:id', auth(), webshopController.getItem);
// router.patch('/:type/:id', auth('manageUsers'), webshopController.updateItem);
// router.delete('/:type/:id', auth('manageUsers'), webshopController.deleteItem);
router
  .route('/transaction/:transId')
  .get(auth('manageUsers'), webshopController.getTransaction)
  .patch(auth('manageUsers'), validate(webshopValidation.updateTransaction), webshopController.updateTransaction)
  .delete(auth('manageUsers'), webshopController.deleteTransaction);
module.exports = router;
