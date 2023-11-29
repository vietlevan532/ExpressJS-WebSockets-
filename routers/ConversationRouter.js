const router = require('express').Router();
const conversationController = require('../controllers/ConversationController');

    // [POST] /conversations/new-conversation
    router.post('/new-conversation', conversationController.newConversation);

    // [GET] /conversations/:userId
    router.get('/:userId', conversationController.getConversations);

module.exports = router;
