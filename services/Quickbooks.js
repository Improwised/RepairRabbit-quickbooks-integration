const requestPromise = require('request-promise');

const getQuickbooksCompanies = (credentials, requestData) => {
  var requestObj = {
    url: requestData.url,
    headers: {
      'Authorization': 'Bearer ' + credentials.accessToken,
      'Accept': 'application/json'
    },
    qs: {
      query: requestData.query.query,
      minorversion:'4'
    },
  }

  return requestPromise(requestObj)
  .then((customers) => {
    return JSON.parse(customers);
  });
};

module.exports = {
  getQuickbooksCompanies
}