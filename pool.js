const {Pool} = require('pg');
const config = require('config');

const pool = new Pool(config.get('pg_config'));

module.exports = pool;
