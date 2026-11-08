const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Connect to MongoDB: use the cloud URI if set, otherwise local
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Set up the express app
const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Track logged-in users with session cookies
app.use(session({
  key: 'sessionid',
  secret: 'Domo Arigato',
  resave: false,
  saveUninitialized: false,
}));

// Set up handlebars for views
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// Attach routes, start server
router(app);

app.listen(port, (err) => {
  if (err) { throw err; }
  console.log(`Listening on port ${port}`);
});
