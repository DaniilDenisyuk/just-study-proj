module.exports = async (pool, id = null, offset = 0, limit = 10) => {
  let data;
  if (id) {
    data = await pool.query('select book.title,' +
      ' book.published as published,' +
      ' book.price from author inner join book on author.id = book.authorid ' +
      'and author.id=$1 limit $2 offset $3', [id, limit, offset]).rows;
  } else {
    data = await pool.query('select book.title,' +
      ' book.published as published,' +
      ' book.price from author limit $1 offset $2',
    [limit, offset]).rows;
  }
  console.log(data);
  return data;
};
