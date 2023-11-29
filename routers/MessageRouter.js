const router = require('express').Router();
const messageController = require('../controllers/MessageController');

    // [POST] /messages/add
    router.post('/add', messageController.addMessage);

    // [GET] /messages/
    router.get('/:conversationId', messageController.getMessages);

module.exports = router;
