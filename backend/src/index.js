require('dotenv').config();
const app = require('./server');
const config = require('./config');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API listening on port ${config.port}`);
});
