const express = require('express');
const router = express.Router();
const Commentscontroller = require('../controllers/comments');
const commentscontroller = new Commentscontroller();
const authMiddleware = require('../middleware/auth-middleware');

router.get('/:postId', commentscontroller.getComments); // 댓글보기는 로그인 없이 가능 
router.post('/:postId', commentscontroller.postComment);
router.put('/:commentId', commentscontroller.putComment);
router.delete('/:commentId', commentscontroller.deleteComment);

module.exports = router;


