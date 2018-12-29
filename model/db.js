const mysql = require('mysql')
const globals = require('../global/global');

const pool = mysql.createPool({
  host     :  globals.MYSQL_HOST,
  user     :  globals.MYSQL_USERNAME,
  password :  globals.MYSQL_PASSWORD,
  database :  globals.DATA_DB_NAME
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, (err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

query(`CREATE TABLE IF NOT EXISTS ${globals.USER_TABLE_NAME}
      (username VARCHAR(200) NOT NULL,
      password TEXT,
      data TEXT,
      time INTEGER,
      PRIMARY KEY(username))`)
      .then(result => {
        console.log("Successfully create table.")
      })
      .catch(error => {
        console.error("Error while trying to create table.")
        console.error(error);
      });

module.exports = { query };