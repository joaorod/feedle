var mongoose = require('mongoose');
var dbURI = 'mongodb://feedlo:feed123@ds149711.mlab.com:49711/feedlodb';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
var meetingSchema = new mongoose.Schema({
    id: Number,
    data: Object
});
mongoose.model('Meeting', meetingSchema);
//# sourceMappingURL=db.js.map