const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const bodyParser = require('body-parser');
const { default: rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  FLIGHT_SERVICE_URL,
  BOOKING_SERVICE_URL,
} = require('./config/server-config');
const { User, Role } = require('./models');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', apiRoutes);
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, //2 minutes
  max: 10,
});
app.use(limiter);
//Reverse Proxy - Flight Service
app.use(
  '/flightService',
  createProxyMiddleware({
    target: FLIGHT_SERVICE_URL,
    changeOrigin: true, //This means that the server will change the host header to the target URL
    pathRewrite: {
      //This is used to rewrite the URL
      '^/flightsService': '/',
    },
  })
);
//Reverse Proxy - Booking Service
app.use(
  '/bookingService',
  createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/bookingService': '/' },
  })
);
app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  // const user = await User.findByPk(5);
  // const role = await Role.findByPk(5);
  // console.log('User', user);
  // console.log('Role', role);
  // await user.addRole(role);
  // console.log('User Role Added Successfully');
});

/**
 To create a reverse proxy, we need to use the http-proxy-middleware package.
 npm install http-proxy-middleware  

 Now as we discussed api-gateway is the single entry point for all the microservices and it will act as a reverse proxy for all the microservices.

 say reverse proxy (API Gateway) is running on port 3000 and you want to reach flight service running on port 3002.
 
 app.use(
 '/flightsService',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
      '^/flightsService': '/',
    },
  })
 )

 Say you want to do do get all flights.
  http://localhost:3000/flightsService/api/v1/flights



 */
