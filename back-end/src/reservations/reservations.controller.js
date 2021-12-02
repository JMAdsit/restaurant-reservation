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
    return next({ status: 400, message: `Requires request body.` });
  }
  
  //confirms properties exist and have appropriate values
  validProperties.forEach((prop) => {
    if(!data[prop]){
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_date" && !dateRegex.test(data.reservation_date)) {
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "reservation_time" && !timeRegex.test(data.reservation_time)) {
      return next({ status: 400, message: `Requires ${prop}.` });
    }
    if(prop === "people" && !Number.isInteger(data.people)) {
      return next({ status: 400, message: `Requires ${prop}.` });
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
      return next({ status: 400, message: `${prop} is not a valid property.` })
    }
  }

  return next();
}

function onlyValidDates(req, res, next) {
  //get data regardless of api style
  if(req.body.data){ req.body = req.body.data; }
  let data = req.body;

  //get day of the week
  const rDate = new Date(`${data.reservation_date} ${data.reservation_time}`);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = weekday[rDate.getDay()];

  //return error if date is a past Tuesday
  if(day === "Tuesday" && rDate < new Date()) {
    return next({ status: 400, message: `Cannot schedule in the past or on Tuesdays.` })
  }

  //return error if it's Tuesday
  if(day === "Tuesday") {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays.` })
  }

  //return error if date is in the past
  if(rDate < new Date()) {
    return next({ status: 400, message: `Must schedule in the future.` })
  }

  //return error if time is after 9:30
  if(data.reservation_time > "21:30:00"){
    return next({ status: 400, message: `Must schedule before 9:30 PM.` });
  }

  //return error if time before opening
  if(data.reservation_time < "10:30:00"){
    return next({ status: 400, message: `Must schedule after 10:30 AM.` });
  }

  return next();
}

async function reservationExists(req, res, next) {
  //get reservation
  const reservation = await service.read(req.params.reservation_Id);

  //if it exists, save reservation to locals and move to next
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  } 

  //return error if no reservation
  return next({ status: 404, message: `Reservation ${req.params.reservation_Id} not found.` })
}

async function list(req, res, next) {
  const { date } = req.query;
  const data = await service.list(date);
  res.status(200).json({ data });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function post(req, res) {
  const data = await service.post(req.body);
  res.status(201).json({ data: data });
}

module.exports = {
  list,
  read: [reservationExists, read],
  post: [hasValidProperties, hasOnlyValidProperties, onlyValidDates, post],
}