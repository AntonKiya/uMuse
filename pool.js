const {Pool} = require('pg');


const pool = new Pool({
    user: "macbookpro",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "umuse"
});



module.exports = pool;