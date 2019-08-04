const apn = require('apn');

const options = {
  cert: (process.env.LAMBDA_TASK_ROOT || __dirname) + "/lib/assets/cert.pem",
  key: (process.env.LAMBDA_TASK_ROOT || __dirname) + "/lib/assets/key.pem",
  production: false
};

module.exports = new apn.Provider(options);