module.exports = async (pool, id = null, offset = 0, limit = 10) => {
  let data;
  if (id) {
    data = await this.pool.query('select book.title, ' +
      'book.published as published,' +
      'book.price, author.name as author, publisher.name as publisher ' +
      'from book inner join author on book.authorid = author.id ' +
      'inner join publisher on book.publisherid = publisher.id  and book.id=$1',
    [id]).rows;
  } else {
    data = await this.pool.query('select book.title, ' +
      'book.published as published,' +
      ' book.price, author.name as author, ' +
      'publisher.name as publisher from book limit $1 offset $2',
    [limit, offset]).rows;
  }
  console.log(data);
  return data;
};
