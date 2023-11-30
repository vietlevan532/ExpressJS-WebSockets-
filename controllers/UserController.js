const User = require('../models/User');

class UserController {

    renderChat_Home = async (req, res, next) => {
        try {
            const users = await User.find({ _id: { $nin: [req.session.user._id] } });
            res.render('home', { user: req.session.user, users: users });
        } catch (error) {
            res.status(404).json(error);
        }
    }

}

module.exports = new UserController;
