const connectToDatabase = require('../lib/utils/db');
const Member = require('../lib/models/Member');
const mongoose = require('mongoose');

/**
 * Functions
 */

module.exports.addMember = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      addMember(JSON.parse(event.body))
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

module.exports.updateMember = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateMember(JSON.parse(event.body))
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

module.exports.updateDeviceToken = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateDeviceToken(JSON.parse(event.body))
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

module.exports.getMembers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getMembers(event.queryStringParameters)
    )
    .then(members => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(members)
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

module.exports.getMember = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getMember(event.queryStringParameters)
    )
    .then(member => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(member)
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

module.exports.deleteMember = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      deleteMember(event.queryStringParameters)
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

function addMember(eventBody) {
  let memberData = {};

  if (!eventBody.userId || !eventBody.name) {
    return Promise.reject(new Error('Member data not valid.'));
  }

  memberData.userId = mongoose.Types.ObjectId(eventBody.userId);
  memberData.name = eventBody.name;

  if (eventBody.avatar) {
    memberData.avatar = eventBody.avatar;
  }

  return Member.create(memberData)
    .then(member => (`Member successfully created with id: ${member._id}`))
    .catch(err => Promise.reject(new Error(err)));
}


function updateMember(eventBody) {
  let memberData = {};

  if (!eventBody.memberId) {
    return Promise.reject(new Error('Member not found'));
  }
  
  if (eventBody.name) {
    memberData.name = eventBody.name;
  }

  if (eventBody.avatar) {
    memberData.avatar = eventBody.avatar;
  }

  return Member.updateOne( {_id: mongoose.Types.ObjectId(eventBody.memberId) }, memberData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function updateDeviceToken(eventBody) {
  let memberData = {};

  if (!eventBody.memberId || !eventBody.deviceToken) {
    return Promise.reject(new Error('Member data not valid.'));
  }

  memberData.deviceToken = eventBody.deviceToken;

  return Member.updateOne( {_id: mongoose.Types.ObjectId(eventBody.memberId) }, memberData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function getMembers(eventQuery) {
  return Member.find({ userId: mongoose.Types.ObjectId(eventQuery.userId) }, '-userId -__v')
    .then(members => members)
    .catch(err => Promise.reject(new Error(err)));
}

function getMember(eventQuery) {
  return Member.findById(eventQuery.memberId, '-avatar -__v')
    .then(member => member || Promise.reject("Member does not exist."))
    .catch(err => Promise.reject(new Error(err)));
}

function deleteMember(eventQuery) {
  return Member.findByIdAndDelete(eventQuery.memberId)
    .then(response => (`Member successfully deleted with id: ${response._id}`))
    .catch(err => Promise.reject(new Error(err)));
}