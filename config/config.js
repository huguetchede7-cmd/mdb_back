const path = require('path');
require('dotenv').config();
require('ts-node').register({
    transpileOnly: true
});
module.exports = require(path.resolve(__dirname, 'config.ts')).config;