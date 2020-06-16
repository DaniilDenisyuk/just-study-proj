const defaultTable = 'author';
const additionalTable = 'book';
const defaultTableFields = ['*'];
const defaultAddTableFields = ['title', 'published'];

module.exports = async function(id, column, filters) {
  if (id) {
    const instructions = {};
    instructions[defaultTable] = { fields: defaultTableFields, conditions: { id } };
    if (column) {
      instructions[defaultTable].fields = [column];
    }
    instructions[additionalTable] = { fields: defaultAddTableFields };
    return this.db.selectInnerJoin(instructions, filters);
  } else {
    return this.db.select(defaultTable, filters);
  }
};
