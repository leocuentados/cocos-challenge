export const environment = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        access_key_id: process.env.AWS_ACCESS_KEY_ID || 'mockKeyId',
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || 'mockSecretKey',
    },
    sqs: {
        url: process.env.AWS_SQS_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566',
        order_matching_url: process.env.ORDER_MATCHING_MS_SQS_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-matching-ms-queue',
    },
    api: {
        portfolio: process.env.PORTFOLIO_MS_URL || 'http://localhost:3002/api',
        information: process.env.INFORMATION_MS_URL || 'http://localhost:3001',
    }
}