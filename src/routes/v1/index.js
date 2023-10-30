const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const usersRoute = require('./users.route');
const membersRoute = require('./members.route');
const loansRoute = require('./loans.route');
const paymentsRoute = require('./payments.route');
const expensesRoute = require('./expenses.route');
const installmentsRoute = require('./installment.route');
const reportRoute = require('./report.route');
const penaltyRoute = require('./penalties.route');
const collectionRoute = require('./collection.route');

const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: usersRoute,
  },
  {
    path: '/member',
    route: membersRoute,
  },
  {
    path: '/loan',
    route: loansRoute,
  },
  {
    path: '/payment',
    route: paymentsRoute,
  },
  {
    path: '/expenses',
    route: expensesRoute,
  },
  {
    path: '/installment',
    route: installmentsRoute,
  },
  {
    path: '/report',
    route: reportRoute,
  },
  {
    path: '/penalty',
    route: penaltyRoute,
  },
  {
    path: '/collection',
    route: collectionRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
