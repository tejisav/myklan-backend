# myKlan Backend

More information about myKlan at https://github.com/tejisav/myklan-ios

## About

myKlan backend is a Node.js Serverless API deployed to AWS. It includes a custom jsonwebtoken based authentication using email and password. It is using AWS Lambda Custom Authroizer for protecting endpoints using both custom generated jsonwebtoken and Google ID tokens. MongoDB is used as the database and the API is divided into Microservices to bypass the AWS Lambda 200 functions limitation.

This is myKlan API and it is using :-
- Node.js
- Serverless
- AWS
- node-apn
- bcryptjs
- google-auth-library
- jsonwebtoken
- mongoose

## Configuration

- First "npm install" and than rename sample.secrets.json to secrets.json and fill out the details.
- Follow this guide https://github.com/node-apn/node-apn/wiki/Preparing-Certificates to get cert.pem and key.pem and place them in lib/assets.
- Finally install serverless "npm install -g serverless" and add aws credentials using this guide https://serverless.com/framework/docs/providers/aws/guide/credentials/
- If everything above is done correctly you can now deploy the API using the deploy script "./deploy.sh" and also remove it using remove script "./remove.sh"

## References

https://github.com/adnanrahic/a-crash-course-on-serverless-auth
