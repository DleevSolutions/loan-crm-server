const catchAsync = require('../utils/catchAsync');
const { penaltiesService } = require('../services');
const httpStatus = require('http-status');

const createPenalty = catchAsync(async (req, res) => {
  const { body, query } = req;
  const payload = { body, query };
  const results = await penaltiesService.createPenalty(payload);
  res.status(200).send(results);
});

const deletePenalty = catchAsync(async (req, res) => {
  await penaltiesService.deletePenalty(req.query);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPenalty,
  deletePenalty,
};
