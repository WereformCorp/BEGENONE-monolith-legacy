const authMiddleware = (req, res, next) => {
  if (!req.user) {
    console.log('User is not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userChannel = req.user.channel;
  console.log(`GETTING THE USER CHANNEL:`, userChannel);
  next();
};

module.exports = authMiddleware;
