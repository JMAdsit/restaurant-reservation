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
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  let data = req.body;

  //date and time regex
  let dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
  let timeRegex = /[0-9]{2}:[0-9]{2}/;

  //error if no data
  if(!data) { 
    next({ status: 400, message: `Requires request body.` });
  }
  
  //confirms properties exist and have appropriate values
  validProperties.forEach((prop) => {
    if(!data[prop]){
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_date" && !dateRegex.test(data.reservation_date)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_time" && !timeRegex.test(data.reservation_time)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "people" && !Number.isInteger(data.people)) {
      next({ status: 400, message: `Requires ${prop}.` });
    }
  })

  next();
}

function hasOnlyValidProperties(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  let data = req.body;

  //confirm no unexpected properties exist
  for(const prop in data) {
    if(!validProperties.includes(prop)) {
      next({ status: 400, message: `${prop} is not a valid property.` })
    }
  }

  next();
}

function onlyValidDates(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  let data = req.body;

  //get day of the week
  const rDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = weekday[rDate.getDay()];

  if(day === "Tuesday" && rDate < new Date()) {
    next({ status: 400, message: `Cannot schedule in the past or on Tuesdays.` })
  }

  if(day === "Tuesday") {
    next({ status: 400, message: `Restaurant is closed on Tuesdays.` })
  }

  if(rDate < new Date()) {
    next({ status: 400, message: `Must schedule in the future.` })
  }

  if(data.reservation_time > "21:30:00"){
    next({ status: 400, message: `Must schedule before 9:30 PM.` });
  }

  if(data.reservation_time < "10:30:00"){
    next({ status: 400, message: `Must schedule after 10:30 AM.` });
  }

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
  post: [hasValidProperties, hasOnlyValidProperties, onlyValidDates, post],
}