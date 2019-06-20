const fs = require('fs');
const configPath = process.env.CONFIG_FILE;
let config = {};

if (configPath) {
    console.log(`Loading config from ${configPath}`);
    const file = fs.readFileSync(configPath, {
        encoding: 'utf-8'
    });
    config = JSON.parse(file);
} else {
    console.log(`Loading config from default path`);
    config = require('./config.json');
}

module.exports = config;