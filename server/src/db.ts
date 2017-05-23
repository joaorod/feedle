// Bring Mongoose into the app
var mongoose = require( 'mongoose' );

// Build the connection string
var dbURI = 'mongodb://feedlo:feed123@ds149711.mlab.com:49711/feedlodb';

mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err:any) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


// BRING IN YOUR SCHEMAS & MODELS
var memberSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    cluster: String,
    confirmed: Number
});
mongoose.model('Member', memberSchema);
