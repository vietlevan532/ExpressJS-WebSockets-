const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const db = require('./config/mongoose');
const route = require('./routers');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

// Router
route(app)

app.listen(process.env.PORT, () => console.log(`Chat app listening on server http://localhost:${process.env.PORT}`));
