/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");

async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data });
}

module.exports = {
  list,
};
