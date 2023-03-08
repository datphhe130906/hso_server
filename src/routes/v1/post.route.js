const express = require('express');
const { postController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', postController.listPost);
router.post('/', auth('getUsers'), postController.createPost);
router
  .route('/:postId')
  .get(postController.getPost)
  .patch(auth('getUsers'), postController.updatePost)
  .delete(auth('getUsers'), postController.delPost);

module.exports = router;
