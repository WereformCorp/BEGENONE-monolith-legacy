module.exports = async (req, res, next) => {
  const { user } = res.locals;
  if (user)
    if (!user.active || user.active === false)
      return res.redirect('/re-verify');

  next(); // If the user is active, proceed to the next middleware or route handler
};
