const User = require('../models/User');
const bcrypt = require('bcrypt');
const { response } = require('express');
const jwt = require('jsonwebtoken');

class AuthController {
    //[GET] (/auth/register)
    renderRegister (req, res, next) {
        res.send('Register Page');
    }

    //[POST] (/auth/registration)
    register = async (req, res) => {
        try {
            const { name, email, username, password } = req.body;
            const checkEmail = await User.findOne({ email: email});
            const checkUsername = await User.findOne({ username: username});
            const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
            if (checkEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            } else if (checkUsername) {
                return res.status(400).json({ message: 'Username already exists' });
            } else {
                await User.create({
                    name: name,
                    email: email,
                    username: username,
                    password: hashPassword,
                    //lastActive : Date.parse(lastActive),
                });
                res.status(200).json({ message: 'User created successfully' });
            }
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //[GET] (/auth/login)
    renderLogin (req, res, next) {
        res.send('Login Page');
    }

    //[POST] (/auth/sign-in)
    login = async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json( {message: 'Username does not exist!' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).json( {message: 'Invalid password!' });
            }
            if (user && passwordMatch) {
                user.status = true;
                user.save();
                const accessToken = jwt.sign({userId: user._id}, process.env.JWT_ACCESS_KEY, {expiresIn:'365d'});
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict'
                });
                return res.status(200).json( {message: 'Login successfully!' });
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

    //[POST] (/auth/logout)
    logout = async (req, res) => {
        response.clearCookie(accessToken);
    }
}

module.exports = new AuthController;