const router = require('express').Router();
const authController = require('../controllers/AuthController');
const userController = require('../controllers/UserController')
const uploadImage = require('../config/imageUploads');
const authenticated = require('../middlewares/Authenticated');
const session = require('express-session');

    // Use session
    router.use(session({ 
        secret: 'vietlv_session_secret_key',
        resave: false,
        saveUninitialized: true }));

    // [GET] /register
    router.get('/register', authenticated.verifyLogout, authController.renderRegister);

    // [POST] /registration
    router.post('/registration', uploadImage.single('image'), authController.register);

    // [GET] /login
    router.get('/', authenticated.verifyLogout, authController.renderLogin);

    // [POST] /sign-in
    router.post('/sign-in', authController.login);

    router.get('/chat-home', authenticated.verifyLogin, userController.renderChat_Home);

    // [POST] (/change-password)
    router.post('/change-password', authController.changePassword);

    // [GET] (/logout)
    router.get('/logout', authenticated.verifyLogin, authController.logout);

    router.get('*', function(req, res){
        res.redirect('/');
    })

module.exports = router;
