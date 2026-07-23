const User = require('../models/User');

// Simple auth middleware - synchronous wrapper
function authMiddleware(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    // Make userId available to routes
    req.userId = req.session.userId;
    next();
}

function adminOnly(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    // Add admin check logic here if needed
    next();
}

module.exports = {
    authMiddleware,
    adminOnly
};
