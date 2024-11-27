// middleware/checkActiveStatus.js
// const AppError = require('./appError'); // Make sure you have an AppError class for error handling

module.exports = async (req, res, next) => {
  // Assuming `req.user` contains the logged-in user's data after authentication
  const { user } = res.locals; // This would be set after user is authenticated, e.g. using JWT
  // console.log(`USER FROM CHECK ACTIVE STATUS:`, user);
  if (user)
    if (!user.active) {
      return res.redirect('/re-verify');
    }

  next(); // If the user is active, proceed to the next middleware or route handler
};
