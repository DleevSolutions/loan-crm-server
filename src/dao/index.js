const httpStatus = require('http-status');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

function createSuperDao(model) {
  async function findAll(options, query) {
    try {
      const results = model.findAll({ ...options, ...query });
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  async function findAllAndCount(options, query) {
    try {
      const results = model.findAndCountAll({ ...options, ...query });
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  async function findOne(options, query) {
    try {
      const results = model.findOne({ ...options, ...query });
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  async function findByPk(id) {
    try {
      const results = model.findByPk(id);
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  async function findOrCreate(options) {
    try {
      const results = model.findOrCreate(options);
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
  }

  async function count(query) {
    try {
      const results = await model.count({ where: query });
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async function create(data) {
    try {
      const results = await model.create(data);
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async function update(data, query) {
    try {
      const results = await model.update(data, { where: query });
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async function bulkUpdate(data, query) {
    try {
      const results = await model.update(data, { where: query });
      return results;
    } catch (error) {
      logger.error(error);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async function remove(query) {
    try {
      const results = await model.destroy({ where: query });
      return results;
    } catch (error) {
      console.log(`${error.table}_${error.name}`);
      if (error.table && error.name) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error.table}_${error.name}`);
      } else {
        console.log(error.message);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }

  return {
    findAll,
    findAllAndCount,
    findOne,
    findByPk,
    findOrCreate,
    count,
    create,
    update,
    bulkUpdate,
    remove,
  };
}

module.exports = createSuperDao;
