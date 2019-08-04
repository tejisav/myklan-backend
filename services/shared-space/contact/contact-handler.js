const connectToDatabase = require('../lib/utils/db');
const Contact = require('../lib/models/Contact');
const mongoose = require('mongoose');

/**
 * Functions
 */

module.exports.addContact = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      addContact(JSON.parse(event.body))
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

module.exports.updateContact = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateContact(JSON.parse(event.body))
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

module.exports.getContacts = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getContacts(event.queryStringParameters)
    )
    .then(contacts => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(contacts)
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

module.exports.deleteContact = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      deleteContact(event.queryStringParameters)
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

function addContact(eventBody) {
  let contactData = {};

  if (!eventBody.userId || !eventBody.name || !eventBody.number) {
    return Promise.reject(new Error('Contact data not valid.'));
  }

  contactData.userId = mongoose.Types.ObjectId(eventBody.userId);
  contactData.name = eventBody.name;
  contactData.number = eventBody.number;

  if (eventBody.info) {
    contactData.info = eventBody.info;
  }

  return Contact.create(contactData)
    .then(contact => (`Contact successfully created with id: ${contact._id}`))
    .catch(err => Promise.reject(new Error(err)));
}

function updateContact(eventBody) {
  let contactData = {};

  if (!eventBody.contactId) {
    return Promise.reject(new Error('Contact not found'));
  }
  
  if (eventBody.name) {
    contactData.name = eventBody.name;
  }

  if (eventBody.number) {
    contactData.number = eventBody.number;
  }

  if (eventBody.hasOwnProperty('info')) {
    contactData.info = eventBody.info;
  }

  return Contact.updateOne( {_id: mongoose.Types.ObjectId(eventBody.contactId) }, contactData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function getContacts(eventQuery) {
  return Contact.find({ userId: mongoose.Types.ObjectId(eventQuery.userId) }, '-userId -__v')
    .then(contacts => contacts)
    .catch(err => Promise.reject(new Error(err)));
}

function deleteContact(eventQuery) {
  return Contact.findByIdAndDelete(eventQuery.contactId)
    .then(response => (`Contact successfully deleted with id: ${response._id}`))
    .catch(err => Promise.reject(new Error(err)));
}