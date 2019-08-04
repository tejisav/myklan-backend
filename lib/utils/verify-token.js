const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();

// Policy helper function
const generatePolicy = (principalId, effect, resource, customErrorMessage = null) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    policyDocument.Statement.push({
      Action : 'execute-api:Invoke',
      Effect: effect,
      Resource: "*"//resource // https://stackoverflow.com/a/53096155
    });
    authResponse.policyDocument = policyDocument;
  }

  if (effect.toLowerCase() == 'deny' && customErrorMessage != null) {
    authResponse.context = {
      "customErrorMessage": customErrorMessage
    };
  }

  return authResponse;
}

module.exports.auth = (event, context, callback) => {

  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then((ticket) => {
        const payload = ticket.getPayload();
        const email = payload['email'];
        return callback(null, generatePolicy(email, 'Allow', event.methodArn));
      })
      .catch(() => {
        return callback(null, generatePolicy(err.message, 'Deny', event.methodArn, "Invalid Token"));
      });
    } else {
      // if everything is good, save to request for use in other routes
      return callback(null, generatePolicy(decoded.email, 'Allow', event.methodArn));
    }
  });
};