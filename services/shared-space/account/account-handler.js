const connectToDatabase = require('../lib/utils/db');
const Account = require('../lib/models/Account');
const mongoose = require('mongoose');

/**
 * Functions
 */

module.exports.addAccount = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      addAccount(JSON.parse(event.body))
    )
    .then(message => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({message: message})
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 
        'Content-Type': 'text/plain',
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: err.message
    }));
};

module.exports.updateAccount = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateAccount(JSON.parse(event.body))
    )
    .then(message => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({message: message})
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 
        'Content-Type': 'text/plain',
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: err.message
    }));
};

module.exports.getAccounts = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getAccounts(event.queryStringParameters)
    )
    .then(accounts => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(accounts)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 
        'Content-Type': 'text/plain',
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: err.message
    }));
};

module.exports.deleteAccount = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      deleteAccount(event.queryStringParameters)
    )
    .then(message => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({message: message})
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 
        'Content-Type': 'text/plain',
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: err.message
    }));
};

/**
 * Helpers
 */

function addAccount(eventBody) {
  let accountData = {};

  if (!eventBody.userId || !eventBody.name || !eventBody.username || !eventBody.password) {
    return Promise.reject(new Error('Account data not valid.'));
  }

  accountData.userId = mongoose.Types.ObjectId(eventBody.userId);
  accountData.name = eventBody.name;
  accountData.username = eventBody.username;
  accountData.password = eventBody.password;

  if (eventBody.info) {
    accountData.info = eventBody.info;
  }

  return Account.create(accountData)
    .then(account => (`Account successfully created with id: ${account._id}`))
    .catch(err => Promise.reject(new Error(err)));
}

function updateAccount(eventBody) {
  let accountData = {};

  if (!eventBody.accountId) {
    return Promise.reject(new Error('Account not found'));
  }
  
  if (eventBody.name) {
    accountData.name = eventBody.name;
  }
  
  if (eventBody.username) {
    accountData.username = eventBody.username;
  }

  if (eventBody.password) {
    accountData.password = eventBody.password;
  }

  if (eventBody.hasOwnProperty('info')) {
    accountData.info = eventBody.info;
  }

  return Account.updateOne( {_id: mongoose.Types.ObjectId(eventBody.accountId) }, accountData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function getAccounts(eventQuery) {
  return Account.find({ userId: mongoose.Types.ObjectId(eventQuery.userId) }, '-userId -__v')
    .then(accounts => accounts)
    .catch(err => Promise.reject(new Error(err)));
}

function deleteAccount(eventQuery) {
  return Account.findByIdAndDelete(eventQuery.accountId)
    .then(response => (`Account successfully deleted with id: ${response._id}`))
    .catch(err => Promise.reject(new Error(err)));
}