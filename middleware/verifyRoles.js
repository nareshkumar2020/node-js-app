const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(req.roles)
        if (!req.roles) return res.sendStatus(401);
        const roles = [...allowedRoles];

        if (!roles.map(role => role.includes(req.roles))) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;