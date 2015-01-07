var bodyParser = require('body-parser');
var helpers = require('./helpers'); // our custom middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

module.exports = function(app, express) {
	var photoRouter = express.Router();

	app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);
  app.use('/api/photo',photoRouter);
  require('../photo/photoRoutes')(photoRouter);

  app.use('/photo', photoRouter);
  require('../photo/takePhoto')(photoRouter);
};
