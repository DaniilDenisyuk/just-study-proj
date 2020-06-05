module.exports = async where => {
  const data = await db.select('Publishers', '*', where);
  console.log(data);
  return data;
};
