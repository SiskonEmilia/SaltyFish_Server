const pool = require('./db');
const go = require('../global/goStyleAsync')
const sha256 = require('js-sha256')
const globals = require('../global/global')

async function addUser(user) {
  /*
  * user.username user.password
  */
  let [err, rows] = await go(pool.query(
    `SELECT username FROM ${globals.USER_TABLE_NAME}
    WHERE username='${user.username}'`
  ));
  
  if (err) {
    console.error("Error while trying to add user: ", user);
    console.error(err);
    return [err, false];
  }

  if (rows.length !== 0) {
    console.log("Failed to add user due to duplicated username.");
    return [null, false]
  }

  [err, rows] = await go(pool.query(`INSERT INTO ${globals.USER_TABLE_NAME} (username, password, time)
        VALUES('${user.username}', '${sha256(user.password)}', 0)`));
  
  if (err) {
    console.error("Error while trying to add user: ", user);
    console.error(err);
    return [err, false];
  }

  console.log('Successfully added user:', user.username);
  return [null, true];
}

async function checkPass(user) {
  /*
  * user.username user.password
  */
  let [err, rows] = await go(pool.query(
    `SELECT username FROM ${globals.USER_TABLE_NAME}
    WHERE username='${user.username}' AND password='${sha256(user.password)}'`
  ));

  if (err) {
    console.error("Error while checking pass of user: ", user);
    console.error(err);
    return [err, false];
  }

  if (rows.length === 0) {
    console.log('Check failed due to no such user or invalid password, ', user);
    return [null, false]
  }

  console.log('Successfully login:', user.username);
  return [null, true];
}

async function getUpdateTime(user) {
  let [err, rows] = await go(pool.query(
    `SELECT time FROM ${globals.USER_TABLE_NAME}
    WHERE username='${user.username}'`
  ));

  if (err) {
    console.error("Error while querying updated time: ", user.username);
    console.error(err);
    return [err, rows];
  }

  return [null, rows];
}

async function putData(user) {
  let [err, rows] = await go(pool.query(
    `UPDATE ${globals.USER_TABLE_NAME} SET data='${user.data.toString()}'
    WHERE username='${user.username}'`
  ));

  if (err) {
    console.error("Error while putting data: ", user.username);
    console.error(err);
    return [err, false];
  }

  console.log('Data updated @' + user.username);
  return [null, true];
}

async function getData(user) {
  let [err, rows] = await go(pool.query(
    `SELECT data FROM ${globals.USER_TABLE_NAME}
    WHERE username='${user.username}'`
  ));

  if (err) {
    console.error("Error while putting data: ", user.username);
    console.error(err);
    return [err, null];
  }

  console(user.username, "is getting data.")
  return [null, rows];
}

async function updateUser(user) {
  let [err, status] = await checkPass({
    username: user.username,
    password: user.oldPassword
  });
  if (err) {
    return [err, null];
  }
  else if (status !== true) {
    console.log("Invalid username or password when trying to update user info.")
    return [null, false];
  }

  [err, rows] = await go(pool.query(
    `UPDATE ${globals.USER_TABLE_NAME} SET password = '${user.password}'
    WHERE username='${user.username}'`
  ));

  if (err) {
    console.error("Error while updating user info: ", user.username);
    console.error(err);
    return [err, false];
  }

  console.log("Successfully updated user:", user.username);
  return [null, true];
}

module.exports = {
  addUser, checkPass, getUpdateTime, putData, getData, updateUser
}