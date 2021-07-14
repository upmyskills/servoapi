#!/usr/bin/env node

import config from 'config';
import { app } from '../app';

import { debug } from 'debug';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import http from 'http';

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || config.get('serverConf.localport'));
app.set('port', port);
debug('API:EFK:server::');

/**
 * Get connection to DataBase
 */

// NATIVE
// const uri = `mongodb+srv://admongomin:perekyr4iK@dbsstore.ksx7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("myFirstDatabase").collection("englishword_db");
//   // perform actions on the collection object
//   console.log(collection.find());
//   client.close();
// });


// MONGOOSE
const mongoDB = 'mongodb+srv://monomin:5ewMHtFIBPV1qs6i@azuremongodb.t8m5v.mongodb.net/englishwords_db?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error.'));
db.once('open', () => console.log('GOOD!'));

const categorySchema = new mongoose.Schema({
  caption: {type: String, require: true, unique: true},
});

const wordSchema = new mongoose.Schema({
  word: String,
  translation: String,
  audioSrc: Buffer,
  image: Buffer,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'animals' }
});

const Category = mongoose.model('category', categorySchema);
Category.createCollection();

const Word = mongoose.model('word', wordSchema);
Word.createCollection();

// const animals = new Category({ caption: 'animals'});
// Category.create({ caption: 'animals' }, (err, obj) => console.log(err, obj));

const wordFrog = new Word({
  word: 'frog',
  translation: 'лягушка',
  audioSrc: 'pathToMP3',
  image: 'pathToImage',
});
wordFrog.save((err: mongoose.CallbackError) => console.log(err))

const category = Category.find({ caption: 'animals', });
console.log(category);
// connectToDB();



/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: { syscall: string; code: any; }) {
  console.log('error');
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  console.log('listen');
  var addr = server.address();
  if (!addr) return;
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
