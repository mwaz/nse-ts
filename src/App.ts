import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import MarketRouter from './routes/markets';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as yaml from 'yaml';

const file = fs.readFileSync(`${__dirname}/docs/swagger.yaml`, 'utf8');

const swaggerDocumetation = yaml.parse(file);


dotenv.config();

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(cors());
    this.express.disable('etag');
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello, Welcome to NSE Stocks!'
      });
    });
    this.express.use('/', router);
    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumetation));
    this.express.use('/api/v1/stocks/', MarketRouter);
    this.express.use('/api/v1/stocks/:stock', MarketRouter);
  }

}

export default new App().express;