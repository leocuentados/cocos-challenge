#!/bin/sh
echo "Initializing localstack"

awslocal sqs create-queue --queue-name portfolio-ms-queue

awslocal dynamodb create-table \
    --table-name PortfolioCache \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --region us-east-1
