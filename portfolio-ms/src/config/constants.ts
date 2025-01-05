export const AWS_REGION = 'us-east-1';
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'mockKeyId';
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'mockSecretKey';

export const PORTFOLIO_TABLE_NAME = 'PortfolioCache';
export const PORTFOLIO_TABLE_PK = 'userId';
export const AWS_SQS_ENDPOINT = process.env.AWS_SQS_ENDPOINT || 'http://localhost:4566';
export const PORTFOLIO_QUEUE_URL = process.env.PORTFOLIO_QUEUE_URL || 'http://localhost:4566/000000000000/portfolio-ms-queue';
export const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://dynamodb.us-east-1.localhost.localstack.cloud:4566';
export const INFORMATION_MS_URL = process.env.INFORMATION_MS_URL || 'http://localhost:3000';