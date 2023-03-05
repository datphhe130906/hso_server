const express = require('express');
const validate = require('../../middlewares/validate');
const webshopController = require('../../controllers/webshop.controller');
const auth = require('../../middlewares/auth');
const webshopValidation = require('../../validations/webshop.validation');

const router = express.Router();

router.get('/', auth(), webshopController.listItem);
router.post('/addItemToPlayer', auth(), validate(webshopValidation.addItemToUserGame), webshopController.addItemToUser);
router.get('/callBack', webshopController.getCallBack);
router.post(
  '/createTransaction',
  auth(),
  validate(webshopValidation.createTransaction),
  webshopController.createTransaction
);
router.post('/napCard', auth(), validate(webshopValidation.napCard), webshopController.napCard);
router
  .route(':transId')
  .get(auth(), webshopController.getTransaction)
  .patch(auth(), validate(webshopValidation.updateTransaction), webshopController.updateTransaction)
  .delete(auth(), webshopController.deleteTransaction);
module.exports = router;
