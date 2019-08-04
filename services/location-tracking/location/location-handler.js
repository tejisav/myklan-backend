const connectToDatabase = require('../lib/utils/db');
const Member = require('../lib/models/Member');
const mongoose = require('mongoose');
// const apn = require('apn');
// const apnProvider =  require('../lib/utils/apn-provider');

/**
 * Functions
 */

// module.exports.requestLocation = (event, context) => {
//   context.callbackWaitsForEmptyEventLoop = false;
//   return connectToDatabase()
//     .then(() =>
//       requestLocation(JSON.parse(event.body))
//     )
//     .then(message => ({
//       statusCode: 200,
//       headers: {
//         /* Required for CORS support to work */
//         'Access-Control-Allow-Origin': '*',
//         /* Required for cookies, authorization headers with HTTPS */
//         'Access-Control-Allow-Credentials': true
//       },
//       body: JSON.stringify({message: message})
//     }))
//     .catch(err => ({
//       statusCode: err.statusCode || 500,
//       headers: { 
//         'Content-Type': 'text/plain',
//         /* Required for CORS support to work */
//         'Access-Control-Allow-Origin': '*',
//         /* Required for cookies, authorization headers with HTTPS */
//         'Access-Control-Allow-Credentials': true
//       },
//       body: err.message
//     }));
// };

module.exports.updateLocation = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateLocation(JSON.parse(event.body))
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

module.exports.getLocation = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getLocation(event.queryStringParameters)
    )
    .then(coordinates => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(coordinates)
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

// function requestLocation(eventBody) {
  
//   if (!eventBody.memberId) {
//     return Promise.reject(new Error('Member id not valid.'));
//   }

//   return Member.findById(eventBody.memberId, 'deviceToken -_id')
//     .then((result) => {
//       if (result.deviceToken) {
//         let notification = new apn.Notification();

//         notification.rawPayload = {
//           aps: {
//              "content-available" : 1
//           },
//           id: "requestLocation"
//         };

//         return apnProvider.send(notification, result.deviceToken);
//       } else {
//         return Promise.reject("DeviceToken does not exist.");
//       }
//     })
//     .catch(err => Promise.reject(new Error(err)));
// }

function updateLocation(eventBody) {
  let memberData = {};

  if (!eventBody.memberId || !eventBody.latitude || !eventBody.longitude || !eventBody.lastLocationUpdate) {
    return Promise.reject(new Error('Member data not valid!'));
  }

  memberData.latitude = eventBody.latitude;
  memberData.longitude = eventBody.longitude;
  memberData.lastLocationUpdate = eventBody.lastLocationUpdate;

  return Member.updateOne( {_id: mongoose.Types.ObjectId(eventBody.memberId) }, memberData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function getLocation(eventQuery) {
  return Member.findById(eventQuery.memberId, 'latitude longitude lastLocationUpdate -_id')
    .then(coordinates => coordinates || Promise.reject("Coordinate data does not exist."))
    .catch(err => Promise.reject(new Error(err)));
}