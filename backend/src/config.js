const config = {
  port: Number(process.env.PORT || 3000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5433),
    user: process.env.DB_USER || 'traffic_user',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'traffic_pass',
    database: process.env.DB_NAME || 'traffic_system',
  },
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_production',
};

module.exports = config;
