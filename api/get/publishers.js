module.exports = async (pool, id = null, offset = 0, limit = 10) => {
  let data;
  if (id) {
    data = await pool.query('select book.title,' +
      ' book.published as published, book.price ' +
      'from publisher inner join book on publisher.id = book.publisherid ' +
      'and publisher.id=$1 limit $2 offset $3', [id, limit, offset]).rows;
  } else {
    data = await new Promise((resolve, reject) => {
      pool.query('select name,' +
        ' address' +
        ' from publisher limit $1 offset $2',
      [limit, offset], (err, res) => {
        if (err) {
          throw err;
        }
        console.log(res.rows);
        resolve(res.rows);
      });
    });
  }
  console.log(data);
  return data;
};
