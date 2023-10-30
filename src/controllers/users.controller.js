const catchAsync = require('../utils/catchAsync');
const { usersService } = require('../services');
const httpStatus = require('http-status');

const findAllUsers = catchAsync(async (req, res) => {
  const results = await usersService.findAllUsers(req.query);

  res.status(200).send(results);
});

const createUser = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await usersService.createUser(payload);

  res.status(200).send(results);
});

const updateUser = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await usersService.updateUser(payload);

  res.status(200).send(results);
});

const deleteUser = catchAsync(async (req, res) => {
  await usersService.deleteUser(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
