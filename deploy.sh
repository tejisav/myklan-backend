#!/bin/bash

cd services/shared-gateway
serverless deploy
sleep 5s

cd ../../
cd services/user-management
serverless deploy
sleep 5s

cd ../../
cd services/shared-space
serverless deploy
sleep 5s

cd ../../
cd services/task-notifications
serverless deploy
sleep 5s

cd ../../
cd services/location-tracking
serverless deploy
sleep 5s

cd ../../
cd services/beacon-notifications
serverless deploy
sleep 5s

echo "Press any key to continue"
read