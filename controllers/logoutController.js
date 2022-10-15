/* const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {
        this.users = data;
    }
}


const fsPromises = require('fs').promises;
const path = require('path'); */

const User = require('../model/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({refreshToken}).exec();
    //  usersDB.users.find(person => person.refreshToken == refreshToken);

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(204);
    }

    // save refresh token with current user
 /*    const otherUsers = usersDB.users.filter(person => person.refreshToken != refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' }
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    ); */

    foundUser.refreshToken = '';
    const result = await foundUser.save();

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);
}

module.exports = { handleLogout }