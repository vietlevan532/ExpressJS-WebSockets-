const mongoose = require('mongoose');

// Mongoose connect
async function connect() {
    
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatBox_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Mongoose connected!');
    } catch (error) {
        console.log('Mongoose connect failed!');
    }

}

module.exports = { connect };