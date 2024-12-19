// Ensure that a given input is valid before proceeding
const validateInput = (input) => {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('Invalid input');
  }
  return input;
};

module.exports = { validateInput };
