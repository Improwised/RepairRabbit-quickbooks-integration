var tools = require('../tools/tools.js')
var config = require('../config.json')
var request = require('request');
const _ = require('lodash');
var express = require('express');
var router = express.Router();

const Quickbooks = require('../services/Quickbooks.js');
const RepairRabbit = require('../services/RepairRabbit.js');


/** /api_call **/
router.get('/', function (req, res) {
  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})
  if(!req.session.realmId) return res.json({
    error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
  })

  // Set up API call (with OAuth2 accessToken)
  var url = `${config.api_uri}${req.session.realmId}/query`;
  const credentials = {
    accessToken: token.accessToken
  }
  const requestData = {
    query: {
      query: 'select * from customer'
    },
    url: url
  }
  return Quickbooks.getQuickbooksCompanies(credentials, requestData)
  .then((response) => {
    const customers = response.QueryResponse.Customer;
    const user = {
      email: process.env.REPAIRRABBIT_ADMIN,
      password: process.env.REPAIRRABBIT_PASSWORD
    }
    return RepairRabbit.loginOnRepairRabbit(user)
    .then((userInfo) => {
      console.log("userInfo", userInfo)
      // return customers;
      return RepairRabbit.importCustomersOnRepairRabbit(userInfo.token, customers)
    })
  })
  .then((response) => {
    if (response && response.length) {
      res.status(201).json({
        status: 'success',
        data: response
      })
    }
  })
  .catch((err) => {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message || err.stack || 'Something went wrong. Please try again.'
    })
  })
})

/** /api_call/revoke **/
router.get('/revoke', function (req, res) {
  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})

  var url = tools.revoke_uri
  request({
    url: url,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + tools.basicAuth,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'token': token.accessToken
    })
  }, function (err, response, body) {
    if(err || response.statusCode != 200) {
      return res.json({error: err, statusCode: response.statusCode})
    }
    tools.clearToken(req.session)
    res.json({response: "Revoke successful"})
  })
})

/** /api_call/refresh **/
// Note: typical use case would be to refresh the tokens internally (not an API call)
// We recommend refreshing upon receiving a 401 Unauthorized response from Intuit.
// A working example of this can be seen above: `/api_call`
router.get('/refresh', function (req, res) {
  var token = tools.getToken(req.session)
  if(!token) return res.json({error: 'Not authorized'})

  tools.refreshTokens(req.session).then(function(newToken) {
    // We have new tokens!
    res.json({
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken
    })
  }, function(err) {
    // Did we try to call refresh on an old token?
    console.log(err)
    res.json(err)
  })
})

module.exports = router
