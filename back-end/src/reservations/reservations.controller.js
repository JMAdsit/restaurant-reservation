/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function post(req, res) {
  const data = await service.post(req.body.data);
  res.json({ data: data });
}

module.exports = {
  list,
  post,
};
