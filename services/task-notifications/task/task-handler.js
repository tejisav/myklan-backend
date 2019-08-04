const connectToDatabase = require('../lib/utils/db');
const Task = require('../lib/models/Task');
const mongoose = require('mongoose');
const apn = require('apn');
const apnProvider =  require('../lib/utils/apn-provider');
const Member = require('../lib/models/Member');

/**
 * Functions
 */

module.exports.addTask = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      addTask(JSON.parse(event.body))
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

module.exports.updateTask = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      updateTask(JSON.parse(event.body))
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

module.exports.getTasks = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      getTasks(event.queryStringParameters)
    )
    .then(tasks => ({
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(tasks)
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

module.exports.deleteTask = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      deleteTask(event.queryStringParameters)
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

function addTask(eventBody) {
  let taskData = {};

  if (!eventBody.userId || !eventBody.title || !eventBody.description) {
    return Promise.reject(new Error('Task data not valid.'));
  }

  taskData.userId = mongoose.Types.ObjectId(eventBody.userId);
  taskData.title = eventBody.title;
  taskData.description = eventBody.description;

  return Task.create(taskData)
    .then(task => (`Task successfully created with id: ${task._id}`))
    .catch(err => Promise.reject(new Error(err)));
}

function notifyMembers(eventBody) {
  
  if (!eventBody.userId || !eventBody.taskId) {
    return Promise.reject(new Error('Notification data not valid.'));
  }

  return Member.find({ userId: mongoose.Types.ObjectId(eventBody.userId) }, 'deviceToken')
    .then((data) => {
      let deviceTokens = data.map((obj) => { 
        return obj.deviceToken; 
      }).filter(Boolean);

      return [...new Set(deviceTokens)];
    })
    .then((deviceTokens) => {
      return Task.findById(eventBody.taskId, '-_id -userId -__v')
      .then((Task) => {
        if (Task && Task.title && Task.description && Array.isArray(deviceTokens) && deviceTokens.length) {
          const notification = new apn.Notification({
            title: Task.title,
            body: Task.description,
            sound: "default"
          });

          return apnProvider.send(notification, deviceTokens);
        } else {
          return Promise.reject("Task or DeviceToken does not exist.");
        }
      })
      .catch(err => Promise.reject(new Error(err)));
    })
    .catch(err => Promise.reject(new Error(err)));
}

function updateTask(eventBody) {
  let taskData = {};

  if (!eventBody.taskId) {
    return Promise.reject(new Error('Task not found'));
  }
  
  if (eventBody.title) {
    taskData.title = eventBody.title;
  }
  
  if (eventBody.description) {
    taskData.description = eventBody.description;
  }

  return Task.updateOne( {_id: mongoose.Types.ObjectId(eventBody.taskId) }, taskData)
    .then(response => response.nModified || Promise.reject("Nothing changed."))
    .catch(err => Promise.reject(new Error(err)));
}

function getTasks(eventQuery) {
  return Task.find({ userId: mongoose.Types.ObjectId(eventQuery.userId) }, '-userId -__v')
    .then(tasks => tasks)
    .catch(err => Promise.reject(new Error(err)));
}

function deleteTask(eventQuery) {
  return Task.findByIdAndDelete(eventQuery.taskId)
    .then(response => (`Task successfully deleted with id: ${response._id}`))
    .catch(err => Promise.reject(new Error(err)));
}