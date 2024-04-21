const mongoose = require("mongoose");
const { connect, connection } = mongoose;
const logger = require('../utilServices/logger')
const mongodboptions = {
    autoIndex: process.env.MONGO_AUTO_INDEX,
    useNewUrlParser: process.env.MONGO_URL_PARSER
};

//mongoose.set('useCreateIndex', true);
mongoose.set('debug', false);

connect(process.env.MONGO_URL, mongodboptions);

connection.on('connecting', function () {
    console.log('Connecting to MongoDB');
});

connection.on('error', (error) => {
    logger.error('Error in MongoDb connection: ' + error)
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
connection.on('connected', () => {
    console.log('MongoDB connected!');
});

connection.once('open', () => {
    console.log('MongoDB connection opened!');
});
connection.on('reconnected', () => {
    console.log('MongoDB reconnected!');
});
connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    mongoose.connect(process.env.MONGO_URL, mongodboptions);
});

module.exports = { mongoose };