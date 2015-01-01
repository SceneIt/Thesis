var bodyParser = require('body-parser');
var helpers = require('./helpers'); // our custom middleware

module.exports = function(app, express) {
	var photoRouter = express.Router();
	app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/api/photo',photoRouter);
  require('../photo/photoRoutes')(photoRouter);

  app.use('/photo', photoRouter);
  require('../photo/takePhoto')(photoRouter);
};
