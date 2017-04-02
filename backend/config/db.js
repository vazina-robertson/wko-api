module.exports = {
  db: {
    client: 'pg',
    connection: process.env.DB_URL,
    debug: false
  }
};
