export const environment = {
    db: {
        host: process.env.DB_HOST || 'lallah.db.elephantsql.com',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'quykvkaz',
        password: process.env.DB_PASSWORD || 'Dkqcim9wd3l9jOcD-LGyV2QEd8IrodM4',
        database: process.env.DB_NAME || 'quykvkaz',
    },
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        access_key_id: process.env.AWS_ACCESS_KEY_ID || 'mockKeyId',
        secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || 'mockSecretKey',
    },
    sqs: {
        url: process.env.AWS_SQS_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566',
        order_matching_ms_url: process.env.ORDER_MATCHING_MS_SQS_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-matching-ms-queue',
        information_ms_url: process.env.INFORMATION_MS_SQS_URL || 'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/information-ms-queue',
    },
    node_env: process.env.NODE_ENV || 'DEV',
}