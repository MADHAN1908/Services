const pgp = require('pg-promise')();
var data = {
  user: process.env.LOCAL_POSTGRESQL_USER_NAME || 'postgres',
  host: process.env.LOCAL_POSTGRESQL_HOST || 'localhost',
  database: process.env.LOCAL_POSTGRESQL_DATABASE || 'campaign_system',
  password: process.env.LOCAL_POSTGRESQL_PASSWORD || '',
  port: process.env.LOCAL_POSTGRESQL_PORT || 5432

}
const connection = data;
const db = pgp(connection);
async function checkDatabaseConnection() {
  try {
    // Attempt to connect to the database
    await db.connect();
    // Connection successful
    console.log('Database connected.');
  } catch (error) {
    // Connection failed
    console.log(process.env.LOCAL_POSTGRESQL_PASSWORD);
    console.error('Database connection failed:', error);
  }
}
// Check the database connection
checkDatabaseConnection();

module.exports = db;