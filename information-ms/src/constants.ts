export const INSTRUMENT_SEARCH_TICKER_LIMIT = 5;
export const INSTRUMENT_SEARCH_NAME_LIMIT = 5;

export const environment = {
    db: {
        host: process.env.DB_HOST || 'lallah.db.elephantsql.com',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'quykvkaz',
        password: process.env.DB_PASSWORD || 'Dkqcim9wd3l9jOcD-LGyV2QEd8IrodM4',
        database: process.env.DB_NAME || 'quykvkaz',
    },
    node_env: process.env.NODE_ENV,
}