const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
// Static folder
app.use(express.static(path.join(__dirname, 'Public')));
// Morgan logger request from client to server
app.use(morgan('combined'));
// Template engine
app.engine('hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.listen(process.env.PORT, () => console.log(`POS app listening on server http://localhost:${process.env.PORT}`));