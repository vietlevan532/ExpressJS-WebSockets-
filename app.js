const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const db = require('./config/mongoose');
const route = require('./routers');
// const socketIO = require('socket.io');
const app = express();
const http = require('http').Server(app);
// const server = http.createServer(app);
// const io = socketIO(server);
const handlebarsHelpers = require('./config/helpers');

// Database connection
db.connect();

// Dot ENV
require('dotenv').config();

// Body parser
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Template engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Handlebars helpers registration
handlebars.create({
    helpers: handlebarsHelpers.registerHelpers()
});

// Router
route(app)

http.listen(process.env.PORT, () => console.log(`Chat app listening on server http://localhost:${process.env.PORT}`));
