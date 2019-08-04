#!/bin/bash

cd ../../
cd services/beacon-notifications
serverless remove

cd services/location-tracking
serverless remove

cd ../../
cd services/task-notifications
serverless remove

cd ../../
cd services/shared-space
serverless remove

cd ../../
cd services/user-management
serverless remove

cd ../../
cd services/shared-gateway
serverless remove

echo "Press any key to continue"
read