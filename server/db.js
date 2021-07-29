var connection;

async function setConnection(con) {
  connection = con;
}
 
async function findUser(username) {
    if (!connection)
        return null;
    const entity = await connection.query(
      `SELECT * FROM guacamole_entity WHERE name=? LIMIT 1`,
      [username],
      function (error, results, fields) {
        if (error) throw error;
        console.log('Nome de usuário não encontrado');
      }
    );
    if (entity.length === 0)
        return null;
    const entity_id = entity.entity_id;
    const user = await connection.query(
      `SELECT * FROM guacamole_user WHERE entity_id=? LIMIT 1`,
      [entity_id],
      function (error, results, fields) {
        if (error) throw error;
        console.log('ID de entidade não é de usuário');
      }
    );
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
