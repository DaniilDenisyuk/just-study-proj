module.exports = async (id, column, { sort, limit, offset }) => {
  const sql = [];
  const values = [];
  let i = 1;
  sql.push('SELECT');
  if (id) {
    sql.push(`author.*, book.* FROM author INNER JOIN book ON author.id = book.authorid AND author.id=$${i++}`);
    values.push(id);
  } else sql.push('* FROM author');
  if (sort) {
    sql.push('ORDER BY');
    const fields = sort.split(',');
    let count = fields.length;
    for (const field of fields) {
      const order = field.charAt(0) === '-' ? 'DESC' : 'ASK';
      sql.push(`${field.substring(1)} ${order}`);
      count--;
      if (count > 0) sql.push(',');
    }
  }
  sql.push(`LIMIT ${i++}`);
  values.push(limit ? `${limit}` : '10');
  sql.push(`OFFSET ${i++}`);
  values.push(offset ? `${offset}` : '0');
  const data = await this.db.query(sql.join(' '), values);
  console.log(data.rows);
  return data.rows;
};
