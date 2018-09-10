const requestPromise = require('request-promise');
const _ = require('lodash');
var generator = require('generate-password');

const loginOnRepairRabbit = (user) => {
  var requestObj = {
    url: `${process.env.REPAIRRABBIT_HOST}/api/${process.env.REPAIRRABBIT_API_VERSION}/login`,
    body: {
      email: user.email,
      password: user.password
    },
    headers: { 'Content-Type': 'application/json' },
    json: true,
    method: 'POST'
  }

  console.log("loginOnRepairRabbit", requestObj)

  return requestPromise(requestObj)
  .then((userInfo) => {
    return JSON.parse(JSON.stringify(userInfo));
  });
};

const importCustomersOnRepairRabbit = (jwtToken, qbCustomers) => {
  let rrCustomers = qbCustomers.map((customer) => {
    return {
      name: customer.FullyQualifiedName ? customer.FullyQualifiedName : null,
      email: customer.PrimaryEmailAddr && customer.PrimaryEmailAddr.Address ? customer.PrimaryEmailAddr.Address : null,
      password: generator.generate({length: 10, numbers: true }),
      phone: customer.PrimaryPhone && customer.PrimaryPhone.FreeFormNumber ? customer.PrimaryPhone.FreeFormNumber : null,
      address: customer.BillAddr && customer.BillAddr.Line1 ? customer.BillAddr.Line1 : null,
      address_zip: customer.BillAddr && customer.BillAddr.PostalCode ? customer.BillAddr.PostalCode : null,
      address_city: customer.BillAddr && customer.BillAddr.City ? customer.BillAddr.City : null,
      purpose: customer.CompanyName ? 'business' : 'consumer',
      company_name: customer.CompanyName ? customer.CompanyName : null,
      extra_instructions: null,
      salutation: null,
    }
  });

  return Promise.all(
    rrCustomers.map((customer) => {
      if (customer && customer.email) {
        return addCustomer(jwtToken, customer)
        .then((response) => {
          console.log("response-->", response)
          return undefined;
        })
        .catch((err) => {
          console.log("err", err)
          return Object.assign({}, customer, { reason: err.message });
        })
      } else {
        return Object.assign({}, customer, { reason: 'Email is required in repairrabbit but passed as empty' });
      }
    })
  )
  .then((response) => {
    return response
  });
}

const addCustomer = (jwtToken, customer) => {
  var requestObj = {
    url: `${process.env.REPAIRRABBIT_HOST}/api/${process.env.REPAIRRABBIT_API_VERSION}/admin/customers`,
    body: customer,
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    },
    json: true,
    method: 'POST'
  }

  return requestPromise(requestObj)
  .then((userInfo) => {
    return JSON.parse(JSON.stringify(userInfo));
  });
}

module.exports = {
  loginOnRepairRabbit,
  importCustomersOnRepairRabbit
}