const catchAsync = require('../utils/catchAsync');
const { membersService } = require('../services');
const httpStatus = require('http-status');

const findAllMembers = catchAsync(async (req, res) => {
  const results = await membersService.findAllMembers(req.query);

  res.status(200).send(results);
});

const createMember = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await membersService.createMember(payload);

  res.status(200).send(results);
});

const updateMember = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await membersService.updateMember(payload);

  res.status(200).send(results);
});

const deleteMember = catchAsync(async (req, res) => {
  await membersService.deleteMember(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  findAllMembers,
  createMember,
  updateMember,
  deleteMember,
};
