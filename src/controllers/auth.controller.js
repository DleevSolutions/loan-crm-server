const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services');

const login = catchAsync(async (req, res) => {
  const results = await authService.login(req.body);

  res.status(200).send(results);
});

module.exports = {
  login,
};
