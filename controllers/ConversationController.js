const Conversation = require('../models/Conversation');
const User = require('../models/User');

class ConversationController {
    
    // [POST] (/conversations/save-message)
    saveMessage = async (req, res) => {
        try {
            const conversation = new Conversation({
                sender: req.body.sender,
                receiver: req.body.receiver,
                message: req.body.message
            });
            const conversationSaved = await conversation.save();
            res.status(200).send({ success: true, msg: 'Saved chat!', data: conversationSaved });
        } catch (error) {
            res.status(400).send({ success: false, msg: error.message });
        }
    }

    // [POST] (/conversations/delete-message)
    deleteMessage = async (req, res) => {
        try {
            await Conversation.deleteOne({ _id: req.body.id });
            res.status(200).send({ success: true });
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }

    // [POST] (/conversations/update-message)
    updateMessage = async (req, res) => {
        try {
            await Conversation.findByIdAndUpdate({ _id: req.body.id }, {
                $set: {
                    message: req.body.message
                }
            });
            res.status(200).send({ success: true });
        } catch (error) {
            res.status(500).send({ success: false, msg: error.message });
        }
    }
}

module.exports = new ConversationController;
