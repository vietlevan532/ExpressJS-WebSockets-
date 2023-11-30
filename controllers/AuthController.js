const User = require('../models/User');
const bcrypt = require('bcrypt');

class AuthController {

    //[GET] (/register)
    renderRegister (req, res, next) {
        try {
            res.render('register', { layout: false, message: req.query.message, messageFailed: req.query.messageFailed });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //[POST] (/registration)
    register = async (req, res) => {
        try {
            const { name, gender, email, username, password, confirmPassword } = req.body;
            const checkEmail = await User.findOne({ email: email});
            const checkUsername = await User.findOne({ username: username});
            const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
            if (checkEmail) {
                return res.redirect('/register?messageFailed=Email already exists!');
            } else if (checkUsername) {
                return res.redirect('/register?messageFailed=Username already exists!');
            } else if (password !== confirmPassword) {
                return res.redirect('/register?messageFailed=Confirm password is not match!');
            }else {
                await User.create({
                    name: name,
                    email: email,
                    username: username,
                    password: hashPassword,
                    gender: gender,
                    avatar: 'images/' + req.file.filename
                    //lastActive : Date.parse(lastActive),
                });
                return res.redirect('/register?message=Register successfully!');
            }
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    //[GET] (/login)
    renderLogin (req, res, next) {
        try {
            res.render('login', { layout: false, message: req.query.message });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    //[POST] (/sign-in)
    login = async (req, res) => {
        try {
            const {usernameOrEmail, password} = req.body;
            const user = await User.findOne({
                $or: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail }
                ]
            });
            if (!user) {
                return res.redirect('/login?message=Email or username does not exist!');
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.redirect('/login?message=Password is not match. Please try again!');
            }
            if (user && passwordMatch) {
                user.status = true;
                user.save();
                req.session.user = user;
                return res.redirect('/chat-home');
            }
        } catch (error) {
            return res.status(500).json({ error: 'Login failed!' });
        }
    }

    //[POST] (/auth/change-password)
    changePassword = async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            const { oldPassword, newPassword, confirmPassword } = req.body;
            if (!await bcrypt.compare(oldPassword, user.password)) {
                return res.status(401).send({ message: 'Invalid password!' });
            }
            if (oldPassword === newPassword) {
                return res.status(400).send({ message: 'New password cannot be the same as the old password!' });
            }
            if (newPassword!== confirmPassword) {
                return res.status(400).send({ message: 'Passwords do not match!' });
            }
            user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
            user.save();
            return res.status(200).send({ message: 'Change password successfully' });
        } catch (error) {
            return res.status(400).send({ message:'Change Password failed!' });
        }
    }

    //[GET] (/logout)
    logout = async (req, res) => {
        try {
            req.session.destroy();
            res.redirect('/');
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = new AuthController;