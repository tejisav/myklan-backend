const connectToDatabase = require('../lib/utils/db');
const Beacon = require('../lib/models/Beacon');
const mongoose = require('mongoose');
const apn = require('apn');
const apnProvider =  require('../lib/utils/apn-provider');
const Member = require('../lib/models/Member');

/**
 * Functions
 */

module.exports.addBeacon = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      addBeacon(JSON.parse(event.body))
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

module.exports.notifyMembers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      notifyMembers(JSON.parse(event.body))
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

module.exports.getBeacons = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getBeacons(event.queryStringParameters)
    )
    .then(beacons => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(beacons)
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

module.exports.deleteBeacon = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      deleteBeacon(event.queryStringParameters)
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

function addBeacon(eventBody) {
  let beaconData = {};

  if (!eventBody.userId || !eventBody.title || !eventBody.latitude || !eventBody.longitude || !eventBody.radius || !eventBody.members || !Array.isArray(eventBody.members) || !eventBody.members.length || typeof eventBody.onExit === 'undefined' || typeof eventBody.onEntry === 'undefined') {
    return Promise.reject(new Error('Beacon data not valid.'));
  }

  beaconData.userId = mongoose.Types.ObjectId(eventBody.userId);
  beaconData.title = eventBody.title;
  beaconData.latitude = eventBody.latitude;
  beaconData.longitude = eventBody.longitude;
  beaconData.radius = eventBody.radius;
  beaconData.members = eventBody.members;
  beaconData.onExit = eventBody.onExit;
  beaconData.onEntry = eventBody.onEntry;

  return Beacon.create(beaconData)
    .then(beacon => (`Beacon successfully created with id: ${beacon._id}`))
    .catch(err => Promise.reject(new Error(err)));
}

function notifyMembers(eventBody) {
  
  if (!eventBody.beaconId && !eventBody.message) {
    return Promise.reject(new Error('Notification data not valid.'));
  }

  return Beacon.findById(eventBody.beaconId, 'title members')
    .then((beacon) => {
      if (beacon.title && Array.isArray(beacon.members) && beacon.members.length) {
        let membersMongoId = beacon.members.map(id => new mongoose.Types.ObjectId(id));
        return Member.find({ _id: {$in: membersMongoId} }, 'deviceToken')
        .then((data) => {
          let deviceTokens = data.map((obj) => { 
            return obj.deviceToken; 
          }).filter(Boolean);
    
          return [...new Set(deviceTokens)];
        })
        .then((deviceTokens) => {
          if (Array.isArray(deviceTokens) && deviceTokens.length) {
            const notification = new apn.Notification({
              title: beacon.title,
              body: eventBody.message,
              sound: "default"
            });
  
            return apnProvider.send(notification, deviceTokens);
          } else {
            return Promise.reject("DeviceTokens does not exist.");
          }
        })
        .catch(err => Promise.reject(new Error(err)));
      } else {
        return Promise.reject("Beacon does not exist.");
      }
    })
    .catch(err => Promise.reject(new Error(err)));
}

function getBeacons(eventQuery) {
  return Beacon.find({ userId: mongoose.Types.ObjectId(eventQuery.userId), members: eventQuery.memberId }, '-userId -__v')
    .then(beacons => beacons)
    .catch(err => Promise.reject(new Error(err)));
}

function deleteBeacon(eventQuery) {
  return Beacon.findByIdAndDelete(eventQuery.beaconId)
    .then(response => (`Beacon successfully deleted with id: ${response._id}`))
    .catch(err => Promise.reject(new Error(err)));
}