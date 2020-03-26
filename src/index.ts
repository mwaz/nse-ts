import * as http from 'http';
import * as debug from 'debug';
import * as mongoose from 'mongoose';
import fetchData from './data/marketRequest';
import * as cron from 'node-cron';
import * as fs from 'fs';
import * as https from 'https';

import App from './App';


debug('ts-express:server');

// mongoose
//   .connect(
//     'mongodb://mongo:27017/dev_nse_data',
//     { useNewUrlParser: true, useUnifiedTopology: false }
//   )
//   .then(() => {
//     console.log('successfully connected to the database');
//   })
//   .catch((e) => {
//     console.log('unable to connect to the database  Exiting now..');
//     process.exit();
//   });
//   mongoose.set('useCreateIndex', true);

  const fetchDataCronJob = cron.schedule('15 8,17 * * 1-5', function() {
    console.log("Running Cron Job For fetching nse data");
        fs.readFile('/nse.json/', async (err, data) => {
           if (err) throw err;
           await fetchData
           await https.get('https://hc-ping.com/08239020-25e7-491f-b90e-c41709033dde');
        });
    });

fetchDataCronJob.start();

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch(error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  let addr = server.address();
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  console.info(`Listening on ${bind}`);
  debug(`Listening on ${bind}`);
}
