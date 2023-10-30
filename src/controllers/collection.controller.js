const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');
const httpStatus = require('http-status');

const findCollection = catchAsync(async (req, res) => {
  const results = await collectionService.findCollection(req.query);

  res.status(200).send(results);
});

module.exports = {
  findCollection,
};
