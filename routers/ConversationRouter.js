const router = require('express').Router();
const conversationController = require('../controllers/ConversationController');

    // [POST] /conversations/save-message
    router.post('/save-message', conversationController.saveMessage);

    // [POST] /conversations/delete-message
    router.post('/delete-message', conversationController.deleteMessage);

module.exports = router;
