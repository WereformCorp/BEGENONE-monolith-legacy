const logout = (req, res) => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(`LOGOUT | AUTH CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
};

module.exports = logout;
