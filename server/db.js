async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql");
    const connection = await mysql.createConnection(`mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DB}`);
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}
 
async function findUser(username) {
    const conn = await connect();
    const entity = await conn.query(`SELECT * FROM guacamole_entity WHERE name=? LIMIT 1`, [username]);
    if (entity.length === 0)
        return null;
    const entity_id = entity.entity_id;
    const user = await conn.query(`SELECT * FROM guacamole_user WHERE entity_id=? LIMIT 1`, [entity_id]);
    if (user.length > 0)
        return user;
    else return null;
}
 
async function findUserById(id) {
    const conn = await connect();
    const user = await conn.query(`SELECT * FROM guacamole_user WHERE user_id=? LIMIT 1`, [id]);
    if (user.length > 0)
        return user;
    else return null;
}
 
module.exports = { connect, findUser, findUserById }
