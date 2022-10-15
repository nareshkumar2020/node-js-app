/* const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
} */

const User = require('../model/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises;
// const path = require('path');
const ROLES_LIST = require('../config/rolesList');


const handlLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required' });
    }

    const foundUser = await User.findOne({ username: user }).exec();
    // usersDB.users.find(person => person.username == user);

    if (!foundUser) {
        return res.sendStatus(401);
    }

    try {
        const match = await bcrypt.compare(pwd, foundUser.password);

        if (match) {
            const accessToken = jwt.sign(
                { "username": foundUser.username, "roles": foundUser.roles },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username, "roles": foundUser.roles },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // save refresh token with current user
            /*           const otherUsers = usersDB.users.filter(person => person.username != user);
                      const currentUser = { ...foundUser, refreshToken };
                      usersDB.setUsers([...otherUsers, currentUser]);
          
                      await fsPromises.writeFile(
                          path.join(__dirname, '..', 'model', 'users.json'),
                          JSON.stringify(usersDB.users)
                      ); */

            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ accessToken })
        } else {
            res.sendStatus(401);
        }

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handlLogin }