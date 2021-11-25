/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
];



function hasValidProperties(req, res, next) {
  if(req.body.data){ req.body = req.body.data; }
  if(!req.body) { 
    next({ status: 400, message: `Requires request body.` });
  }
  let dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  let timeRegex = /[0-9]{2}:[0-9]{2}/;
  
  validProperties.forEach((prop) => {
    if(!req.body[prop]){
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_date" && !dateRegex.test(req.body.reservation_date)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_time" && !timeRegex.test(req.body.reservation_time)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "people" && !Number.isInteger(req.body.people)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
  })
  next();
}

function hasOnlyValidProperties(req, res, next) {
  // req.body.forEach((prop) => {
  //   if(!validProperties.includes(prop)) {
  //     next({ status: 400, "message": `${prop} is not a valid property.` })
  //   }
  // })
  next();
}

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.status(200).json({ data });
}

async function post(req, res) {
  const data = await service.post(req.body);
  res.status(201).json({ data: data });
}

module.exports = {
  list,
  post: [hasValidProperties, hasOnlyValidProperties, post],
};
