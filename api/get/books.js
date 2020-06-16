const defaultTable = 'book';
const defaultTableFields = ['*'];

module.exports = async function(id, column, filters) {
  if (id) {
    let fields = defaultTableFields;
    if (column) {
      fields = [column];
    }
    return this.db.select(defaultTable, filters, fields, { id });
  }
  return this.db.select(defaultTable, filters);
};
