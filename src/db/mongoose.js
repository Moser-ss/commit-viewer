const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
const { MONGO } = require('../config/config.js');
const mongoHost = process.env.MONGO_HOST || MONGO.HOST;
const mongoPort = process.env.MONGO_PORT || MONGO.PORT;
const mongoDB = process.env.MONGO_DB || MONGO.DB;
const mongoUser = process.env.MONGO_USER || MONGO.USER;
mongoose.Promise = global.Promise;


async function connectToDB() {
    try {
        const mongoPass = fs.readFileSync(process.env.MONGO_PASS_FILE,{
            encoding: 'utf-8'
        });
        const mongoURI = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:${mongoPort}/${mongoDB}?authSource=admin`;
        await  mongoose.connect(mongoURI, { useNewUrlParser: true ,
            useFindAndModify: false
        });
        console.log(`Connection opened to DB ${mongoHost}`);
    } catch (error) {
        console.error(`Failed to connect to DB ${mongoHost} with error: ${error}`);
        console.info('Retry in 5 seconds');
        await setTimeoutPromise(5000);
        await connectToDB();
    }
}

function healthcheckToDB() {
    try {
        const readyState = mongoose.connection.readyState;
        if(readyState == 1 || readyState ==2 ){
            return true;
        }
    } catch (error) {
        console.error(`Failed to check DB health state. Error :  ${error}`);
        return false;
    }
}

module.exports = {
    connectToDB,
    healthcheckToDB
};