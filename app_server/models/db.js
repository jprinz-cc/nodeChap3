var mongoose = require('mongoose');
var mlabConnect = require('../../credentials.js');
var dbURL;

var dbURI = 'mongodb://localhost/Loc8r'; //Local Mongo Connection
if (process.env.NODE_ENV === 'production') {
    dbURI = mlabConnect;
}

mongoose.connect(dbURI);

if (dbURI.indexOf('@') > 0) {
    var tempURI = dbURI.indexOf('@');
    dbURL = dbURI.substr(tempURI + 1);
} else {
    dbURL = dbURI;
}

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURL);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});


process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);;
    });
});

process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);;
    });
});


require('./locations');
