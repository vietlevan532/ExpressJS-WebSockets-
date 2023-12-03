const router = require('express').Router();
const conversationController = require('../controllers/ConversationController');

    // [POST] /conversations/save-message
    router.post('/save-message', conversationController.saveMessage);

    // [POST] /conversations/delete-message
    router.delete('/delete-message', conversationController.deleteMessage);

    // [POST] /conversations/update-message
    router.post('/update-message', conversationController.updateMessage);

module.exports = router;
