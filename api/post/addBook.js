module.exports = async (pool, record) => {
  let data;
  if (record) {
    data = await pool.query(
      'INSERT INTO Book (Title, Description, published, AuthorId, PublisherId, Price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [record.title, record.description,  record.published, record.authorId, record.publisherId, record.price]);
  } else {
    data = 'The record sent is empty!!!';
  }
  console.log(data);
  return data;
};
