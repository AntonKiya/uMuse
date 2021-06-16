const {Pool} = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "1234567890",
    host: "34.136.195.83",
    port: 5432,
    database: "umuse"
});

module.exports = pool;
