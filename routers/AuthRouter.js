const router = require('express').Router();
const authController = require('../controllers/AuthController');
const middlewareController = require('../controllers/MiddlewareController');

    // [GET] /auth/register
    router.get('/register', authController.renderRegister);

    // [POST] /auth/registration
    router.post('/registration', authController.register);

    // [GET] /auth/login
    router.get('/login', authController.renderLogin);

    // [POST] /auth/sign-in
    router.post('/sign-in', authController.login);

    //[POST] (/auth/change-password)
    router.post('/change-password', authController.changePassword);

    router.post('/logout', middlewareController.verifyToken, authController.logout);

module.exports = router;
