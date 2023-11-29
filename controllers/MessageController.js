const Message = require('../models/Message');

class MessageController {

    // [POST] (/messages/add)
    addMessage = async (req, res) => {
        const newMessage = new Message(req.body);
        try {
            const saveMessage = await newMessage.save();
            res.status(200).json(saveMessage);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    // [GET] (/messages/:conversationId)
    getMessages = async (req, res) => {
        try {
            const messages = await Message.find({
                conversationId: req.params.conversationId
            });
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new MessageController;
