const userRouter = require('./UserRouter');
const conversationRouter = require('./ConversationRouter');

function route(app) {

    //app.use('/conversations', conversationRouter);

    app.use('/', userRouter);

}

module.exports = route;
