const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    // General
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.any().required(),
    LOCAL_IP: Joi.any(),
    DB_HOST: Joi.string().required().description('Database Host - Local'),
    DB_USER: Joi.string().required().description('Database User - Local'),
    DB_PASSWORD: Joi.string().allow(null, '').description('Database Password - Local'),
    DB_NAME: Joi.string().required().description('Database Name - Local'),
    DB_DIALECT: Joi.string().required().description('Database Dialect - Local'),
    DB_MAX_POOL: Joi.number().required().description('Database Max Pool Connection - Local'),
    DB_MIN_POOL: Joi.number().required().description('Database Min Pool Connection - Local'),
    DB_IDLE: Joi.number().required().description('Database Connection Idle - Local'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  localIP: envVars.LOCAL_IP,
  db_config: {
    dbHost: 'srv2050.hstgr.io',
    // dbHost: 'localhost',
    dbUser: envVars.DB_USER,
    dbPassword: envVars.DB_PASSWORD,
    dbName: envVars.DB_NAME,
    dbDialect: envVars.DB_DIALECT,
    dbMaxPool: envVars.DB_MAX_POOL,
    dbMinPool: envVars.DB_MIN_POOL,
    dbIdle: envVars.DB_IDLE,
  },
};
