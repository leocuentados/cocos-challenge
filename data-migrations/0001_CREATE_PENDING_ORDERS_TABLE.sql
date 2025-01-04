CREATE TABLE pending_orders (
    id SERIAL PRIMARY KEY,
    instrumentid INT NOT NULL,
    userid INT NOT NULL,
    size INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    type VARCHAR(10) NOT NULL,
    side VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    datetime TIMESTAMP NOT NULL
);
