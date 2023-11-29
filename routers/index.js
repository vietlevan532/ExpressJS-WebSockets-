const userRouter = require('./UserRouter');
const authRouter = require('./AuthRouter');
const conversationRouter = require('./ConversationRouter');
const messageRouter = require('./MessageRouter');

function route(app) {

    app.use('/auth', authRouter);

    app.use('/conversations', conversationRouter);

    app.use('/messages', messageRouter);

    app.get('/', (req, res) => res.render('home'));

}

module.exports = route;
