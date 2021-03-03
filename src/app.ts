import express, { Request, Response } from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import myMongoose from 'mongoose';
import bluebird from 'bluebird';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
import logger from './util/logger';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';

import * as homeController from './controllers/home';

const app = express();

import routes from './routes';

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
const mongoose = bluebird.promisifyAll(myMongoose);
// mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    logger.debug('Connected to mongo');
  })
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    // process.exit();
  });

//Express config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: MongoStore.create({
      mongoOptions: {
        useUnifiedTopology: true
      },
      mongoUrl
    })
  })
);
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.get('/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.get('/home', homeController.home);
app.use(routes);

export default app;
