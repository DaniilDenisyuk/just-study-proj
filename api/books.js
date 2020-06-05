module.exports = async where => {
  const data = await db.query();
  console.log(data);
  return data;
};
