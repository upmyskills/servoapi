import express from 'express';
import config from 'config';
import createError, { HttpError } from 'http-errors';
import cors from 'cors';
import path from 'path';
import fetch from 'node-fetch';

import { statka } from './routes/const';

const serv = window.location.origin;
console.log(serv);

const load = async () => {
  const response = await fetch(`${serv}/pseudoserver/menu.json`);
  const data = await response.json();

  data.menuItems.forEach((item: { linkName: string, cards: Array<{ word: string, translation: string, audioSrc: string }> }) => {
    item.cards.map((card) => {
      statka.set(card.word, {
        word: card.word,
        translation: card.translation,
        audioSrc: card.audioSrc,
        count: Math.floor(Math.random() * 44),
        correct: Math.floor(Math.random() * 25),
        wrong: Math.floor(Math.random() * 21)
      });
      return card;
    });
  });
};
load();

export const app = express();
const port = config.get('serverConf.localport');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// allow CORS middleware
app.use(cors());
// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', `http://localhost:${port}`);
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   // Pass to next layer of middleware
//   next();
// });

// ROUTES
import { baseRoute } from './routes/main.route';
app.use(baseRoute);

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error : ' + err.status);
});
