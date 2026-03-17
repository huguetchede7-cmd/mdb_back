// config/config.js
const path = require('path');
require('ts-node').register({
    transpileOnly: true
});
module.exports = require(path.resolve(__dirname, 'config.ts')).config;
