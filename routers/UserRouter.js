const router = require('express').Router();
const authController = require('../controllers/AuthController');
const userController = require('../controllers/UserController');
const groupController = require('../controllers/GroupController');
const uploadImage = require('../config/imageUploads');
const authenticated = require('../middlewares/Authenticated');
const session = require('express-session');
const cookie = require('cookie-parser');

    // Use session
    router.use(session({ 
        secret: 'vietlv_session_secret_key',
        resave: false,
        saveUninitialized: true }));

    // Use cookie parser
    router.use(cookie());

    // [GET] /register
    router.get('/register', authenticated.verifyLogout, authController.renderRegister);

    // [POST] /registration
    router.post('/registration', uploadImage.single('image'), authController.register);

    // [GET] /login
    router.get('/', authenticated.verifyLogout, authController.renderLogin);

    // [POST] /sign-in
    router.post('/sign-in', authController.login);
    
    // [GET] (/logout)
    router.get('/logout', authenticated.verifyLogin, authController.logout);
    
    router.get('/chat-home', authenticated.verifyLogin, userController.renderChat_Home);

    // [GET] (/groups)
    router.get('/groups', authenticated.verifyLogin, groupController.renderGroups);
    // [POST] (/create-group)
    router.post('/groups', uploadImage.single('image'), groupController.createGroup);

    // [GET] .get-members
    router.post('/get-members', authenticated.verifyLogin, groupController.getMembers);
    router.post('/add-members', authenticated.verifyLogin, groupController.addMembers);

    
    // [POST] (/change-password)
    router.post('/change-password', authController.changePassword);

    router.get('*', function(req, res){
        res.redirect('/');
    })

module.exports = router;
