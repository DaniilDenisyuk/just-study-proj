module.exports = async (pool, id, offset, limit) => {
  let data;
  if (!offset) offset = 0;
  if (!limit) limit = 10;
  if (id) {
    data = await this.db.query('select book.title,' +
      ' book.published as published,' +
      ' book.price from author inner join book on author.id = book.authorid ' +
      'and author.id=$1 limit $2 offset $3', [id, limit, offset]).rows;
  } else {
    data = await new Promise((resolve, reject) =>  {
      pool.query('select name,' +
      'address from author limit $1 offset $2',
      [limit, offset], (err, res) => {
        if (err) {
          throw err;
        }
        console.log(res.rows);
        resolve(res.rows);
      });
    }
    );
  }
  console.log(data);
  return data;
};
