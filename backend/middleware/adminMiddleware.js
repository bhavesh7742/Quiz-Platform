const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Access denied. Admin rights required.' });
  }
};

module.exports = { admin };
