class Authenticated {

    verifyLogin = async (req, res, next) => {
        try {
            if (req.session.user) {}
            else {
                res.redirect('/');
            }
            next();
        } catch (error) {
            res.status(500).json(error);
        }
    }

    verifyLogout = async (req, res, next) => {
        try {
            if (req.session.user) {
                res.redirect('/chat-home');
            }
            next();
        } catch (error) {
            res.status(500).json(error);
        }
    }

}

module.exports = new Authenticated;
