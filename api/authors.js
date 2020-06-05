module.exports = async (pool, condition) => {
  if (condition) {

  }
  const data = await pool.query();
  console.log(data);
  return data;
};
